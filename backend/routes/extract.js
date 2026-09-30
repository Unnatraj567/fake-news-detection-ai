const express = require("express");

const router = express.Router();

const { extractArticle } = require("../utils/articleExtractor");

router.post("/", async (req, res) => {

    try {

        const { url } = req.body;

        if (!url) {

            return res.status(400).json({

                success: false,

                message: "URL is required."

            });

        }

        const article = await extractArticle(url);

        return res.json(article);

    }

    catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

});

module.exports = router;