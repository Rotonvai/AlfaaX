// DOM Elements
const homepage = document.getElementById("homepage")
const resultsPage = document.getElementById("resultsPage")
const searchInput = document.getElementById("searchInput")
const resultsSearchInput = document.getElementById("resultsSearchInput")
const searchButton = document.getElementById("searchButton")
const searchIcon = document.getElementById("searchIcon")
const resultsSearchIcon = document.getElementById("resultsSearchIcon")
const resultsList = document.getElementById("resultsList")
const resultsStats = document.getElementById("resultsStats")
const loading = document.getElementById("loading")
const themeToggle = document.getElementById("themeToggle")
const homeLogo = document.getElementById("homeLogo")
const body = document.body
const paginationContainer = document.getElementById("pagination")

// API Configuration - Updated to use relative URL for local server
const API_ENDPOINT = "/api/search"

// Global variables
let currentQuery = ""
let currentPage = 1

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("alfaaX-theme")
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    enableDarkMode()
  } else {
    enableLightMode()
  }
}

function createThemeSwitchUI() {
  themeToggle.innerHTML = `
        <span class="theme-switch" id="themeSwitch" role="switch" tabindex="0" aria-checked="false">
            <i class="fas fa-moon icon moon" aria-hidden="true"></i>
            <span class="knob" aria-hidden="true"></span>
            <i class="fas fa-sun icon sun" aria-hidden="true"></i>
        </span>
    `

  const themeSwitch = document.getElementById("themeSwitch")
  if (themeSwitch) {
    themeSwitch.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        themeToggle.click()
      }
    })
  }
}

function enableDarkMode() {
  body.classList.add("dark-mode")
  const themeSwitch = document.getElementById("themeSwitch")
  if (themeSwitch) {
    themeSwitch.classList.add("on")
    themeSwitch.setAttribute("aria-checked", "true")
  }
  localStorage.setItem("alfaaX-theme", "dark")
}

function enableLightMode() {
  body.classList.remove("dark-mode")
  const themeSwitch = document.getElementById("themeSwitch")
  if (themeSwitch) {
    themeSwitch.classList.remove("on")
    themeSwitch.setAttribute("aria-checked", "false")
  }
  localStorage.setItem("alfaaX-theme", "light")
}

themeToggle.addEventListener("click", () => {
  body.classList.contains("dark-mode") ? enableLightMode() : enableDarkMode()
})

// Main Search Logic
async function performSearch(query, page = 1) {
  if (!query) return

  currentQuery = query
  currentPage = page

  resultsSearchInput.value = query
  searchInput.value = query

  loading.style.display = "block"
  resultsList.innerHTML = ""
  paginationContainer.innerHTML = ""
  resultsStats.textContent = ""

  showResultsPage()

  try {
    const response = await fetch(`${API_ENDPOINT}?q=${encodeURIComponent(query)}&page=${page}`)
    const data = await response.json()

    loading.style.display = "none"

    if (!response.ok) {
      throw new Error(data.message || `Server error: ${response.status}`)
    }

    if (data.totalResults && data.searchTime) {
      resultsStats.textContent = `About ${Number.parseInt(data.totalResults).toLocaleString()} results (${data.searchTime} seconds)`
    } else {
      resultsStats.textContent = `Results for "${query}"`
    }

    if (data.items && data.items.length > 0) {
      data.items.forEach((result, index) => {
        const resultItem = createResultElement(result, index)
        resultsList.appendChild(resultItem)
      })
      updatePagination(Number.parseInt(data.totalResults) || 0, page)
    } else {
      showNoResults(query)
    }
  } catch (error) {
    console.error("Search error:", error)
    loading.style.display = "none"
    showErrorState(query, error.message)
  }
}

