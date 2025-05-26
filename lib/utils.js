// ../lib/utils.js
import axios from "axios";

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;

export default async function getPosts(userMessage) {
    try {
        const hashtag = userMessage
        if (!hashtag) return [];

        const runRes = await axios.post(
            `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/runs?token=${APIFY_API_TOKEN}`,
            {
                hashtags: [hashtag],
                resultsType: "posts",
                resultsLimit: 5,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        const runId = runRes.data.data.id;

        // Poll until finished
        const runStatusUrl = `https://api.apify.com/v2/actor-runs/${runId}`;
        let status = "RUNNING";
        let datasetId = null;

        while (status === "RUNNING" || status === "READY") {
            const res = await axios.get(runStatusUrl + `?token=${APIFY_API_TOKEN}`);
            status = res.data.data.status;
            datasetId = res.data.data.defaultDatasetId;
            await new Promise(r => setTimeout(r, 500));
        }

        if (!datasetId) return [];

        const datasetRes = await axios.get(
            `https://api.apify.com/v2/datasets/${datasetId}/items?clean=true&token=${APIFY_API_TOKEN}`
        );

        return datasetRes.data.map(item => ({
            url: item.url,
            caption: item.caption || ""
        }));
    } catch (err) {
        console.error("Apify error:", err.message);
        return [];
    }
}

