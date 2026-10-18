# Scope and architecture

## Product decision

Moto4D Studio is a companion workflow around existing CATIA authoring, not a replacement for CATIA. The first useful exchange boundary is neutral CAD export (STEP/IGES/BREP), paired with a separate `.m4d` project file containing time-based annotations and motion settings.

The MVP combines the three requested meanings of “4D” in one desktop application:

1. **Assembly process timeline:** named CAD components, pose keyframes, timestamped work instructions, tool and torque notes, playback, and a simple radial explode view.
2. **Mechanism motion preview:** a user-configurable single revolute or prismatic drive on a selected component.
3. **Time-varying geometry:** ordered mesh/point-cloud snapshots, frame selection, and playback.

## Technical choices

- Electron packages a shared macOS/Windows application shell.
- Three.js renders the viewport and timeline-driven previews.
- `@tx-code/occt-js` parses neutral CAD files in WebAssembly. This package is LGPL-2.1 with an additional OCCT exception; see the bundled notice and upstream terms.
- Meshes and point clouds remain local. `.m4d` stores settings and references to source filenames rather than embedding the source geometry.

## Known limits

- The motion preview drives one degree of freedom per joint definition; there is no constraint graph, loop closure, physical solver, or collision analysis.
- Geometry sequences switch between discrete files. They do not infer correspondence or morph changing topology between frames.
- STEP import is a neutral-format viewer path, not native CATIA feature/history editing. Neutral export fidelity depends on the source file and converter.
- Keyframe association uses component names along their assembly paths. Renaming or restructuring the source assembly can break the association.
- The bundled demo motorcycle and deformation sequence are illustrative, not production vehicle geometry or validated engineering data.
- Desktop artifacts produced by CI are unsigned. macOS notarization and Windows signing need release credentials and configuration.

## Research notes

- Dassault Systèmes describes CATIA DMU Kinematics as supporting mechanism definition and simulation, which is beyond this MVP's single-axis preview: https://www.3ds.com/assets/edu/document/learning-experiences-for-catiav5.pdf
- Open CASCADE CAD Assistant documents Windows/macOS support and STEP AP203/AP214/AP242 reading with assembly structure: https://www.opencascade.com/products/cad-assistant/
- FreeCAD publishes Windows and macOS downloads and STEP import/export capabilities: https://www.freecad.org/downloads.php?lang=us and https://www.freecad.org/features.php?lang=en
- Open4D is an existing open-source project focused on time-varying point clouds and meshes; it is not a motorcycle-CAD process workbench: https://github.com/open4dfoundation/Open4D
- `@tx-code/occt-js` exposes STEP/IGES/BREP parsing and assembly-tree data in WebAssembly: https://github.com/tx-code/occt-js

