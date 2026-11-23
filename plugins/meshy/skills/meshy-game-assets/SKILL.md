---
name: meshy-game-assets
description: "Make 3D models for a game or a 3D scene with Meshy: characters, props, buildings, rigging, animation and 3D printing, sized for three.js, Godot or Unity. Use when a task needs a 3D model and the Meshy plugin is installed."
---

# Game assets with Meshy

Meshy's own MCP server is connected as `meshy`, on the Meshy API key saved on the plugin's card in Settings → Plugins (Meshy's API needs the Pro plan or above). Never call `curl` with the key, ask the person for it, install `meshy-cli` or run its sign-in.

1. **Make models with Ramu's `make_model` tool.** It runs on Meshy (Meshy 7.1), waits for the task, downloads the GLB and keeps it as an attachment (and at `assets/models/<name>.glb` in a project). A text model is made as a preview and textured after; an `image` (an attachment) is textured in one task.
2. **Look first, then shape.** For a character or anything that must look a certain way, make concept art with `generate_image` (one subject, plain background, three-quarter view, full body), show it, then `make_model` with that image. A plain prop (a coin, a crate, a tree) can go straight from a `prompt`.
3. **Budget triangles.** `detail: "low"` (about 5,000 triangles) for anything on a phone or repeated many times, `"medium"` for a hero character on the desktop, `"high"` only for a close-up still. Keep a whole phone scene near 50,000 triangles. For clean, part-separated game topology call `meshy_text_to_3d` or `meshy_image_to_3d` yourself with `model_type: "smart-topology"` and a `target_polycount` (100 to 30,000 faces).
4. **Meshy's other tools** are approved like any MCP call. Wait on each task with `meshy_get_task_status`, then save the file with `meshy_download_model` and a `save_to` path in the project (`assets/models/`):
   - a character that moves: `meshy_rig` on the model's task id, then `meshy_animate` with action ids from `meshy_list_animations` (walk, run, jump, idle; up to 10 clips in one file), or `meshy_text_to_motion` for a motion described in words
   - `meshy_retexture`, `meshy_remesh`, `meshy_convert` (FBX, OBJ, USDZ, STL, 3MF), `meshy_resize` to real-world size, `meshy_uv_unwrap`
   - printing: `meshy_analyze_printability` (free), `meshy_repair_printability`, `meshy_process_multicolor`, `meshy_send_to_slicer`
   - `meshy_list_models` and `meshy_list_tasks` find what was made before; reuse a model instead of making it again.
5. **Name and scale.** Name files for what they are (`fox.glb`, `coin.glb`). glTF measures in meters: a character about 1.7 tall, a coin about 0.05. Scale in code (`model.scale.setScalar(...)`) rather than asking for a new model.
6. **Use the model.**
   - three.js (an App or a web project): `import fox from './models/fox.glb'` or `ramuAsset('models/fox.glb')`, then `new GLTFLoader().loadAsync(url)`; play clips with `THREE.AnimationMixer`; clone a rigged model with `SkeletonUtils.clone`.
   - Godot: put the GLB in `res://assets/models/`; Godot imports it as a scene you instance.
   - Unity: put it in `Assets/Models/`; Unity imports GLB with the glTFast package.
7. **Credits.** Every task spends the person's Meshy credits: about 20 for a text preview and 10 more to texture it, 30 for a textured model from an image, 5 (15 textured) for Smart Topology, 5 to rig and 3 per animation. Check `meshy_check_balance` before a batch, say roughly what you spent, and cancel a task still pending with `meshy_cancel_task` (it is refunded). If a call stops for lack of credits, tell the person and carry on with shapes in code. Pass `meshy-7.1` or `latest` when you name a model: `meshy-7` stops making models after 31 December 2026.
8. Meshy's own skills (`meshy-3d-generation`, offered beside this plugin) choose models and pipelines for a project. They are written for the Meshy CLI: follow their choices, but run each step with the `meshy` tools above.
