import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Facet {
  key: string;
  count: number;
  selected: boolean;
}

interface FacetGroup {
  title: string;
  facets: Facet[];
}

interface FacetSidebarProps {
  facetGroups: FacetGroup[];
  onFacetToggle: (groupIndex: number, facetKey: string) => void;
}

const FacetSidebar = ({ facetGroups, onFacetToggle }: FacetSidebarProps) => {
  return (
    <aside className="w-80 space-y-4">
      <Card className="bg-gradient-card shadow-card border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-foreground">Filter Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {facetGroups.map((group, groupIndex) => (
            <div key={group.title}>
              <h3 className="font-semibold text-sm text-foreground mb-3">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.facets.map((facet) => (
                  <div
                    key={facet.key}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-accent/10 p-1 rounded transition-colors"
                    onClick={() => onFacetToggle(groupIndex, facet.key)}
                  >
                    <Checkbox
                      id={`${group.title}-${facet.key}`}
                      checked={facet.selected}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label
                      htmlFor={`${group.title}-${facet.key}`}
                      className="flex-1 text-sm text-foreground cursor-pointer"
                    >
                      {facet.key}
                    </label>
                    <Badge variant="outline" className="text-xs bg-muted">
                      {facet.count}
                    </Badge>
                  </div>
                ))}
              </div>
              {groupIndex < facetGroups.length - 1 && (
                <Separator className="mt-4 bg-border/50" />
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </aside>
  );
};

export default FacetSidebar;