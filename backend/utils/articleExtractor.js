const axios = require("axios");
const { JSDOM } = require("jsdom");
const { Readability } = require("@mozilla/readability");

async function extractArticle(url) {

    try {

        const response = await axios.get(url, {

            headers: {

                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

            }

        });

        const dom = new JSDOM(response.data, {

            url

        });

        const reader = new Readability(dom.window.document);

        const article = reader.parse();

        if (!article) {

            throw new Error("Article not found.");

        }

        return {

            success: true,

            title: article.title,

            content: article.textContent

        };

    }

    catch (error) {

        console.log(error);

        return {

            success: false,

            message: "Unable to extract article."

        };

    }

}

module.exports = {

    extractArticle

};