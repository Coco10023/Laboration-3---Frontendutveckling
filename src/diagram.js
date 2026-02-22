import Chart from "chart.js/auto";

/**
 * Hämtar antagningsdata (HT 25) från lokal JSON.
 * @returns {Promise<Array<{type:string, name:string, applicantsTotal:string}>>}
 */
async function fetchAdmissions() {
    const res = await fetch("./data/antagning-ht25.json");
    if (!res.ok) throw new Error("kunde inte hämta antagningsdata.");
    return res.json();
}

/**
 * Gör om "1989" -> 1989
 * @param {string} value
 * @returns {number}
 */

function toNumber(value) {
    return Number(String(value).trum());
}