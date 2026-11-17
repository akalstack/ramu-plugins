---
name: godot-projects
description: "Make, run, check and export a Godot 4 game: project layout, the text scene format, GDScript, importing GLB models and exporting for the web. Use when the project has a project.godot or the person asks for a Godot game."
---

# Godot projects

Run Godot through `platform_cli` with `platform: "godot"`. `--version` and `--headless --check-only` only read and run without asking; anything else (importing, running a scene, exporting) asks the person first.

1. **Layout.** `project.godot` at the root; scenes in `scenes/` (`main.tscn`), scripts in `scripts/` (`player.gd`), models in `assets/models/`, sounds in `assets/audio/`. Set `run/main_scene="res://scenes/main.tscn"` under `[application]`.
2. **Scenes are text.** A `.tscn` lists `[ext_resource]`s (scripts, models) with `id`s, then `[node name=... type=... parent=...]` entries; edit it as text, keeping `load_steps` equal to the resources plus one. A GLB model is instanced as `[node name="Fox" parent="." instance=ExtResource("2")]` after `[ext_resource type="PackedScene" path="res://assets/models/fox.glb" id="2"]`.
3. **Scripts.** GDScript 2 with static types: `extends CharacterBody3D`, `@export var speed := 6.0`, movement in `_physics_process(delta)` with `Input.get_vector("ui_left", "ui_right", "ui_up", "ui_down")`. Add touch controls (`TouchScreenButton` or a virtual joystick) when the game should play on a phone.
4. **Check.** `["--headless", "--check-only", "--script", "res://scripts/player.gd"]` parses one script; after editing many files, `["--headless", "--import"]` (asks first) imports assets and reports every error once.
5. **Export for the web.** The project needs an `export_presets.cfg` with a `Web` preset (`platform="Web"`, `export_path="build/web/index.html"`) and the export templates for this Godot version installed. Then `["--headless", "--export-release", "Web", "build/web/index.html"]` (asks first). `build/web` is a static site: **Publish to the web** or a deploy puts it online; it needs the `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp` headers unless the preset turns threads off (`variant/thread_support=false`), which is the simpler choice for publishing.
