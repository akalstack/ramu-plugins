---
name: higgsfield-in-ramu
description: "Make video, images, music, speech, sound effects and edits with Higgsfield in Ramu, signed in with the person's Higgsfield account. Use when a task needs generated media and the Higgsfield plugin is installed."
---

# Higgsfield in Ramu

Higgsfield's own MCP server is connected as `higgsfield`, signed in with the person's Higgsfield account. Never ask for a key or a password: sign-in is on the plugin's card in Settings → Plugins.

1. **Video:** use Ramu's `make_video` tool. It runs on Higgsfield (Seedance 2.5 by default), waits for the job, downloads the file and keeps it as an attachment. Call Higgsfield's `generate_video` yourself only for what `make_video` does not take: a specific model (`kling3_0` for several shots or motion transfer, `minimax_h3` for 2K keyframes), reference images or a driving video.
2. **Everything else** is Higgsfield's own tools, each approved like any MCP call:
   - images: `generate_image` (`gpt_image_2_6` by default), `upscale_image`, `remove_background`, `reframe`
   - audio: `generate_audio` for speech (`seed_audio`, voices from `list_voices`), music (`suno_music`, with a duration) and sound effects (`mirelo_text_to_audio`, with a duration); `voice_change`, `create_voice`
   - `models_explore` lists models and what each takes; read it before choosing a model by name.
3. **Jobs run in the background.** A generate tool returns job ids in `results[].id`; poll `job_status` with `jobId`, waiting the `poll_after_seconds` it gives, until `generation.status` is `completed`, then download `generation.results.rawUrl` into the project. `failed`, `nsfw` or `ip_detected` end the job: say why and stop.
4. **Files from the person** go through `media_upload` (or `media_import_url` for a web address) first; pass the returned `media_id`, never a URL, in `medias`.
5. **Credits.** Every generation spends the person's Higgsfield credits. Check with `balance` before a large batch, price one with `estimate_image_cost`, `estimate_video_cost` or `estimate_audio_cost` when asked what it costs, and say roughly what you spent. If a call stops for lack of credits, tell the person and offer `show_plans_and_credits`.
6. For a whole workflow (a brand kit, a product photoshoot, an explainer, a YouTube thumbnail), Higgsfield's own plugin, offered beside this one, has skills that walk through it.
