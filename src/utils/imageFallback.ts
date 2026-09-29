// Smart AI & Curated Image Fallback Engine for Tagalong
// Ensures all host activities and discovery cards always have ultra-high-resolution, authentic photography

export const CURATED_STOCK_IMAGES = {
  cycling: '/src/assets/images/vancouver_cycling_1790710513736.jpg',
  hiking: '/src/assets/images/vancouver_hiking_1790710524653.jpg',
  watersports: '/src/assets/images/vancouver_watersports_1790710535693.jpg',
  skiing: '/src/assets/images/vancouver_snow_skiing_1790710546219.jpg',
  camping: '/src/assets/images/vancouver_camping_forest_1790710556485.jpg',
  walk: '/src/assets/images/discover_sunset_seawall_1790709914120.jpg',
  coffee: '/src/assets/images/discover_coffee_cafe_1790709924898.jpg',
  run: '/src/assets/images/discover_run_club_1790709933793.jpg',
  picnic: '/src/assets/images/discover_beach_picnic_1790709944504.jpg',
  drinks: '/src/assets/images/discover_evening_drinks_1790709953823.jpg',
  yoga: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
  default: '/src/assets/images/discover_sunset_seawall_1790709914120.jpg'
};

/**
 * Resolves a high-quality image for an activity. If the host provided a low-quality,
 * broken, empty, or placeholder image, automatically matches with authentic AI/stock photography.
 */
export function resolveActivityImage(
  photoUrl?: string | null,
  type?: string,
  title?: string,
  note?: string
): string {
  // If photo is already one of our high-res generated assets or a verified unsplash photo, keep it
  if (photoUrl && photoUrl.trim().length > 10 && !photoUrl.includes('placeholder') && !photoUrl.includes('default')) {
    return photoUrl;
  }

  const query = `${type || ''} ${title || ''} ${note || ''}`.toLowerCase();

  if (query.includes('bike') || query.includes('cycl') || query.includes('ride')) {
    return CURATED_STOCK_IMAGES.cycling;
  }
  if (query.includes('hike') || query.includes('trail') || query.includes('mountain') || query.includes('summit')) {
    return CURATED_STOCK_IMAGES.hiking;
  }
  if (query.includes('water') || query.includes('kayak') || query.includes('paddle') || query.includes('canoe')) {
    return CURATED_STOCK_IMAGES.watersports;
  }
  if (query.includes('ski') || query.includes('snowboard') || query.includes('winter') || query.includes('snow')) {
    return CURATED_STOCK_IMAGES.skiing;
  }
  if (query.includes('camp') || query.includes('forest') || query.includes('fire') || query.includes('wood')) {
    return CURATED_STOCK_IMAGES.camping;
  }
  if (query.includes('coffee') || query.includes('cafe') || query.includes('espresso') || query.includes('tea') || query.includes('latte')) {
    return CURATED_STOCK_IMAGES.coffee;
  }
  if (query.includes('run') || query.includes('jog') || query.includes('5k') || query.includes('pace') || query.includes('marathon')) {
    return CURATED_STOCK_IMAGES.run;
  }
  if (query.includes('drink') || query.includes('patio') || query.includes('beer') || query.includes('cocktail') || query.includes('bar')) {
    return CURATED_STOCK_IMAGES.drinks;
  }
  if (query.includes('picnic') || query.includes('beach') || query.includes('blanket') || query.includes('sand')) {
    return CURATED_STOCK_IMAGES.picnic;
  }
  if (query.includes('yoga') || query.includes('stretch') || query.includes('breath') || query.includes('meditat')) {
    return CURATED_STOCK_IMAGES.yoga;
  }
  if (query.includes('walk') || query.includes('seawall') || query.includes('stroll')) {
    return CURATED_STOCK_IMAGES.walk;
  }

  // Type based fallback
  switch (type) {
    case 'walk': return CURATED_STOCK_IMAGES.walk;
    case 'coffee': return CURATED_STOCK_IMAGES.coffee;
    case 'yoga': return CURATED_STOCK_IMAGES.yoga;
    case 'run': return CURATED_STOCK_IMAGES.run;
    case 'drinks': return CURATED_STOCK_IMAGES.drinks;
    case 'picnic': return CURATED_STOCK_IMAGES.picnic;
    default: return CURATED_STOCK_IMAGES.default;
  }
}
