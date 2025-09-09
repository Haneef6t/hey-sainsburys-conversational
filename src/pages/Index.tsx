import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSearch } from "@/hooks/useSearch";
import SearchHeader from "@/components/SearchHeader";
import FacetSidebar from "@/components/FacetSidebar";
import ProductGrid from "@/components/ProductGrid";
import AddonsSection from "@/components/AddonsSection";

interface SearchFilters {
  categories: string[];
  dietTags: string[];
  valueBands: string[];
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    dietTags: [],
    valueBands: []
  });
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const { search, getFacets, loading } = useSearch();

  const searchResult = hasSearched || searchQuery.trim() ? 
    search(searchQuery, filters) : 
    { products: [], explanations: {}, addons: [] };

  const facetData = searchResult.products.length > 0 ? getFacets(searchResult.products) : null;

  const facetGroups = facetData ? [
    {
      title: "Category",
      facets: facetData.categories.map(cat => ({
        key: cat.key,
        count: cat.count,
        selected: filters.categories.includes(cat.key)
      }))
    },
    {
      title: "Dietary",
      facets: facetData.dietTags.map(tag => ({
        key: tag.key,
        count: tag.count,
        selected: filters.dietTags.includes(tag.key.replace(' ', '_'))
      }))
    },
    {
      title: "Value Band",
      facets: facetData.valueBands.map(band => ({
        key: band.key,
        count: band.count,
        selected: filters.valueBands.includes(band.key)
      }))
    }
  ] : [];

  const handleSearch = () => {
    setHasSearched(true);
    toast({
      title: "Search completed",
      description: `Found ${searchResult.products.length} products`,
    });
  };

  const handleFacetToggle = (groupIndex: number, facetKey: string) => {
    const group = facetGroups[groupIndex];
    const newFilters = { ...filters };

    switch (group.title) {
      case "Category":
        newFilters.categories = filters.categories.includes(facetKey)
          ? filters.categories.filter(c => c !== facetKey)
          : [...filters.categories, facetKey];
        break;
      case "Dietary":
        const dietKey = facetKey.replace(' ', '_');
        newFilters.dietTags = filters.dietTags.includes(dietKey)
          ? filters.dietTags.filter(t => t !== dietKey)
          : [...filters.dietTags, dietKey];
        break;
      case "Value Band":
        newFilters.valueBands = filters.valueBands.includes(facetKey)
          ? filters.valueBands.filter(v => v !== facetKey)
          : [...filters.valueBands, facetKey];
        break;
    }

    setFilters(newFilters);
  };

  const handleAddToBasket = (productId: string) => {
    toast({
      title: "Added to basket",
      description: "Product has been added to your basket",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🛒</div>
          <p className="text-lg text-muted-foreground">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />
      
      <main className="container mx-auto px-4 py-8">
        {!hasSearched && !searchQuery.trim() ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🛒</div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Hey Sainsbury's — Conversational Product Search
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Search naturally for what you need. Try asking for "cheap loo roll", 
              "gluten-free wraps for lunchboxes", or "ingredients for Sunday roast for 4"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border/50">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold text-foreground mb-2">Natural Language</h3>
                <p className="text-sm text-muted-foreground">
                  Search using everyday language and colloquialisms
                </p>
              </div>
              <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border/50">
                <div className="text-2xl mb-2">🎯</div>
                <h3 className="font-semibold text-foreground mb-2">Smart Matching</h3>
                <p className="text-sm text-muted-foreground">
                  Finds products based on diet, price, and preferences
                </p>
              </div>
              <div className="bg-gradient-card p-6 rounded-lg shadow-card border border-border/50">
                <div className="text-2xl mb-2">✨</div>
                <h3 className="font-semibold text-foreground mb-2">Helpful Suggestions</h3>
                <p className="text-sm text-muted-foreground">
                  Get explanations and complementary product recommendations
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-8">
            {searchResult.products.length > 0 && (
              <FacetSidebar
                facetGroups={facetGroups}
                onFacetToggle={handleFacetToggle}
              />
            )}
            
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  {searchQuery.trim() ? `Results for "${searchQuery}"` : "All Products"}
                </h2>
                <p className="text-muted-foreground">
                  {searchResult.products.length} product{searchResult.products.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              <ProductGrid
                products={searchResult.products}
                explanations={searchResult.explanations}
                onAddToBasket={handleAddToBasket}
              />
              
              <AddonsSection
                addons={searchResult.addons}
                onAddToBasket={handleAddToBasket}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
