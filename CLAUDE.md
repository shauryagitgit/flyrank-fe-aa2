# FE-AA2 build notes

## Goal
Ship a polished, accessible interactive 3D browser experience for FlyRank's FE-AA2 assignment.

## Architecture
- React + Vite
- React Three Fiber + Drei + Three.js
- The 3D canvas is isolated in `Scene` and the product geometry is isolated in `Product`.
- UI controls remain ordinary HTML buttons so they work with keyboard and assistive technology.

## Interaction contract
- Orbit/zoom are available through `OrbitControls`.
- Finish selection is the primary meaningful interaction beyond orbiting.
- Auto-rotate is independently toggleable.
- Specs panel can be expanded/collapsed.

## Performance decisions
- Canvas DPR is capped with `dpr={[1, 1.7]}`.
- Scene is loaded inside `Suspense` with a visible progress fallback.
- Geometry is intentionally lightweight and procedural; no large model downloads are required.
- Decorative sparkles are kept low-count.

## Validation
Before delivery, run:

```bash
npm install
npm run build
```

Check that the deployed page loads and that finish switching and auto-rotate respond without layout breakage.
