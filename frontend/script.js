/* ==========================================================
   Fake News Detection AI
   Frontend JavaScript
========================================================== */

"use strict";

/* ==========================================================
   DOM Elements
========================================================== */

const newsUrl = document.getElementById("newsUrl");
const articleText = document.getElementById("articleText");

const analyzeBtn = document.getElementById("analyzeBtn");
const extractBtn = document.getElementById("extractBtn");
const clearBtn = document.getElementById("clearBtn");

const loading = document.getElementById("loading");
const resultSection = document.getElementById("resultSection");

const summaryResult = document.getElementById("summaryResult");
const sentimentResult = document.getElementById("sentimentResult");
const grammarResult = document.getElementById("grammarResult");

const nlpSentiment = document.getElementById("nlpSentiment");
const nlpConfidence = document.getElementById("nlpConfidence");
const nlpModel = document.getElementById("nlpModel");

const sentimentBar = document.getElementById("sentimentBar");
const sentimentLabel = document.getElementById("sentimentLabel");
const sentimentPercentage = document.getElementById("sentimentPercentage");

const characterCount = document.getElementById("characterCount");

const authenticityScore = document.getElementById("authenticityScore");

const fakeProbability = document.getElementById("fakeProbability");

const confidenceScore = document.getElementById("confidenceScore");

const riskLevel = document.getElementById("riskLevel");

const biasLevel = document.getElementById("biasLevel");

const clickbaitBar = document.getElementById("clickbaitBar");

const aiExplanation = document.getElementById("aiExplanation");

/* ==========================================================
   Backend API URL
========================================================== */

const API_URL = "https://fake-news-detection-1tod2mlt1-igrish.vercel.app";
/* ==========================================================
   Character Counter
========================================================== */

articleText.addEventListener("input", () => {

    characterCount.innerText =
        `${articleText.value.length} Characters`;

});

/* ==========================================================
   URL Validation
========================================================== */

function isValidURL(url) {

    try {

        new URL(url);

        return true;

    }

    catch {

        return false;

    }

}

/* ==========================================================
   Loading Functions
========================================================== */

function showLoading() {

    loading.classList.remove("d-none");

    resultSection.classList.add("d-none");

}

function hideLoading() {

    loading.classList.add("d-none");

    resultSection.classList.remove("d-none");

}

/* ==========================================================
   Reset Result UI
========================================================== */

function resetResults() {

    summaryResult.innerHTML = "";

    grammarResult.innerHTML = "";

    sentimentResult.innerHTML = "";

    sentimentBar.style.width = "0%";

    sentimentBar.innerHTML = "0%";

    sentimentBar.className = "progress-bar bg-warning";

    sentimentLabel.innerHTML = "Waiting for analysis...";
    sentimentPercentage.innerHTML = "0%";

}

function normalizeSentiment(value) {

    const sentiment = String(value || "Neutral").trim();

    if (sentiment.toLowerCase() === "positive") return "Positive";

    if (sentiment.toLowerCase() === "negative") return "Negative";

    return "Neutral";

}

function normalizePercentage(value, fallback = 0) {

    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {

        return fallback;

    }

    return Math.min(100, Math.max(0, parsed));

}

/* ==========================================================
   Clear Button
========================================================== */

clearBtn.addEventListener("click", () => {

    newsUrl.value = "";

    articleText.value = "";

    characterCount.innerHTML = "0 Characters";

    resetResults();

    resultSection.classList.add("d-none");

});

/* ==========================================================
   Update Result UI
========================================================== */