function createResultElement(result, index) {
  const resultItem = document.createElement("div")
  resultItem.className = "result-item fade-in"
  resultItem.style.animationDelay = `${index * 0.1}s`

  resultItem.innerHTML = `
        <div class="result-url">
            <span>${result.displayLink || new URL(result.link).hostname}</span>
        </div>
        <a href="${result.link}" class="result-title" target="_blank" rel="noopener noreferrer">
            ${result.title || "No title"}
        </a>
        <div class="result-snippet">${result.snippet || "No description available"}</div>
    `
  return resultItem
}

function updatePagination(totalResults, currentPage) {
  const totalPages = Math.min(Math.ceil(totalResults / 10), 10)

  if (totalPages <= 1) {
    paginationContainer.innerHTML = ""
    return
  }

  let paginationHTML = '<div class="pagination-buttons">'

  if (currentPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="performSearch('${escapeHtml(currentQuery)}', ${currentPage - 1})"><i class="fas fa-arrow-left"></i> Previous</button>`
  }

  const startPage = Math.max(1, currentPage - 2)
  const endPage = Math.min(totalPages, startPage + 4)

  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `<button class="page-btn ${i === currentPage ? "active" : ""}" onclick="performSearch('${escapeHtml(currentQuery)}', ${i})">${i}</button>`
  }

  if (currentPage < totalPages) {
    paginationHTML += `<button class="page-btn" onclick="performSearch('${escapeHtml(currentQuery)}', ${currentPage + 1})">Next <i class="fas fa-arrow-right"></i></button>`
  }

  paginationHTML += "</div>"
  paginationContainer.innerHTML = paginationHTML
}

function escapeHtml(text) {
  const div = document.createElement("div")
  div.textContent = text
  return div.innerHTML
}

// UI State Functions
function showResultsPage() {
  homepage.style.display = "none"
  resultsPage.style.display = "block"
  window.scrollTo(0, 0)
}

function showHomePage() {
  homepage.style.display = "flex"
  resultsPage.style.display = "none"
  searchInput.value = ""
  resultsSearchInput.value = ""
  resultsList.innerHTML = ""
  paginationContainer.innerHTML = ""
}

function showNoResults(query) {
  resultsList.innerHTML = `
        <div class="no-results">
            <h3>No results found for "${escapeHtml(query)}"</h3>
            <p>Try different keywords or check your spelling.</p>
        </div>
    `
}

function showErrorState(query, message) {
  resultsList.innerHTML = `
        <div class="error-state">
            <h3>Search temporarily unavailable</h3>
            <p>${escapeHtml(message) || "We are having trouble connecting to the search service."}</p>
            <button class="retry-btn" onclick="performSearch('${escapeHtml(query)}')">
                <i class="fas fa-redo"></i> Try Again
            </button>
        </div>
    `
}

// Event Listeners
function handleSearch(event) {
  let query
  if (event.target === searchInput || event.target === searchButton || event.target === searchIcon) {
    query = searchInput.value.trim()
  } else {
    query = resultsSearchInput.value.trim()
  }

  if (query) {
    performSearch(query)
  }
}

searchButton.addEventListener("click", handleSearch)
searchIcon.addEventListener("click", handleSearch)
resultsSearchIcon.addEventListener("click", handleSearch)

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch(e)
  }
})

resultsSearchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch(e)
  }
})

homeLogo.addEventListener("click", (e) => {
  e.preventDefault()
  showHomePage()
})

// Sidebar Logic
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar")
  if (sidebar) sidebar.classList.toggle("active")
}

document.addEventListener("click", (e) => {
  const sidebar = document.getElementById("sidebar")
  const openBtn = document.querySelector(".open-btn")
  if (!sidebar || !sidebar.classList.contains("active")) return

  const isClickInsideSidebar = sidebar.contains(e.target)
  const isClickOnOpenBtn = openBtn && openBtn.contains(e.target)

  if (!isClickInsideSidebar && !isClickOnOpenBtn) {
    sidebar.classList.remove("active")
  }
})

// Initialization
createThemeSwitchUI()
initTheme()
