/**
 * Test Image Samples for Property Condition Detection
 *
 * Provides sample images to test the AI-powered image analysis feature.
 * Each sample includes a label, the expected category, and an image URL.
 *
 * HOW TO USE:
 * - In __DEV__ mode, the "Analyze Image" screen shows a "Test Samples" panel.
 * - Tap any sample to load it and run AI analysis on it.
 *
 * HOW TO ADD YOUR OWN IMAGES:
 * - Replace any imageUrl below with your own property photos.
 * - Add images to /assets/testImages/ and import them directly:
 *   import myWallImage from '../assets/testImages/damaged-wall.jpg';
 * - Then add to the SAMPLES array: { id: 'my-wall', label: 'Damaged Wall', category: 'Walls & Ceilings', imageUrl: Image.resolveAssetSource(myWallImage).uri }
 */

export const TEST_IMAGE_SAMPLES = [
  {
    id: 'wall-damage',
    label: 'Cracked Wall',
    category: 'Walls & Ceilings',
    description: 'Wall with visible cracks and peeling paint',
    imageUrl: 'https://picsum.photos/seed/wall-crack/800/600',
  },
  {
    id: 'door-damage',
    label: 'Damaged Door',
    category: 'Windows & Doors',
    description: 'Door with scratches and worn frame',
    imageUrl: 'https://picsum.photos/seed/door-damage/800/600',
  },
  {
    id: 'floor-stain',
    label: 'Stained Flooring',
    category: 'Flooring',
    description: 'Floor with stains and surface damage',
    imageUrl: 'https://picsum.photos/seed/floor-stain/800/600',
  },
  {
    id: 'plumbing-leak',
    label: 'Leaky Pipe',
    category: 'Plumbing',
    description: 'Pipe fitting with visible water leak',
    imageUrl: 'https://picsum.photos/seed/pipe-leak/800/600',
  },
  {
    id: 'fixture-broken',
    label: 'Broken Fixture',
    category: 'Fixtures & Fittings',
    description: 'Broken light fixture or fitting',
    imageUrl: 'https://picsum.photos/seed/fixture-broken/800/600',
  },
  {
    id: 'electrical-issue',
    label: 'Electrical Panel',
    category: 'Electrical',
    description: 'Electrical panel or wiring issue',
    imageUrl: 'https://picsum.photos/seed/electrical-panel/800/600',
  },
  {
    id: 'mold-spot',
    label: 'Mold / Damp',
    category: 'Walls & Ceilings',
    description: 'Wall with mold or damp patches',
    imageUrl: 'https://picsum.photos/seed/mold-damp/800/600',
  },
  {
    id: 'furniture-worn',
    label: 'Worn Furniture',
    category: 'Furniture',
    description: 'Furniture with wear and tear',
    imageUrl: 'https://picsum.photos/seed/worn-furniture/800/600',
  },
  {
    id: 'dirty-room',
    label: 'Dirty Room',
    category: 'Cleaning Required',
    description: 'Room requiring cleaning',
    imageUrl: 'https://picsum.photos/seed/dirty-room/800/600',
  },
  {
    id: 'exterior-damage',
    label: 'Exterior Damage',
    category: 'Outdoor/Exterior',
    description: 'Exterior wall or outdoor area damage',
    imageUrl: 'https://picsum.photos/seed/exterior-damage/800/600',
  },
  {
    id: 'window-broken',
    label: 'Broken Window',
    category: 'Windows & Doors',
    description: 'Window with cracked glass',
    imageUrl: 'https://picsum.photos/seed/window-crack/800/600',
  },
  {
    id: 'general-issue',
    label: 'General Condition',
    category: 'General Condition',
    description: 'Room with general wear issues',
    imageUrl: 'https://picsum.photos/seed/general-room/800/600',
  },
];

/**
 * Get a flat list of sample labels for quick reference
 */
export const getSampleLabels = () => TEST_IMAGE_SAMPLES.map((s) => s.label);

/**
 * Find a sample by ID
 */
export const getSampleById = (id) => TEST_IMAGE_SAMPLES.find((s) => s.id === id);

/**
 * Filter samples by expected category
 */
export const getSamplesByCategory = (category) =>
  TEST_IMAGE_SAMPLES.filter((s) => s.category === category);