function updateUI(data = {}) {

    const sentimentText = normalizeSentiment(data.sentiment);
    const sentimentPercent = normalizePercentage(data.percentage, 50);

    summaryResult.innerHTML = data.summary || "No summary available.";

    grammarResult.innerHTML = data.grammar || "No grammar correction available.";

    /* NLP RESULT */

    if (data.nlp) {

    nlpSentiment.innerHTML =
        data.nlp.sentiment || "Unknown";

    nlpConfidence.innerHTML =
        (data.nlp.confidence ?? 0) + "%";

    nlpModel.innerHTML = "DistilBERT";

}

    authenticityScore.innerHTML =
        (data.authenticity ?? 0) + "%";

    fakeProbability.innerHTML =
        (data.fakeProbability ?? 0) + "%";

    confidenceScore.innerHTML =
        (data.confidence ?? 0) + "%";

    riskLevel.innerHTML =
        data.risk || "Unknown";

    biasLevel.innerHTML =
        data.bias || "Unknown";

    clickbaitBar.style.width =
        (data.clickbait ?? 0) + "%";

    clickbaitBar.innerHTML =
        (data.clickbait ?? 0) + "%";

    aiExplanation.innerHTML =
        data.explanation || "No AI explanation available.";

    sentimentLabel.innerHTML = sentimentText;
    sentimentPercentage.innerHTML = sentimentPercent + "%";

    sentimentBar.style.width =
        sentimentPercent + "%";

    sentimentBar.innerHTML =
        sentimentPercent + "%";

    if (sentimentText === "Positive") {

        sentimentBar.className =
            "progress-bar bg-success";

    }

    else if (sentimentText === "Negative") {

        sentimentBar.className =
            "progress-bar bg-danger";

    }

    else {

        sentimentBar.className =
            "progress-bar bg-warning";

    }

}
/* ==========================================================
   Extract Article From URL
========================================================== */

extractBtn.addEventListener("click", async () => {

    const url = newsUrl.value.trim();

    if (url === "") {

        alert("Please enter a news URL.");

        return;

    }

    if (!isValidURL(url)) {

        alert("Please enter a valid URL.");

        return;

    }

    extractBtn.disabled = true;

    extractBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Extracting...';

    try {

        const response = await fetch(

            `${API_URL}/api/extract`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    url: url

                })

            }

        );

        const data = await response.json();

        if (!data.success) {

            throw new Error(data.message);

        }

        articleText.value = data.content;

        characterCount.innerHTML =
            `${articleText.value.length} Characters`;

        alert("Article extracted successfully.");

    }

    catch (error) {

        console.error(error);

        alert(error.message || "Unable to extract article.");

    }

    finally {

        extractBtn.disabled = false;

        extractBtn.innerHTML =
            '<i class="fa-solid fa-link"></i> Extract Article';

    }

});
/* ==========================================================
   Analyze News Article
========================================================== */

analyzeBtn.addEventListener("click", async () => {

    const article = articleText.value.trim();

    if (article.length > 20000) {

        alert("Article is too large. Only the first 20,000 characters will be analyzed.");

        return;

    }

    if (article === "") {

        alert("Please paste or extract a news article.");

        return;

    }

    showLoading();

    analyzeBtn.disabled = true;

    analyzeBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';

    try {

       const response = await fetch(

    `${API_URL}/api/analyze`,

    {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            article: article.substring(0, 20000),

            url: newsUrl.value.trim()

        })

    }

);

        const data = await response.json();

        if (!data.success) {

            throw new Error(data.message);

        }

        hideLoading();

       updateUI({
    summary: data.summary,
    sentiment: data.sentiment,
    percentage: data.percentage,
    grammar: data.grammar,
    authenticity: data.authenticity,
    fakeProbability: data.fakeProbability,
    confidence: data.confidence,
    risk: data.risk,
    bias: data.bias,
    clickbait: data.clickbait,
    explanation: data.explanation,

    nlp: data.nlp

});
    }

    catch (error) {

        hideLoading();

        console.error(error);

        alert(error.message || "Analysis failed.");

    }

    finally {

        analyzeBtn.disabled = false;

        analyzeBtn.innerHTML =
            '<i class="fa-solid fa-robot"></i> Analyze Article';

    }

});
/* ==========================================================
   Utility Functions
========================================================== */

function showSuccess(message) {

    alert(message);

}

function showError(message) {

    alert(message);

}

/* ==========================================================
   Auto Resize Textarea
========================================================== */

articleText.addEventListener("input", () => {

    articleText.style.height = "auto";

    articleText.style.height =
        articleText.scrollHeight + "px";

});

/* ==========================================================
   Page Loaded
========================================================== */

window.addEventListener("load", () => {

    console.log("===================================");

    console.log("Fake News Detection AI");

    console.log("Frontend Loaded Successfully");

    console.log("Backend API :", API_URL);

    console.log("===================================");

});