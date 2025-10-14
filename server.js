const express = require("express")
const axios = require("axios")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.static("public"))

// Environment Variables
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID

// Search Endpoint
app.get("/api/search", async (req, res) => {
  if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
    console.error("API Key or Search Engine ID is not configured.")
    return res.status(500).json({
      error: "Server configuration error",
      message: "Please configure GOOGLE_API_KEY and SEARCH_ENGINE_ID in your .env file",
    })
  }

  try {
    const { q, page = 1 } = req.query

    if (!q) {
      return res.status(400).json({
        error: "Bad request",
        message: "Search query is required",
      })
    }

    const startIndex = (page - 1) * 10 + 1

    console.log(`Searching for: "${q}" (page ${page})`)

    const response = await axios.get("https://www.googleapis.com/customsearch/v1", {
      params: {
        key: GOOGLE_API_KEY,
        cx: SEARCH_ENGINE_ID,
        q: q,
        start: startIndex,
        num: 10,
      },
    })

    // Transform Google results to our format
    const transformedResults = {
      query: q,
      totalResults: response.data.searchInformation?.totalResults || 0,
      searchTime: response.data.searchInformation?.searchTime?.toFixed(2) || "0.00",
      items:
        response.data.items?.map((item) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
          displayLink: item.displayLink,
          formattedUrl: item.formattedUrl,
        })) || [],
    }

    console.log(`Found ${transformedResults.items.length} results`)
    res.json(transformedResults)
  } catch (error) {
    console.error("Search error:", error.response?.data?.error || error.message)

    if (error.response?.status === 403) {
      return res.status(403).json({
        error: "API Key Error",
        message: "Invalid API key or quota exceeded. Please check your Google API credentials.",
      })
    }

    res.status(500).json({
      error: "Search failed",
      message: error.response?.data?.error?.message || "An error occurred while searching. Please try again.",
    })
  }
})

// Serve index.html for root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
  console.log(`🚀 AlfaaX Server running on http://localhost:${PORT}`)
  console.log(`📝 Make sure to configure your .env file with valid credentials`)
})
