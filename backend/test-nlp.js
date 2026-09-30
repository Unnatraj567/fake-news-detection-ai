const { analyzeWithNLP } = require("./services/nlp");

async function test() {

    const article = `
    The government announced a new economic policy today.
    Experts believe the policy will improve the country's economy
    and create new opportunities for businesses.
    `;

    console.log("Testing NLP...\n");

    const result = await analyzeWithNLP(article);

    console.log("NLP RESULT:");
    console.log(result);
}

test();