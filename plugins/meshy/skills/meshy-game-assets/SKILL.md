---
name: meshy-game-assets
description: "Make 3D models for a game or a 3D scene with Meshy: characters, props, buildings, rigging and animation, sized for three.js, Godot or Unity. Use when a task needs a 3D model and the Meshy plugin is installed."
---

# Game assets with Meshy

Make models with Ramu's `make_model` tool; it runs on Meshy, waits for the task, downloads the GLB and keeps it as an attachment (and at `assets/models/<name>.glb` in a project). Never call `curl` with the key or ask the person for it: it is on the plugin's card in Settings → Plugins.

1. **Look first, then shape.** For a character or anything that must look a certain way, make concept art with `generate_image` (one subject, plain background, three-quarter view, full body), show it, then `make_model` with `image` set to that attachment: Meshy textures it in one task. A plain prop (a coin, a crate, a tree) can go straight from a `prompt`; it is made as a preview and textured after.
2. **Budget triangles.** `detail: "low"` (about 5,000 triangles) for anything on a phone or repeated many times, `"medium"` for a hero character on the desktop, `"high"` only for a close-up still. Keep a whole phone scene near 50,000 triangles.
3. **Rig and animate with Meshy's own tools.** A character that moves needs `meshy_rig` on the model's task id, then `meshy_animate` with an action from `meshy_list_animations` (walk, run, jump, idle). These are Meshy's tools, approved like any Shared MCP call; download the animated GLB with `meshy_get_task_status` and pass it to the App as a file. Retexture (`meshy_retexture`) and remesh (`meshy_remesh`) work the same way.
4. **Name and scale.** Name files for what they are (`fox.glb`, `coin.glb`). glTF measures in meters: a character about 1.7 tall, a coin about 0.05. Scale in code (`model.scale.setScalar(...)`) rather than asking for a new model.
5. **Use the model.**
   - three.js (an App or a web project): `import fox from './models/fox.glb'` or `ramuAsset('models/fox.glb')`, then `new GLTFLoader().loadAsync(url)`; play clips with `THREE.AnimationMixer`; clone a rigged model with `SkeletonUtils.clone`.
   - Godot: put the GLB in `res://assets/models/`; Godot imports it as a scene you instance.
   - Unity: put it in `Assets/Models/`; Unity imports GLB with the glTFast package.
6. Each model spends Meshy credits (about 20 for a preview, 10 more to texture it). Say what you made and roughly what it cost; if a call stops for lack of credits, tell the person and carry on with shapes in code.
