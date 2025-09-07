// Top 100 companies database for autocomplete and search
export const TOP_COMPANIES = [
  // FAANG + Major Tech
  "Google", "Apple", "Microsoft", "Amazon", "Meta", "Netflix", "Tesla", "Spotify",
  "Airbnb", "Uber", "LinkedIn", "Salesforce", "Adobe", "Oracle", "IBM", "Intel",
  "NVIDIA", "AMD", "Qualcomm", "Cisco", "VMware", "ServiceNow", "Snowflake",
  "Palantir", "Databricks", "Stripe", "Square", "PayPal", "Zoom", "Slack",
  "Atlassian", "Shopify", "Twilio", "Okta", "Cloudflare", "MongoDB", "Elastic",
  
  // Financial Services
  "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "Bank of America", 
  "Wells Fargo", "Citigroup", "American Express", "Visa", "Mastercard",
  "BlackRock", "Fidelity", "Charles Schwab", "Capital One", "Robinhood",
  
  // Consulting & Professional Services
  "McKinsey & Company", "Boston Consulting Group", "Bain & Company", 
  "Deloitte", "PwC", "EY", "KPMG", "Accenture", "IBM Consulting",
  
  // E-commerce & Retail
  "Walmart", "Target", "Costco", "Home Depot", "Lowe's", "Best Buy",
  "Wayfair", "eBay", "Etsy", "Chewy", "Instacart", "DoorDash", "Grubhub",
  
  // Healthcare & Biotech
  "Johnson & Johnson", "Pfizer", "Moderna", "AbbVie", "Merck", "Bristol Myers Squibb",
  "Eli Lilly", "Amgen", "Gilead Sciences", "Biogen", "Regeneron", "Illumina",
  "Teladoc", "Veracyte", "10x Genomics",
  
  // Automotive
  "Ford", "General Motors", "Stellantis", "Toyota", "Honda", "Nissan",
  "BMW", "Mercedes-Benz", "Volkswagen", "Rivian", "Lucid Motors",
  
  // Aerospace & Defense
  "Boeing", "Lockheed Martin", "Raytheon", "Northrop Grumman", "General Dynamics",
  "SpaceX", "Blue Origin",
  
  // Energy & Utilities
  "ExxonMobil", "Chevron", "ConocoPhillips", "NextEra Energy", "Enphase Energy",
  "SolarEdge", "First Solar",
  
  // Media & Entertainment
  "Disney", "Comcast", "Warner Bros Discovery", "Paramount", "Sony", "Universal",
  "Roku", "Peloton", "Unity", "Roblox", "Electronic Arts", "Activision Blizzard",
  
  // Startups & Unicorns
  "OpenAI", "Anthropic", "Canva", "Figma", "Notion", "Airtable", "Zapier",
  "Calendly", "Loom", "Miro", "Asana", "Monday.com", "Slack", "Discord"
];

// Create normalized search map for case-insensitive matching
export const COMPANY_SEARCH_MAP = new Map(
  TOP_COMPANIES.map(company => [
    company.toLowerCase().replace(/[^a-z0-9]/g, ''), 
    company
  ])
);

// Function to find company by fuzzy matching
export function findCompanyMatch(query: string): string | null {
  const normalizedQuery = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  
  // Exact match first
  if (COMPANY_SEARCH_MAP.has(normalizedQuery)) {
    return COMPANY_SEARCH_MAP.get(normalizedQuery)!;
  }
  
  // Partial match
  for (const [normalized, original] of COMPANY_SEARCH_MAP.entries()) {
    if (normalized.includes(normalizedQuery) || normalizedQuery.includes(normalized)) {
      return original;
    }
  }
  
  return null;
}

// Function to get autocomplete suggestions
export function getAutocompleteSuggestions(query: string, limit: number = 5): string[] {
  if (!query || query.length < 1) return [];
  
  const normalizedQuery = query.toLowerCase();
  const suggestions: string[] = [];
  
  for (const company of TOP_COMPANIES) {
    if (company.toLowerCase().startsWith(normalizedQuery)) {
      suggestions.push(company);
    }
    if (suggestions.length >= limit) break;
  }
  
  // If no prefix matches, try contains matching
  if (suggestions.length < limit) {
    for (const company of TOP_COMPANIES) {
      if (!suggestions.includes(company) && 
          company.toLowerCase().includes(normalizedQuery)) {
        suggestions.push(company);
        if (suggestions.length >= limit) break;
      }
    }
  }
  
  return suggestions;
}
