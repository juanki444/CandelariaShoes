export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  sizes: number[];
  colors: string[];
  images: string[];
  featured: boolean;
  category?: string;
}

export const initialProducts: Product[] = [
  {
    id: "1",
    name: "Sandalia Brisa del Mar",
    price: 120000,
    description: "Sandalia tejida a mano con fibras naturales. Perfecta para días soleados y paseos por la playa.",
    sizes: [35, 36, 37, 38, 39],
    colors: ["Beige", "Tierra"],
    images: ["/assets/sandalia-brisa-1.jpg", "/assets/sandalia-brisa-2.jpg"],
    featured: true,
  },
  {
    id: "2",
    name: "Sandalia Cacao Tropical",
    price: 145000,
    description: "Elegancia y comodidad en cuero sintético con detalles dorados. Ideal para combinar con vestidos vaporosos.",
    sizes: [36, 37, 38, 39, 40],
    colors: ["Café", "Negro"],
    images: ["/assets/sandalia-cacao-1.jpg", "/assets/sandalia-cacao-2.jpg"],
    featured: true,
  },
  {
    id: "3",
    name: "Sandalia Atardecer",
    price: 95000,
    description: "Estilo fresco y casual con diseño trenzado. La opción ideal para el confort diario.",
    sizes: [35, 36, 37, 38],
    colors: ["Blanco", "Dorado"],
    images: ["/assets/sandalia-atardecer.jpg"],
    featured: false,
  },
  {
    id: "4",
    name: "Sandalia Flora",
    price: 160000,
    description: "Sandalia con apliques florales en relieve, un toque romántico y femenino para tus pies.",
    sizes: [37, 38, 39, 40, 41],
    colors: ["Rosa pálido", "Arena"],
    images: ["/assets/sandalia-flora-1.jpg", "/assets/sandalia-flora-2.jpg"],
    featured: true,
  },
  {
    id: "5",
    name: "Sandalia Palma",
    price: 110000,
    description: "Minimalismo y ligereza. Tiras delgadas que abrazan el pie con suavidad y firmeza.",
    sizes: [35, 36, 37, 38, 39, 40],
    colors: ["Verde Oliva", "Negro"],
    images: ["/assets/sandalia-palma.jpg"],
    featured: false,
  },
  {
    id: "6",
    name: "Sandalia Solsticio",
    price: 135000,
    description: "Suela de yute con plataforma sutil y tiras de cuero trenzado. Estilo boho-chic elevado.",
    sizes: [36, 37, 38, 39],
    colors: ["Mostaza", "Café Claro"],
    images: ["/assets/sandalia-solsticio-1.jpg", "/assets/sandalia-solsticio-2.jpg"],
    featured: true,
  },
  {
    id: "7",
    name: "Sandalia Mompox",
    price: 180000,
    description: "Artesanía pura. Detalles inspirados en la filigrana momposina, para ocasiones especiales.",
    sizes: [37, 38, 39, 40],
    colors: ["Dorado", "Plateado"],
    images: ["/assets/sandalia-mompox.jpg"],
    featured: false,
  },
  {
    id: "8",
    name: "Sandalia Caribe",
    price: 105000,
    description: "Colores vibrantes y diseño ergonómico. Prepárate para caminar sin parar.",
    sizes: [35, 36, 37, 38, 39],
    colors: ["Coral", "Turquesa"],
    images: ["/assets/sandalia-caribe.jpg"],
    featured: false,
  }
];
