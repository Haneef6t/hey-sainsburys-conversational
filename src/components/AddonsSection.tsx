import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Addon {
  product_id: string;
  name: string;
  price: number;
  image_url: string;
}

interface AddonsSectionProps {
  addons: Addon[];
  onAddToBasket: (productId: string) => void;
}

const AddonsSection = ({ addons, onAddToBasket }: AddonsSectionProps) => {
  if (addons.length === 0) {
    return null;
  }

  const fallbackImage = "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=200&h=200&fit=crop&crop=center";

  return (
    <section className="mt-12">
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader>
          <CardTitle className="text-xl text-foreground flex items-center gap-2">
            🍽️ Complete the meal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {addons.map((addon) => (
              <div
                key={addon.product_id}
                className="group bg-background rounded-lg p-3 border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
              >
                <img
                  src={addon.image_url || fallbackImage}
                  alt={addon.name}
                  className="w-full h-20 object-cover rounded-md mb-2"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <h4 className="font-medium text-xs text-foreground leading-tight mb-1 line-clamp-2">
                  {addon.name}
                </h4>
                <p className="text-sm font-bold text-primary mb-2">
                  £{addon.price.toFixed(2)}
                </p>
                <Button
                  onClick={() => onAddToBasket(addon.product_id)}
                  size="sm"
                  variant="outline"
                  className="w-full text-xs border-primary/20 hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default AddonsSection;