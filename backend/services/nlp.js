/* ==========================================================
   Fake News Detection AI
   NLP Service - Hugging Face
========================================================== */

"use strict";

const {
    pipeline
} = require("@huggingface/transformers");

/* ==========================================================
   NLP Model
========================================================== */

let classifier = null;

/* ==========================================================
   Load NLP Model
========================================================== */

async function loadModel() {

    if (!classifier) {

        console.log("🧠 Loading Hugging Face NLP model...");

        classifier = await pipeline(
            "sentiment-analysis",
            "Xenova/distilbert-base-uncased-finetuned-sst-2-english"
        );

        console.log("✅ NLP model loaded successfully.");

    }

    return classifier;

}

/* ==========================================================
   Analyze Text
========================================================== */

async function analyzeWithNLP(article) {

    try {

        if (!article || article.trim() === "") {

            throw new Error("Article text is empty.");

        }

        const model = await loadModel();

        /* --------------------------------------------------
           Limit text for NLP processing
        -------------------------------------------------- */

        const text = article.substring(0, 5000);

        /* --------------------------------------------------
           Run NLP Model
        -------------------------------------------------- */

        const result = await model(text);

        /* --------------------------------------------------
           Extract Result
        -------------------------------------------------- */

        const prediction = result[0];

        return {

            success: true,

            sentiment: prediction.label,

            confidence:
                Math.round(prediction.score * 100),

            model:
                "Xenova/distilbert-base-uncased-finetuned-sst-2-english"

        };

    }

    catch (error) {

        console.error("NLP Error:", error);

        return {

            success: false,

            sentiment: "UNKNOWN",

            confidence: 0,

            model:
                "Xenova/distilbert-base-uncased-finetuned-sst-2-english"

        };

    }

}

/* ==========================================================
   Export
========================================================== */

module.exports = {

    analyzeWithNLP

};