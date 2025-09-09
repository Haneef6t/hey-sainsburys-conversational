import { useState, useEffect } from 'react';

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

interface SearchFilters {
  categories: string[];
  dietTags: string[];
  valueBands: string[];
  priceRange?: [number, number];
}

interface SearchResult {
  products: Product[];
  explanations: Record<string, string>;
  addons: Product[];
}

export const useSearch = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [synonyms, setSynonyms] = useState<Record<string, string>>({});
  const [addonsMap, setAddonsMap] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [catalogueRes, synonymsRes, addonsRes] = await Promise.all([
          fetch('/data/catalogue.json'),
          fetch('/data/synonyms.json'),
          fetch('/data/addons.json')
        ]);

        const catalogue = await catalogueRes.json();
        const synonymsData = await synonymsRes.json();
        const addonsData = await addonsRes.json();

        setAllProducts(catalogue);
        setSynonyms(synonymsData);
        setAddonsMap(addonsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const applySynonyms = (query: string): string => {
    let normalizedQuery = query.toLowerCase();
    
    Object.entries(synonyms).forEach(([synonym, replacement]) => {
      const regex = new RegExp(`\\b${synonym}\\b`, 'gi');
      normalizedQuery = normalizedQuery.replace(regex, replacement);
    });
    
    return normalizedQuery;
  };

  const extractFilters = (query: string): { 
    cleanQuery: string; 
    filters: { 
      priceLimit?: number; 
      dietTags: string[]; 
      valueBand?: string;
    } 
  } => {
    let cleanQuery = query.toLowerCase();
    const filters: { priceLimit?: number; dietTags: string[]; valueBand?: string } = {
      dietTags: []
    };

    // Extract price filters
    const priceMatch = cleanQuery.match(/under £?(\d+)/i);
    if (priceMatch) {
      filters.priceLimit = parseFloat(priceMatch[1]);
      cleanQuery = cleanQuery.replace(priceMatch[0], '').trim();
    }

    // Extract diet tags
    const dietTagMap = {
      'vegan': 'vegan',
      'vegetarian': 'vegetarian',
      'gluten-free': 'gluten_free',
      'gluten free': 'gluten_free',
      'halal': 'halal',
      'organic': 'organic',
      'nut-free': 'nut_free',
      'nut free': 'nut_free',
      'dairy-free': 'dairy_free',
      'dairy free': 'dairy_free'
    };

    Object.entries(dietTagMap).forEach(([term, tag]) => {
      if (cleanQuery.includes(term)) {
        filters.dietTags.push(tag);
        cleanQuery = cleanQuery.replace(new RegExp(term, 'gi'), '').trim();
      }
    });

    // Extract value bands
    if (cleanQuery.includes('cheap') || cleanQuery.includes('bargain') || cleanQuery.includes('value')) {
      filters.valueBand = 'value';
      cleanQuery = cleanQuery.replace(/\b(cheap|bargain|value)\b/gi, '').trim();
    }

    return { cleanQuery: cleanQuery.trim(), filters };
  };

  const search = (query: string, appliedFilters: SearchFilters = { categories: [], dietTags: [], valueBands: [] }): SearchResult => {
    if (!query.trim() && appliedFilters.categories.length === 0 && appliedFilters.dietTags.length === 0) {
      return { products: allProducts.slice(0, 12), explanations: {}, addons: [] };
    }

    const normalizedQuery = applySynonyms(query);
    const { cleanQuery, filters: extractedFilters } = extractFilters(normalizedQuery);
    
    let filteredProducts = allProducts.filter(product => {
      // Text matching
      const textMatch = cleanQuery === '' || 
        product.name.toLowerCase().includes(cleanQuery) ||
        product.brand.toLowerCase().includes(cleanQuery) ||
        product.category.toLowerCase().includes(cleanQuery) ||
        product.sub_category.toLowerCase().includes(cleanQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(cleanQuery));

      // Price filtering
      const priceMatch = !extractedFilters.priceLimit || product.price <= extractedFilters.priceLimit;
      
      // Diet tag filtering
      const dietMatch = extractedFilters.dietTags.length === 0 || 
        extractedFilters.dietTags.some(tag => product.diet_tags.includes(tag));
      
      // Value band filtering
      const valueBandMatch = !extractedFilters.valueBand || product.value_band === extractedFilters.valueBand;

      // Applied filters
      const categoryMatch = appliedFilters.categories.length === 0 || 
        appliedFilters.categories.includes(product.category);
      
      const appliedDietMatch = appliedFilters.dietTags.length === 0 || 
        appliedFilters.dietTags.some(tag => product.diet_tags.includes(tag));
      
      const valueBandFilterMatch = appliedFilters.valueBands.length === 0 || 
        appliedFilters.valueBands.includes(product.value_band);

      return textMatch && priceMatch && dietMatch && valueBandMatch && 
             categoryMatch && appliedDietMatch && valueBandFilterMatch;
    });

    // Generate explanations
    const explanations: Record<string, string> = {};
    filteredProducts.forEach(product => {
      const reasons = [];
      
      if (extractedFilters.dietTags.some(tag => product.diet_tags.includes(tag))) {
        reasons.push(`Matches ${extractedFilters.dietTags.join(', ')} dietary requirements`);
      }
      
      if (extractedFilters.priceLimit && product.price <= extractedFilters.priceLimit) {
        reasons.push(`Under £${extractedFilters.priceLimit} budget`);
      }
      
      if (extractedFilters.valueBand === 'value' && product.value_band === 'value') {
        reasons.push('Great value option');
      }
      
      if (cleanQuery && product.tags.some(tag => tag.toLowerCase().includes(cleanQuery))) {
        reasons.push(`Matches "${cleanQuery}" search`);
      }

      if (!product.is_in_stock) {
        reasons.push('Currently out of stock');
      }

      if (reasons.length > 0) {
        explanations[product.product_id] = reasons.join('; ');
      }
    });

    // Generate add-ons based on found products
    const addons: Product[] = [];
    const addedAddonIds = new Set();

    filteredProducts.forEach(product => {
      product.tags.forEach(tag => {
        const addonTags = addonsMap[tag.toLowerCase()];
        if (addonTags) {
          addonTags.forEach(addonTag => {
            const addonProducts = allProducts.filter(p => 
              p.tags.some(t => t.toLowerCase().includes(addonTag.toLowerCase())) && 
              !addedAddonIds.has(p.product_id) &&
              p.product_id !== product.product_id
            );
            
            addonProducts.slice(0, 2).forEach(addon => {
              if (!addedAddonIds.has(addon.product_id)) {
                addons.push(addon);
                addedAddonIds.add(addon.product_id);
              }
            });
          });
        }
      });
    });

    return {
      products: filteredProducts.slice(0, 20),
      explanations,
      addons: addons.slice(0, 6)
    };
  };

  const getFacets = (products: Product[]) => {
    const categories = [...new Set(products.map(p => p.category))];
    const dietTags = [...new Set(products.flatMap(p => p.diet_tags))];
    const valueBands = [...new Set(products.map(p => p.value_band))];

    return {
      categories: categories.map(cat => ({ key: cat, count: products.filter(p => p.category === cat).length })),
      dietTags: dietTags.map(tag => ({ key: tag.replace('_', ' '), count: products.filter(p => p.diet_tags.includes(tag)).length })),
      valueBands: valueBands.map(band => ({ key: band, count: products.filter(p => p.value_band === band).length }))
    };
  };

  return {
    search,
    getFacets,
    loading,
    allProducts
  };
};