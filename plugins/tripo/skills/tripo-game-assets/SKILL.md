---
name: tripo-game-assets
description: "Make 3D models for a game or a 3D scene with Tripo, from a description or a picture (a phone photo of a sketch works), and rig and animate them. Use when a task needs a 3D model and the Tripo plugin is installed."
---

# Game assets with Tripo

Make models with Ramu's `make_model` tool; it runs on Tripo, waits for the task, downloads the GLB and keeps it as an attachment (and at `assets/models/<name>.glb` in a project). Never call `curl` with the key or ask the person for it: it is on the plugin's card in Settings → Plugins.

1. **From a picture.** Tripo is strongest from an image: pass `make_model` an `image` (an attachment id such as a photo the person sent, or concept art from `generate_image`). One subject, plain background, the whole object in frame.
2. **From words.** `prompt` names one subject with its style and materials ("a low-poly cartoon fox, orange and white").
3. **Budget triangles.** `detail: "low"` (about 5,000 triangles) for phone games and anything repeated, `"medium"` for a hero model. Keep a phone scene near 50,000 triangles.
4. **Rig and animate.** `tripo_animate` with the model's task id and a preset (`preset:run`, `preset:walk`, `preset:idle`, `preset:jump`) rigs it; when that task succeeds, `tripo_retarget` applies the motion. Ask `tripo_task_status` until each succeeds; its `model_urls.glb` is the animated model.
5. **Use the model.** In three.js load it with `GLTFLoader` (`import fox from './models/fox.glb'` in an App) and play clips with `THREE.AnimationMixer`; in Godot put it in `res://assets/models/`; in Unity in `Assets/Models/` with glTFast.
6. Each model spends Tripo credits; `tripo_balance` reads what is left for free. If a call stops for lack of credits, tell the person and carry on with shapes in code.
