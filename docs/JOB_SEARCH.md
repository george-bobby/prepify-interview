# Job Search Feature

## Overview

The job search feature allows users to search for jobs using the SerpAPI service, which provides access to Google Jobs and other job search engines.

## Features

### 🔍 Smart Job Search

- **Real-time job searching** powered by SerpAPI
- **Advanced filters**: job type, experience level, salary range, date posted
- **Location-based search** with flexible location input
- **Caching system** to avoid duplicate API calls

### 💾 Data Storage

- **Firebase integration** for storing search results
- **Search history** - previous searches are cached for 1 hour
- **Autocomplete suggestions** based on user's search history

### 🎯 User Experience

- **Responsive design** matching the existing app theme
- **Autocomplete inputs** for job titles and locations
- **Loading states** and error handling
- **Keyboard shortcuts** (Enter to search)

## Setup Instructions

### 1. Get SerpAPI Key

1. Visit [serpapi.com](https://serpapi.com)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Environment Configuration

Add your SerpAPI key to your environment variables:

```bash
# In .env.local
SERPAPI_API_KEY=your_serpapi_key_here
```

### 3. Firebase Setup

The job search feature uses Firebase to store:

- Search results cache
- User search history
- Autocomplete suggestions

Firebase collections used:

- `jobSearches`: Stores search parameters and results

## API Endpoints

### Job Search

```
GET /api/jobs/search
Query Parameters:
- q: Job title (required)
- location: Job location (optional)
- job_type: FULLTIME|PARTTIME|CONTRACTOR|INTERN (optional)
- experience_level: entry_level|mid_level|senior_level|executive (optional)
- date_posted: today|3days|week|month (optional)
- salary_range: 0-50000|50000-100000|100000-150000|150000+ (optional)
```

### Autocomplete Suggestions

```
GET /api/jobs/suggestions/titles?q={query}
GET /api/jobs/suggestions/locations?q={query}
```

## Components

### AutocompleteInput

A reusable component that provides autocomplete functionality for form inputs.

```tsx
<AutocompleteInput
	value={searchParams.query}
	onChange={(value) => handleInputChange('query', value)}
	placeholder='e.g. Software Engineer'
	label='Job Title'
	apiEndpoint='/api/jobs/suggestions/titles'
	required={true}
/>
```

## Usage

1. Navigate to `/jobs` in the application
2. Enter a job title (required)
3. Optionally add location and filters
4. Click "Search Jobs" or press Enter
5. View results with company logos, salary info, and apply links

## Caching Strategy

- Search results are cached in Firebase for 1 hour
- Similar searches (same job title and location) return cached results
- Reduces API costs and improves response time
- Cache is user-specific for privacy

## Error Handling

- **API Key Missing**: Clear error message with setup instructions
- **Quota Exceeded**: Graceful error handling with retry suggestions
- **Network Errors**: Timeout and connection error handling
- **Invalid Searches**: Input validation and helpful error messages

## Performance Features

- **Debounced autocomplete**: 300ms delay to avoid excessive API calls
- **Efficient caching**: Reduces SerpAPI usage
- **Optimized queries**: Firebase indexes for fast search history retrieval
- **Image optimization**: Company logos are properly sized and lazy-loaded

## Security

- API keys are server-side only
- User searches are isolated by user ID
- Input sanitization for all search parameters
- Rate limiting through SerpAPI's built-in limits
