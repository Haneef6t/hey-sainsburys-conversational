# Hey Sainsbury's — Conversational Product Search

A 4-hour demo web application showcasing natural language product search for grocery shopping.

## 🚀 Live Demo

Try these example searches:
- "cheap loo roll" → Shows toilet tissue with value pricing
- "gluten-free wraps for lunchboxes" → Highlights gluten-free options
- "ingredients for Sunday roast for 4" → Shows chicken, vegetables, and gravy with add-ons
- "pasta under £1" → Filters by price and shows value options

## ✨ Features

### Core Functionality
- **Natural Language Search**: Understands colloquialisms and everyday language
- **Synonym Mapping**: "loo roll" → "toilet tissue", "aubergine" → "eggplant"
- **Smart Filtering**: Extracts diet tags, price limits, and value preferences from queries
- **Intelligent Explanations**: Shows why products match your search
- **Add-on Suggestions**: Recommends complementary items (pasta → pasta sauce)

### User Interface
- Clean, responsive design with Sainsbury's branding
- Faceted search sidebar (category, dietary, value band)
- Product cards with images, prices, diet tags, and explanations
- "Complete the meal" add-ons section
- Toast notifications for user feedback

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Search**: Custom hook with regex-based query parsing
- **Data**: Local JSON files (catalogue, synonyms, add-ons)

## 📁 Project Structure

```
src/
├── components/
│   ├── SearchHeader.tsx      # Search bar and branding
│   ├── ProductCard.tsx       # Individual product display
│   ├── ProductGrid.tsx       # Grid layout for products
│   ├── FacetSidebar.tsx     # Filter controls
│   └── AddonsSection.tsx    # Complementary products
├── hooks/
│   └── useSearch.ts         # Search logic and data loading
├── pages/
│   └── Index.tsx           # Main application page
└── index.css              # Design system with Sainsbury's theme

public/data/
├── catalogue.json          # 30 sample products
├── synonyms.json          # UK colloquialisms mapping
└── addons.json           # Product complement rules
```

## 🎨 Design System

The app uses a custom design system based on Sainsbury's brand colors:
- **Primary**: Orange (#FF8200) with gradients
- **Semantic tokens**: All colors defined in CSS variables
- **Components**: Custom shadcn/ui variants with branded styling
- **Typography**: Clean, readable fonts optimized for product browsing

## 📊 Sample Data

### Products (30 items)
- Grocery, household, chilled, bakery, frozen categories
- Diet tags: vegan, vegetarian, gluten-free, halal, organic
- Value bands: value, mid, premium
- Stock status and pricing (including Nectar prices)

### Natural Language Features
- **Synonyms**: UK-specific terms (loo roll, baps, mince, aubergine)
- **Price extraction**: "under £5", "cheap", "bargain"
- **Diet parsing**: "vegan", "gluten-free", "dairy-free"
- **Context understanding**: "Sunday roast", "lunchbox", "dinner for 4"

## 🚀 Getting Started

1. **Clone the repository**
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:8080`

## 🧪 Test the Demo

Try these search queries to see the features in action:

1. **"cheap loo roll"** - Tests synonym replacement and value filtering
2. **"gluten-free wraps for lunchboxes"** - Tests diet tag matching
3. **"ingredients for Sunday roast for 4"** - Tests contextual search with add-ons
4. **"semi-skimmed milk"** when out of stock - Shows substitution
5. **"pasta under £1"** - Tests price filtering

## 💡 How It Works

### Search Process
1. **Query Analysis**: Extracts diet tags, price limits, value signals
2. **Synonym Replacement**: Maps colloquial terms to product tags
3. **Product Matching**: Combines text search with extracted filters
4. **Ranking**: Prioritizes relevance, diet matches, and value
5. **Explanations**: Generates reasons why products match
6. **Add-ons**: Suggests complementary items based on rules

### Key Components
- **Natural Language Parser**: Regex-based extraction of search intent
- **Faceted Search**: Dynamic filtering with real-time counts
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Toast System**: User feedback for actions and search results

## 📝 Notes

- **No Backend Required**: All data loaded from static JSON files
- **Local Development**: Runs entirely in the browser
- **Mock Data**: Pricing and stock status are simulated
- **UK Focus**: Uses British spelling and grocery terminology
- **Family Friendly**: All content appropriate for all audiences

## 🎯 Future Enhancements

This demo could be extended with:
- Real-time inventory integration
- Machine learning for improved search relevance
- User accounts and shopping history
- Voice search capabilities
- Advanced meal planning features
- Integration with delivery services

## 📄 License

Built with Lovable for demonstration purposes.