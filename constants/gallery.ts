export type GalleryItem = {
  id: string;
  title: string;
  description: string;
  image: number;
};

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'morskie-oko',
    title: 'Morskie Oko',
    description:
      'The largest lake in the Polish Tatras, nestled beneath towering peaks. A classic hike destination with crystal-clear alpine water reflecting the surrounding mountains.',
    image: require('../assets/gallery/tatra/morskie-oko.jpg'),
  },
  {
    id: 'giewont',
    title: 'Giewont',
    description:
      'The iconic peak overlooking Zakopane, recognizable by its distinctive cross-shaped summit. One of the most photographed silhouettes in the Tatra range.',
    image: require('../assets/gallery/tatra/giewont.jpg'),
  },
  {
    id: 'dolina-koscieliska',
    title: 'Dolina Kościeliska',
    description:
      'A long, forested valley on the western edge of the Tatras. Limestone cliffs and winding trails make it a favorite for gentle day hikes.',
    image: require('../assets/gallery/tatra/dolina-koscieliska.jpg'),
  },
  {
    id: 'kasprowy-wierch',
    title: 'Kasprowy Wierch',
    description:
      'A high peak reachable by cable car from Zakopane. At 1,987 m it offers sweeping views across the Polish and Slovak High Tatras.',
    image: require('../assets/gallery/tatra/kasprowy-wierch.jpg'),
  },
  {
    id: 'zakopane-panorama',
    title: 'Zakopane Panorama',
    description:
      'A wide vista over the High Tatras from above the treeline. On clear days the entire ridge stretches from Giewont to the Slovak border.',
    image: require('../assets/gallery/tatra/zakopane-panorama.jpg'),
  },
];

export function getGalleryItem(id: string): GalleryItem | undefined {
  return GALLERY_ITEMS.find((item) => item.id === id);
}
