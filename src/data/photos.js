import { workPhotos } from './gallery';

/**
 * Where each real job photo is used. Numbers refer to public/images/work/jcp-work-NNN.jpg.
 * Swap a number to change a photo; nothing else needs editing.
 */
export const photoById = (id) => workPhotos[id - 1];

// First photo is the card image; the rest open in the lightbox on the services page.
export const servicePhotos = {
  mowing: { ids: [110, 114, 108], alt: 'Freshly mowed backyard lawn with a clean patio edge' },
  edging: { ids: [7, 115, 116], alt: 'Mowed lawn with a crisp curved concrete border' },
  hedges: { ids: [26, 28, 22], alt: 'Tree and hedge trimming in progress' },
  cleanup: { ids: [46, 45, 17], alt: 'Trailer loaded with yard debris from a clean-up' },
  aeration: { ids: [136, 195, 187], alt: 'Lawn renovation with new turf beside a prepared bed' },
  beds: { ids: [56, 61, 177], alt: 'Bark bed with a rock border' },
  irrigation: { ids: [47, 48], alt: 'Sprinkler line repair dug into a lawn' },
  commercial: { ids: [173, 34, 174], alt: 'Freshly mulched parkway strip with new street trees' },
};

// Background photo for each inner page header.
export const pageHeroPhotos = {
  '/services': 7,
  '/residential': 110,
  '/commercial': 173,
  '/our-work': 136,
  '/lawn-guide': 114,
  '/service-area': 152,
  notFound: 3,
};

export function servicePhotoList(serviceId) {
  const s = servicePhotos[serviceId];
  if (!s) return [];
  return s.ids
    .map(photoById)
    .filter(Boolean)
    .map((p, i) => ({ ...p, alt: i === 0 ? `${s.alt}, by JCP Lawn Service` : p.alt }));
}
