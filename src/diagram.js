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

/**
 * Tar ut topp N för Kurs eller Program.
 * @param {any[]} rows
 * @param {"Kurs" | "Program"} type 
 * @param {number} n 
 * @returns {{Labels:string[], values:number[]}}
 */

function getTop(rows, type, n) {
    const top = rows
      .filter((r) => r.type === type)
      .map((r) => ({ name: r.name, total: toNumber(r.applicantsTotal) }))
      .filter((x) => x.name && Number.isFinite(x.total))
      .sort((a, b) => b.total - a.total)
      .slice(0, n); 

      return {
        labels: top.map((x) => x.name),
        values: top.map((x) => x.total),
      };
}