import ProductCard from "./ProductCard";

interface Product {
  product_id: string;
  name: string;
  brand: string;
  category: string;
  sub_category: string;
  tags: string[];
  diet_tags: string[];
  price: number;
  nectar_price?: number;
  size: string;
  uom: string;
  image_url: string;
  is_in_stock: boolean;
  value_band: 'value' | 'mid' | 'premium';
}

interface ProductGridProps {
  products: Product[];
  explanations?: Record<string, string>;
  onAddToBasket: (productId: string) => void;
}

const ProductGrid = ({ products, explanations = {}, onAddToBasket }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No products found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search terms or filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.product_id}
          product={product}
          explanation={explanations[product.product_id]}
          onAddToBasket={onAddToBasket}
        />
      ))}
    </div>
  );
};

export default ProductGrid;