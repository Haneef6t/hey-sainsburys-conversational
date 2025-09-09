import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Plus, AlertCircle } from "lucide-react";

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

interface ProductCardProps {
  product: Product;
  explanation?: string;
  onAddToBasket: (productId: string) => void;
}

const ProductCard = ({ product, explanation, onAddToBasket }: ProductCardProps) => {
  const fallbackImage = "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=400&fit=crop&crop=center";
  
  const getValueBandColor = (band: string) => {
    switch (band) {
      case 'value': return 'bg-green-100 text-green-800 border-green-200';
      case 'premium': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getDietTagColor = (tag: string) => {
    switch (tag) {
      case 'vegan': return 'bg-green-100 text-green-800 border-green-200';
      case 'vegetarian': return 'bg-lime-100 text-lime-800 border-lime-200';
      case 'gluten_free': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'halal': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'organic': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDietTag = (tag: string) => {
    return tag.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <Card className="group bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img 
            src={product.image_url || fallbackImage}
            alt={product.name}
            className="w-full h-40 object-cover rounded-md"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
          />
          {!product.is_in_stock && (
            <div className="absolute inset-0 bg-black/50 rounded-md flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">
                <AlertCircle className="w-3 h-3 mr-1" />
                Out of Stock
              </Badge>
            </div>
          )}
          <Badge 
            className={`absolute top-2 right-2 text-xs ${getValueBandColor(product.value_band)}`}
          >
            {product.value_band}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-xs text-muted-foreground">
            {product.brand} • {product.size}
          </p>
          
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">
              £{product.price.toFixed(2)}
            </span>
            {product.nectar_price && (
              <span className="text-sm text-accent line-through">
                £{product.nectar_price.toFixed(2)} Nectar
              </span>
            )}
          </div>
          
          {product.diet_tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.diet_tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className={`text-xs ${getDietTagColor(tag)}`}
                >
                  {formatDietTag(tag)}
                </Badge>
              ))}
            </div>
          )}
          
          {explanation && (
            <div className="bg-accent/10 border border-accent/20 rounded-sm p-2 mt-2">
              <p className="text-xs text-accent-foreground">
                <span className="font-medium">Why: </span>{explanation}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={() => onAddToBasket(product.product_id)}
          disabled={!product.is_in_stock}
          variant="default"
          className="w-full bg-gradient-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Basket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;