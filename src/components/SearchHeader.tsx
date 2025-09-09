import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

const SearchHeader = ({ searchQuery, onSearchChange, onSearch }: SearchHeaderProps) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-primary shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary-foreground">
            Hey Sainsbury's
          </h1>
          <div className="flex-1 max-w-2xl relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Try: cheap loo roll, vegan dinner under £8, ingredients for Sunday roast for 4"
              className="pl-10 pr-20 py-6 text-lg bg-background/95 backdrop-blur-sm border-primary/20 focus:ring-primary focus:border-primary"
            />
            <Button
              onClick={onSearch}
              variant="secondary" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SearchHeader;