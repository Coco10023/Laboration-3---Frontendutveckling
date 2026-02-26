import Chart from "chart.js/auto";

/**
 * En rad i antagningsdatan 
 * @typedef {Object} AdmissionRow
 * @property {"Kurs"|"Program"} type
 * @property {string} name
 * @property {string} applicantsTotal
 * @property {string} [applicantsFirstHand]
 */

/**
 * Hämtar antagningsdata (HT 25) från lokal JSON.
 * @async
 * @returns {Promise<AdmissionRow[]>} Lista med rader från JSON-filen. 
 * @throws {Error} Om filen inte kan hämtas.
 */

async function fetchAdmissions() {
    const res = await fetch("./data/antagning-ht25.json");
    if (!res.ok) throw new Error("kunde inte hämta antagningsdata.");
    return res.json();
}

/**
 * Gör om tex "1989" -> 1989
 * @param {string} value - Sträng som innehåller ett tal (kan ha mellanslag).
 * @returns {number} Parsat tal (NaN om värdet inte är ett tal).
 */

function toNumber(value) {
    return Number(String(value).trim());
}

/**
 * Tar ut topp N för Kurs eller Program baserat på applicantsTotal. 
 * @param {AdmissionRow[]} rows - Alla rader från antagningsdatan. 
 * @param {"Kurs" | "Program"} type - Vilken typ som ska filtreras fram. 
 * @param {number} n - Antal toppresultat att ta ut. 
 * @returns {{labels:string[], values:number[]}} Labels + values för diagram.
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
 * Renderar ett stapeldiagram 
 * @param {HTMLCanvasElement} canvas - Canvas elementet där diagrammet ska ritas.
 * @param {string[]} labels - Namn på kurser/program. 
 * @param {number[]} values - Antal sökande per label. 
 * @returns {Chart} Chart.js-instans (kan sparas om du vill förstöra/uppdatera senare)
 */
function renderBar(canvas, labels, values) {
    return new Chart(canvas, {
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
 * Renderar cirkeldiagram (pie chart). 
 * @param {HTMLCanvasElement} canvas - Canvas element där diagrammet ska ritas.
 * @param {string[]} labels - Namn på program. 
 * @param {number[]} values - Antal sökande per label.
 * @returns {Chart} Chart.js-instans
 */
function renderPie(canvas, labels, values) {
    return new Chart(canvas, {
        type: "pie", 
        data: { labels, datasets: [{ label: "Totalt antal sökande", data: values }] },
        options: { responsive: true },
    });
}

/**
 * Startar diagramssidan: hämtar data och renderar diagrammen. 
 * @async
 * @returns {Promise<void>}
 */

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



