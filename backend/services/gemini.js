const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function analyzeArticle(article) {

    try {

        const cleanArticle = article.substring(0, 12000);

        const prompt = `
You are an AI News Analyzer.

Analyze the following news article.

Return ONLY valid JSON.

{
  "summary": "Maximum 150 words",

  "sentiment": "Positive | Neutral | Negative",

  "percentage": 0,

  "grammar": "Corrected version of the article",

  "authenticity": 0,

  "fakeProbability": 0,

  "risk": "Low | Medium | High",

  "confidence": 0,

  "clickbait": 0,

  "bias": "Low | Medium | High",

  "explanation": "Why you think this article appears trustworthy or suspicious."
}

News Article:

${cleanArticle}
`;

        const response = await ai.models.generateContent({

            model: "gemini-2.5-flash",

            contents: prompt

        });

        let text = response.text;

        text = text.replace(/```json/g, "");
        text = text.replace(/```/g, "");
        text = text.trim();

        return JSON.parse(text);

    }

    catch (error) {

        console.error("Gemini Error:");
        console.error(error);

        return {

            summary: "Unable to generate summary.",

            sentiment: "Neutral",

            percentage: 50,

            grammar: "Unable to check grammar."

        };

    }

}

module.exports = {

    analyzeArticle

};