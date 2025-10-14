# AlfaaX - Search Reimagined

A custom search engine built with HTML5, CSS3, JavaScript, and Node.js using the Google Custom Search API.

## Features

- 🔍 Real-time web search powered by Google Custom Search API
- 🌓 Dark/Light theme toggle with smooth transitions
- 📱 Fully responsive design
- ⚡ Fast and lightweight
- 🎨 Beautiful gradient UI with premium styling
- 📄 Pagination support for search results
- 🔄 Loading states and error handling

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Google Custom Search API

#### Get Your API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the "Custom Search API"
4. Go to "Credentials" and create an API key
5. Copy your API key

#### Create a Custom Search Engine:
1. Go to [Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Click "Add" to create a new search engine
3. For "Sites to search", enter `www.google.com` (or leave it to search the entire web)
4. Under "Settings" → "Basic" → "Search the entire web", toggle it ON
5. Copy your Search Engine ID (cx parameter)

### 3. Create Environment File

Create a `.env` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your credentials:

\`\`\`env
GOOGLE_API_KEY=your_actual_api_key_here
SEARCH_ENGINE_ID=your_actual_search_engine_id_here
PORT=3000
\`\`\`

### 4. Run the Server

Development mode (with auto-reload):
\`\`\`bash
npm run dev
\`\`\`

Production mode:
\`\`\`bash
npm start
\`\`\`

### 5. Open in Browser

Navigate to: `http://localhost:3000`

## Project Structure

\`\`\`
alfaax-search/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # All CSS styles
│   └── script.js       # Client-side JavaScript
├── server.js           # Express server & API routes
├── package.json        # Dependencies
├── .env.example        # Environment variables template
├── .env               # Your actual credentials (not in git)
└── README.md          # This file
\`\`\`

## API Usage Limits

Google Custom Search API has the following limits:
- **Free tier**: 100 queries per day
- **Paid tier**: Up to 10,000 queries per day

Monitor your usage in the [Google Cloud Console](https://console.cloud.google.com/).

## Troubleshooting

### "Search temporarily unavailable" Error

1. **Check your .env file**: Make sure `GOOGLE_API_KEY` and `SEARCH_ENGINE_ID` are correctly set
2. **Verify API is enabled**: Ensure Custom Search API is enabled in Google Cloud Console
3. **Check quota**: You might have exceeded the daily limit (100 searches/day for free tier)
4. **API Key restrictions**: Make sure your API key doesn't have IP restrictions that block localhost

### No Results Appearing

1. **Check browser console**: Open DevTools (F12) and look for error messages
2. **Verify Search Engine settings**: Make sure "Search the entire web" is enabled in your Programmable Search Engine settings
3. **Test the API directly**: Try making a request to `http://localhost:3000/api/search?q=test` in your browser

### Server Won't Start

1. **Port already in use**: Change the PORT in `.env` to a different number (e.g., 3001)
2. **Dependencies not installed**: Run `npm install` again
3. **Node version**: Make sure you're using Node.js version 14 or higher

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **API**: Google Custom Search API
- **HTTP Client**: Axios
- **Icons**: Font Awesome 6.5.2

## License

MIT License - Feel free to use this project for learning and personal use.

## Credits

Created by Roton - [GitHub](https://github.com/Rotonvai)
