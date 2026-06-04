// ===============================
// 🧠 SMART RESULT MEMORY FEATURE
// ===============================

let LAST_RESULT = 0;
var currentExpression = "";

// ------------------------------
// Theme Toggle Logic
// ------------------------------
function toggleTheme() {
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    btn.innerHTML = "☀️";
    btn.title = "Switch to light mode";
    localStorage.setItem("theme", "dark");
  } else {
    btn.innerHTML = "🌙";
    btn.title = "Switch to dark mode";
    localStorage.setItem("theme", "light");
  }
}

// Set theme on page load from localStorage
window.addEventListener("DOMContentLoaded", function () {
  const theme = localStorage.getItem("theme");
  const body = document.body;
  const btn = document.getElementById("theme-toggle");

  if (btn) {
    if (theme === "dark") {
      body.classList.add("dark-mode");
      btn.innerHTML = "☀️";
      btn.title = "Switch to light mode";
    } else {
      btn.innerHTML = "🌙";
      btn.title = "Switch to dark mode";
    }
  }
});

// ------------------------------
// Calculator State
// ------------------------------
let left = "";
let operator = "";
let right = "";
let steps = [];
const MAX_STEPS = 6;

// ------------------------------
// Basic Calculator Functions
// ------------------------------
function appendToResult(value) {
  currentExpression += value.toString();
  updateResult();
}

function bracketToResult(value) {
  currentExpression += value;
  updateResult();
}

function backspace() {
  currentExpression = currentExpression.slice(0, -1);
  updateResult();
}

function operatorToResult(value) {
  if (value === "^") {
    currentExpression += "**";
  } else {
    currentExpression += value;
  }
  updateResult();
}

function clearResult() {
  currentExpression = "";
  updateResult();
}


