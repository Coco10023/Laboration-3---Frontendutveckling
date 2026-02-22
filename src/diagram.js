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

/**
 * Renderar stapeldiagram
 * @param {HTMLCanvasElement} canvas
 * @param {string[]} Labels
 * @param {number[]} values
 */
function renderBar(canvas, labels, values) {
    new Chart(canvas, {
        type: "bar", 
        data: { labels, datasets: [{ label: "Total antal sökande", data: values}]},
        options: {
            responsive: true,
            plugins: { legend: { display: false} }, 
            scales: { y: { beginAtZero: true } },
        },
    });
}

/**
 * Renderar cirkeldiagram
 * @param {HTMLCanvasElement} canvas
 * @param {string[]} Labels
 * @param {number[]} values
 */
function renderPie(canvas, labels, values) {
    new Chart(canvas, {
        type: "pie", 
        data: { labels, datasets: [{ label: "Totalt antal sökande", data: values }] },
        options: { responsive: true },
    });
}

async function main() {
    const rows = await fetchAdmissions();

    const courses = getTop(rows, "Kurs", 6);
    const programs =  getTop(rows, "Program", 5);

    const coursesCanvas = document.querySelector("#coursesChart");
    const programsCanvas = document.querySelector("#programsChart");

    if (coursesCanvas) renderBar(coursesCanvas, courses.labels, courses.values);
    if (programsCanvas) renderPie(programsCanvas, programs.labels, programs.values);
}

main().catch((err) => {
    console.error(err);
    alert("Kunde inte ladda diagrammen.");
});



