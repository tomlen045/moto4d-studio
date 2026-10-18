# Moto4D Studio

English | [简体中文](README.zh-CN.md)

An open-source, local-first 4D engineering visualization workspace for motorcycle product development. It adds process timelines, simple mechanism previews, and time-varying mesh or point-cloud sequences around CAD data exported from CATIA.

## What it does

- Import STEP, STP, IGES, IGS, and BREP files in the desktop app. Assembly names and hierarchy are read through the Open CASCADE WebAssembly runtime.
- Create assembly-process notes with timestamps, tools, and torque fields; move selected components with pose keyframes; scrub and play the sequence.
- Preview a single driven revolute or prismatic joint with editable axis, range, and speed.
- Import STL, OBJ, PLY, glTF, or GLB geometry. In time-varying geometry mode, multiple files become discrete frames; unindexed PLY files render as point clouds.
- Save and reopen `.m4d` project settings, record a viewport preview to WebM, and work without sending model files to a server.
- Package the same Electron app for macOS and Windows.

## Run from source

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

For the desktop wrapper during development, keep the Vite server running in one terminal and start Electron in a second terminal:

```sh
npm run dev
```

```sh
npm run desktop
```

Build a macOS DMG/ZIP on macOS:

```sh
npm run dist:mac
```

Build a Windows installer/ZIP on Windows:

```sh
npm run dist:win
```

The `Build desktop artifacts` GitHub Actions workflow can also be run manually. It builds Apple Silicon and Intel Mac artifacts plus a Windows x64 installer on native runners, then uploads unsigned artifacts. Code signing and notarization are not configured.

## Project workflow

1. Export an assembly from CATIA as STEP (AP203/AP214/AP242 where available), then import it into Moto4D Studio.
2. Select a component, set its pose, and add timeline keyframes. Add process notes for the installation or inspection steps.
3. Use the motion workspace for a simple one-axis movement preview, or the geometry workspace to play a sequence of mesh/point-cloud files.
4. Save a `.m4d` file. It stores timeline and project settings, not CAD/mesh geometry. Reopen the source model files first, then open the `.m4d` project to reconnect settings to matching component paths.

All parsing and rendering is local in the desktop app. Source CAD files are not uploaded.

## Engineering scope

This is an early MVP for explaining and reviewing product/process changes. It does not edit native CATIA documents, solve full multi-joint kinematic constraints, simulate forces/contact/collision, interpolate changing mesh topology, or certify design safety. Its motion and geometry views are visual aids and are not CATIA DMU, CAE, manufacturing validation, or homologation results. See [`docs/scope-and-architecture.md`](docs/scope-and-architecture.md).

## License

The application source is MIT-licensed. Third-party components keep their own licenses; see [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

