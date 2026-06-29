
const JSON_PATH = "json/";

async function loadJSON(file) {
  const response = await fetch(JSON_PATH + file);
  if (!response.ok) throw new Error("Erreur de chargement : " + file);
  return await response.json();
}

function formatNumber(value) {
  if (value === "" || value === null || value === undefined) return "-";
  if (!isNaN(value)) return new Intl.NumberFormat("fr-FR").format(Number(value));
  return value;
}

function renderKPIs(containerId, kpi) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const items = [
    ["Cas confirmés", kpi.confirmed_cases],
    ["Décès", kpi.deaths],
    ["Guéris", kpi.recovered],
    ["Hospitalisés", kpi.hospitalized],
    ["Létalité", kpi.case_fatality_rate + "%"],
    ["Suivi contacts", kpi.contacts_followed_percent + "%"]
  ];

  container.innerHTML = items.map(([label, value]) => `
    <div class="kpi">
      <div class="kpi-value">${formatNumber(value)}</div>
      <div class="kpi-label">${label}</div>
    </div>
  `).join("");
}

function renderMessages(containerId, messages) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = messages.map(m => `
    <div class="message">
      <h4>${m.title}</h4>
      <p>${m.message}</p>
      <small>${m.section} | Priorité ${m.priority}</small>
    </div>
  `).join("");
}

function renderList(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = data.map(d => `
    <div class="item">
      <strong>${d.indicator || d.province || d.territory || d.health_zone || d.title || "Indicateur"}</strong><br>
      ${d.value ? formatNumber(d.value) + " " + (d.unit || "") : ""}
      ${d.notes ? "<br><span>" + d.notes + "</span>" : ""}
      ${d.status ? "<br><span>Statut : " + d.status + "</span>" : ""}
      ${d.priority_level ? "<br><span>Priorité : " + d.priority_level + "</span>" : ""}
      ${d.risk_level ? "<br><span>Risque : " + d.risk_level + "</span>" : ""}
    </div>
  `).join("");
}

function buildChart(canvasId, type, labels, datasets, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  new Chart(canvas, {
    type: type,
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" }
      },
      ...options
    }
  });
}

function aggregateByMonth(timeseries) {
  const monthlyData = {};

  timeseries.forEach(d => {
    const date = new Date(d.date);
    const monthKey = date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short"
    });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        confirmed_cases: 0,
        deaths: 0,
        recovered: 0,
        hospitalized: 0
      };
    }

    monthlyData[monthKey].confirmed_cases += Number(d.confirmed_cases || 0);
    monthlyData[monthKey].deaths += Number(d.deaths || 0);
    monthlyData[monthKey].recovered += Number(d.recovered || 0);
    monthlyData[monthKey].hospitalized += Number(d.hospitalized || 0);
  });

  return {
    labels: Object.keys(monthlyData),
    data: monthlyData
  };
}
