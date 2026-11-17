#!/usr/bin/env node
// A small MCP server for Tripo's 3D API, with no dependencies: newline-delimited JSON-RPC over stdio. It starts tasks
// and reports them; the finished model is a link the host downloads, since a tool result may not carry the file.
import { readFile } from 'node:fs/promises'
import { createInterface } from 'node:readline'
import { extname } from 'node:path'

const API = 'https://api.tripo3d.ai/v2/openapi'
const key = () => {
  const value = process.env.TRIPO_API_KEY?.trim()
  if (!value) throw new Error('TRIPO_API_KEY is not set. Add the Tripo API key on the plugin card in Ramu.')
  return value
}

async function tripo(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${key()}`, ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }), ...init.headers },
    signal: AbortSignal.timeout(45_000),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok || body.code !== 0)
    throw new Error(`Tripo answered ${response.status}: ${body.message ?? body.suggestion ?? 'no reason given'}`)
  return body.data
}

const IMAGE_TYPES = { '.png': 'png', '.jpg': 'jpg', '.jpeg': 'jpg', '.webp': 'webp' }

/** Uploads a local image and returns the file reference a task takes. */
async function uploadImage(path) {
  const type = IMAGE_TYPES[extname(path).toLowerCase()]
  if (!type) throw new Error('Pass a .png, .jpg or .webp image.')
  const form = new FormData()
  form.append('file', new Blob([await readFile(path)], { type: `image/${type === 'jpg' ? 'jpeg' : type}` }), `image.${type}`)
  const data = await tripo('/upload', { method: 'POST', body: form })
  return { type, file_token: data.image_token }
}

const created = (data) => ({ task_id: data.task_id, status: 'queued' })

const TOOLS = {
  tripo_text_to_model: {
    description: 'Start a 3D model from a description. Returns a task id; ask tripo_task_status about it until it succeeds.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', maxLength: 1024, description: 'What to make: one subject, its style and materials.' },
        face_limit: { type: 'number', minimum: 500, maximum: 200000, description: 'Most triangles the model may have.' },
        texture: { type: 'boolean', description: 'Texture the model (default true).' },
      },
      required: ['prompt'],
    },
    readOnly: false,
    run: async ({ prompt, face_limit, texture }) =>
      created(
        await tripo('/task', {
          method: 'POST',
          body: JSON.stringify({
            type: 'text_to_model',
            prompt: String(prompt).slice(0, 1024),
            ...(face_limit ? { face_limit: Math.round(face_limit) } : {}),
            ...(texture === false ? { texture: false } : { texture: true, pbr: true }),
          }),
        }),
      ),
  },
  tripo_image_to_model: {
    description: 'Start a 3D model from a picture on this computer (concept art, a photo of a sketch). Returns a task id.',
    inputSchema: {
      type: 'object',
      properties: {
        file_path: { type: 'string', description: 'Absolute path of a .png, .jpg or .webp image.' },
        face_limit: { type: 'number', minimum: 500, maximum: 200000 },
        texture: { type: 'boolean' },
      },
      required: ['file_path'],
    },
    readOnly: false,
    run: async ({ file_path, face_limit, texture }) =>
      created(
        await tripo('/task', {
          method: 'POST',
          body: JSON.stringify({
            type: 'image_to_model',
            file: await uploadImage(String(file_path)),
            ...(face_limit ? { face_limit: Math.round(face_limit) } : {}),
            ...(texture === false ? { texture: false } : { texture: true, pbr: true }),
          }),
        }),
      ),
  },
  tripo_animate: {
    description: 'Rig a finished model and give it a preset motion (preset:walk, preset:run, preset:idle, preset:jump). Returns a task id.',
    inputSchema: {
      type: 'object',
      properties: {
        task_id: { type: 'string', description: 'The finished model task.' },
        animation: { type: 'string', description: 'A preset such as preset:run.' },
      },
      required: ['task_id', 'animation'],
    },
    readOnly: false,
    run: async ({ task_id, animation }) => {
      const rig = await tripo('/task', { method: 'POST', body: JSON.stringify({ type: 'animate_rig', original_model_task_id: task_id, out_format: 'glb' }) })
      return { ...created(rig), next: `When this rig task succeeds, call tripo_retarget with task_id ${rig.task_id} and animation ${animation}.` }
    },
  },
  tripo_retarget: {
    description: 'Apply a preset motion to a rigged model task. Returns a task id.',
    inputSchema: {
      type: 'object',
      properties: { task_id: { type: 'string' }, animation: { type: 'string' } },
      required: ['task_id', 'animation'],
    },
    readOnly: false,
    run: async ({ task_id, animation }) =>
      created(
        await tripo('/task', {
          method: 'POST',
          body: JSON.stringify({ type: 'animate_retarget', original_model_task_id: task_id, animation, out_format: 'glb' }),
        }),
      ),
  },
  tripo_task_status: {
    description: "A task's status once: queued, running, success or failed, and its model's link when it succeeded.",
    inputSchema: { type: 'object', properties: { task_id: { type: 'string' } }, required: ['task_id'] },
    readOnly: true,
    run: async ({ task_id }) => {
      const data = await tripo(`/task/${encodeURIComponent(String(task_id))}`)
      const output = data.output ?? {}
      const glb = output.pbr_model ?? output.model ?? output.base_model
      return {
        task_id: data.task_id,
        status: data.status,
        progress: data.progress ?? 0,
        ...(glb ? { model_urls: { glb } } : {}),
        ...(output.rendered_image ? { thumbnail_url: output.rendered_image } : {}),
        ...(data.status === 'failed' || data.status === 'banned' ? { message: 'Tripo could not make this model.' } : {}),
      }
    },
  },
  tripo_balance: {
    description: "The account's credit balance. Free.",
    inputSchema: { type: 'object', properties: {} },
    readOnly: true,
    run: async () => {
      const data = await tripo('/user/balance')
      return { balance: data.balance, frozen: data.frozen }
    },
  },
}

const send = (message) => process.stdout.write(`${JSON.stringify(message)}\n`)

async function handle(request) {
  const { id, method, params } = request
  if (method === 'initialize')
    return {
      protocolVersion: params?.protocolVersion ?? '2025-06-18',
      capabilities: { tools: {} },
      serverInfo: { name: 'tripo', version: '1.0.0' },
    }
  if (method === 'ping') return {}
  if (method === 'tools/list')
    return {
      tools: Object.entries(TOOLS).map(([name, tool]) => ({
        name,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: { readOnlyHint: tool.readOnly, openWorldHint: true },
      })),
    }
  if (method === 'tools/call') {
    const tool = TOOLS[params?.name]
    if (!tool) return { isError: true, content: [{ type: 'text', text: `No tool named ${params?.name}.` }] }
    try {
      const value = await tool.run(params.arguments ?? {})
      return { content: [{ type: 'text', text: JSON.stringify(value) }], structuredContent: value }
    } catch (error) {
      return { isError: true, content: [{ type: 'text', text: String(error?.message ?? error) }] }
    }
  }
  if (id === undefined) return undefined
  throw Object.assign(new Error(`Unknown method ${method}`), { code: -32601 })
}

createInterface({ input: process.stdin }).on('line', (line) => {
  let request
  try {
    request = JSON.parse(line)
  } catch {
    return send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } })
  }
  void handle(request).then(
    (result) => {
      if (request.id !== undefined && result !== undefined) send({ jsonrpc: '2.0', id: request.id, result })
    },
    (error) => {
      if (request.id !== undefined) send({ jsonrpc: '2.0', id: request.id, error: { code: error.code ?? -32603, message: error.message } })
    },
  )
})
