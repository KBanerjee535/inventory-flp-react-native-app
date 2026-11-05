# Test Images for Property Condition AI Detection

This folder is for storing **real property inspection photos** to test the AI image analysis feature.

## How to use

1. **Drop your property photos in this folder:**
   ```
   assets/testImages/
   ├── damaged-wall.jpg
   ├── leaky-pipe.jpg
   ├── broken-fixture.jpg
   ├── worn-floor.jpg
   ├── electrical-issue.jpg
   ├── mold-damp.jpg
   ├── broken-window.jpg
   ├── dirty-room.jpg
   ├── scratched-door.jpg
   └── exterior-damage.jpg
   ```

2. **Update `utils/testImageSamples.js`** — replace the `imageUrl` in each sample with your imported image:
   ```js
   import damagedWall from '../assets/testImages/damaged-wall.jpg';

   // Then in the SAMPLES array:
   {
     id: 'wall-damage',
     label: 'Cracked Wall',
     category: 'Walls & Ceilings',
     description: 'Wall with visible cracks and peeling paint',
     imageUrl: Image.resolveAssetSource(damagedWall).uri,
   }
   ```

3. **Run the app in dev mode** — the "🧪 Test Samples" panel appears on the Analyze Image screen.

## Categories tested

| Category | What the AI should detect |
|----------|--------------------------|
| Walls & Ceilings | Cracks, peeling paint, damp patches, holes |
| Flooring | Stains, scratches, loose tiles, warping |
| Fixtures & Fittings | Broken handles, loose fittings, missing parts |
| Plumbing | Leaks, corrosion, dripping taps |
| Electrical | Exposed wires, broken switches, missing covers |
| Windows & Doors | Cracked glass, broken handles, draughts |
| Furniture | Tears, stains, broken legs, wear |
| Cleaning Required | Dirt, dust, cobwebs, grime |
| Outdoor/Exterior | Fence damage, wall cracks, gutter issues |
| General Condition | Overall room state assessment |