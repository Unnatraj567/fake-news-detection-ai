const express = require("express");

const router = express.Router();

const { analyzeArticle } = require("../services/gemini");
const { analyzeWithNLP } = require("../services/nlp");

/* ============================================
   POST /api/analyze
============================================ */

router.post("/", async (req, res) => {

    try {

        const { article, url } = req.body;

        /* ----------------------------------------
           Check Article / URL
        ---------------------------------------- */

        if (!article && !url) {

            return res.status(400).json({

                success: false,

                message: "Article or URL is required."

            });

        }

        /* ----------------------------------------
           Article Text
        ---------------------------------------- */

        const text = article || "";

        if (text.trim() === "") {

            return res.status(400).json({

                success: false,

                message: "Article text is empty."

            });

        }

        /* ----------------------------------------
           NLP Analysis
           NLP works independently
        ---------------------------------------- */

        const nlpResult = await analyzeWithNLP(text);

        console.log("NLP Response:");
        console.log(nlpResult);

        /* ----------------------------------------
           Gemini AI Analysis
           Gemini works independently
        ---------------------------------------- */

        const result = await analyzeArticle(text);

        console.log("Gemini Response:");
        console.log(result);

        /* ----------------------------------------
           Send Both Results to Frontend
        ---------------------------------------- */

        return res.json({

            success: true,

            /* ---------- NLP RESULT ---------- */

            nlp: nlpResult,

            /* ---------- GEMINI RESULT ---------- */

            summary: result.summary,

            sentiment: result.sentiment,

            percentage: result.percentage,

            grammar: result.grammar,

            authenticity: result.authenticity,

            fakeProbability: result.fakeProbability,

            risk: result.risk,

            confidence: result.confidence,

            clickbait: result.clickbait,

            bias: result.bias,

            explanation: result.explanation

        });

    }

    catch (error) {

        console.error("Analysis Error:", error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

});

/* ============================================
   Export Router
============================================ */

module.exports = router;