function normalizeExpression(expr) {
  return expr
    .replace(/asin\(/g, "asinDeg(")
    .replace(/acos\(/g, "acosDeg(")
    .replace(/atan\(/g, "atanDeg(")
    .replace(/sin\(/g, "sinDeg(")
    .replace(/cos\(/g, "cosDeg(")
    .replace(/tan\(/g, "tanDeg(")
    .replace(/asinh\(/g, "asinh(")
    .replace(/sinh\(/g, "sinh(")
    .replace(/\be\b/g, "Math.E")
    .replace(/\bpi\b/g, "Math.PI");
}

function percentToResult() {
  if (!currentExpression) return;

  const match = currentExpression.match(/(.+?)(\*\*|[+\-*/^])([0-9.]*)$/);

  if (!match) {
    const num = parseFloat(currentExpression);
    if (isNaN(num)) return;

    currentExpression = (num / 100).toString();
  } else {
    const leftPart = match[1];
    const rightPart = match[3];

    if (!rightPart) return;

    let leftVal;

    try {
      leftVal = eval(leftPart);
    } catch (e) {
      leftVal = parseFloat(leftPart);
    }

    const rightVal = parseFloat(rightPart);
    if (isNaN(leftVal) || isNaN(rightVal)) return;

    const percentVal = (leftVal * rightVal) / 100;

    currentExpression = percentVal.toString();
  }

  // 🔥 ADD THIS LINE
  currentExpression += "*";

  updateResult();
}

// ------------------------------
// Calculate Result
// ------------------------------
function calculateResult() {
  if (!currentExpression) return;

  try {
   
    const display = document.getElementById("result");
    let normalizedExpression = normalizeExpression(currentExpression);

    // 🧠 Replace "ans" with last result automatically
    normalizedExpression = normalizedExpression.replace(
      /\bans\b/gi,
      LAST_RESULT,
    );

    // Calculate result
    let result = eval(normalizedExpression);
    console.log("Calculated result for expression:", currentExpression, "->", result);
    // Save result for future expressions
    LAST_RESULT = result;

    // Display normally
    display.value = result;

    if (isNaN(result) || !isFinite(result)) {
      throw new Error();
    }

    currentExpression = result.toString();
    updateResult();
  } catch (e) {
    currentExpression = "Error";
    updateResult();
  }
}


function updateResult() {
  document.getElementById("result").value = currentExpression || "0";
}

// ===============================
// UNIT & CURRENCY CONVERTER
// ===============================

// Toggle converter dropdown
function toggleConverter() {
  const converterBody = document.getElementById("converter-body");
  const header = document.querySelector(".converter-header");
  const toggle = document.querySelector(".converter-toggle");
  
  if (converterBody.style.display === "none") {
    converterBody.style.display = "block";
    toggle.textContent = "▲";
  } else {
    converterBody.style.display = "none";
    toggle.textContent = "▼";
  }
}

// Switch between different converter types
function switchConverter(type, buttonElement) {
  const converters = ["length-converter", "weight-converter", "temperature-converter", "currency-converter"];
  const buttons = document.querySelectorAll(".converter-tabs button");
  
  // Hide all converters
  converters.forEach(converter => {
    const elem = document.getElementById(converter);
    if (elem) {
      elem.style.display = "none";
    }
  });
  
  // Remove active class from all buttons
  buttons.forEach(btn => {
    btn.classList.remove("active");
  });
  
  // Show the selected converter
  const targetConverter = document.getElementById(type + "-converter");
  if (targetConverter) {
    targetConverter.style.display = "block";
  }
  
  // Add active class to the clicked button
  if (buttonElement) {
    buttonElement.classList.add("active");
  }
}

// Length Conversion
const lengthFactors = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
  mi: 1609.34
};

function convertLength() {
  const fromValue = parseFloat(document.getElementById("length-from").value) || 0;
  const fromUnit = document.getElementById("length-from-unit").value;
  const toUnit = document.getElementById("length-to-unit").value;
  
  const valueInMeters = fromValue * lengthFactors[fromUnit];
  const result = valueInMeters / lengthFactors[toUnit];
  
  document.getElementById("length-to").value = result.toFixed(6);
}

// Weight Conversion
const weightFactors = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.453592,
  oz: 0.0283495,
  ton: 1000
};

function convertWeight() {
  const fromValue = parseFloat(document.getElementById("weight-from").value) || 0;
  const fromUnit = document.getElementById("weight-from-unit").value;
  const toUnit = document.getElementById("weight-to-unit").value;
  
  const valueInKg = fromValue * weightFactors[fromUnit];
  const result = valueInKg / weightFactors[toUnit];
  
  document.getElementById("weight-to").value = result.toFixed(6);
}

// Temperature Conversion
function convertTemperature() {
  const fromValue = parseFloat(document.getElementById("temp-from").value) || 0;
  const fromUnit = document.getElementById("temp-from-unit").value;
  const toUnit = document.getElementById("temp-to-unit").value;
  
  let celsius;
  
  // Convert to Celsius first
  if (fromUnit === "c") {
    celsius = fromValue;
  } else if (fromUnit === "f") {
    celsius = (fromValue - 32) * 5/9;
  } else if (fromUnit === "k") {
    celsius = fromValue - 273.15;
  }
  
  // Convert from Celsius to target unit
  let result;
  if (toUnit === "c") {
    result = celsius;
  } else if (toUnit === "f") {
    result = (celsius * 9/5) + 32;
  } else if (toUnit === "k") {
    result = celsius + 273.15;
  }
  
  document.getElementById("temp-to").value = result.toFixed(2);
}

// Exchange rates API integration
let exchangeRates = null;
let lastRatesFetch = 0;
const CACHE_DURATION = 3600000; // Cache for 1 hour

// Fallback rates in case API fails
const fallbackRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1520,
  JPY: 150,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.24,
  INR: 83,
  ZAR: 18.5,
  KES: 135
};

// Update status indicator (only show on errors)
function updateRateStatus(message, isError = false) {
  const statusEl = document.getElementById("rate-status");
  const containerEl = statusEl?.parentElement;
  
  if (!statusEl || !containerEl) return;
  
  if (isError) {
    statusEl.textContent = message;
    containerEl.style.display = 'block';
  } else {
    containerEl.style.display = 'none';
  }
}

// Fetch exchange rates from API
async function fetchExchangeRates() {
  const now = Date.now();
  
  // Return cached rates if still valid
  if (exchangeRates && (now - lastRatesFetch) < CACHE_DURATION) {
    return exchangeRates;
  }
  
  try {
    // Using exchangerate-api.com free tier
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
    
    if (!response.ok) {
      throw new Error('API request failed');
    }
    
    const data = await response.json();
    exchangeRates = data.rates;
    lastRatesFetch = now;
    
    console.log('Exchange rates updated from API');
    return exchangeRates;
  } catch (error) {
    console.warn('Failed to fetch exchange rates from API, using fallback rates:', error);
    exchangeRates = fallbackRates;
    updateRateStatus('⚠ Using fallback rates (API unavailable)', true);
    return fallbackRates;
  }
}

// Initialize rates on page load
window.addEventListener("DOMContentLoaded", function() {
  fetchExchangeRates();
});

async function convertCurrency() {
  const fromValue = parseFloat(document.getElementById("currency-from").value) || 0;
  const fromCurrency = document.getElementById("currency-from-unit").value;
  const toCurrency = document.getElementById("currency-to-unit").value;
  
  // Get fresh rates
  const rates = await fetchExchangeRates();
  
  if (!rates || !rates[fromCurrency] || !rates[toCurrency]) {
    console.error('Exchange rates not available');
    document.getElementById("currency-to").value = 'Error';
    return;
  }
  
  // Convert using real exchange rates
  const valueInUSD = fromValue / rates[fromCurrency];
  const result = valueInUSD * rates[toCurrency];
  
  document.getElementById("currency-to").value = result.toFixed(2);
}