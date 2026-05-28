import { initialProducts } from "@/lib/products";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const product = initialProducts.find((p) => p.id === resolvedParams.id);

  if (!product) {
    return {
      title: "Producto no encontrado | Candelaria Shoes",
    };
  }

  // Find a valid image
  const validImg = product.images.find(img => img.toLowerCase().includes("sandalia")) || product.images[0] || '';

  return {
    title: `${product.name} | Candelaria Shoes`,
    description: product.description,
    openGraph: {
      title: `${product.name} | Candelaria Shoes`,
      description: product.description,
      images: [
        {
          url: validImg,
          width: 800,
          height: 1000,
          alt: product.name,
        },
      ],
      type: "website",
      url: `https://candelariashoes.com/shop/${product.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} | Candelaria Shoes`,
      description: product.description,
      images: [validImg],
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
