document.addEventListener("DOMContentLoaded", async () => {

  const SUPABASE_URL =
    "https://pbxwkrvfzwbnkndjmkui.supabase.co";

  const SUPABASE_ANON_KEY =
    "TA_CLE_ANON_COMPLETE_ICI";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  console.log("Page analyse chargée");

  const { data, error } = await supabaseClient
    .from("giha_ebola_border_survey")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erreur Supabase :", error);
    alert("Erreur Supabase : " + error.message);
    return;
  }

  console.log("Données reçues :", data);

  if (!data || data.length === 0) {
    alert("Aucune donnée trouvée dans Supabase.");
    return;
  }

  document.getElementById("totalResponses").innerText = data.length;

  const provinces = [...new Set(data.map(d => d.province).filter(Boolean))];
  document.getElementById("totalProvinces").innerText = provinces.length;

  const organizations = [...new Set(data.map(d => d.organization_type).filter(Boolean))];
  document.getElementById("totalOrganizations").innerText = organizations.length;

  const gbvAlerts = data.filter(d =>
    d.gbv_risks_observed && d.gbv_risks_observed.trim() !== ""
  );

  document.getElementById("gbvAlerts").innerText = gbvAlerts.length;

  const provinceCounts = {};

  data.forEach(item => {
    const province = item.province || "Non spécifié";
    provinceCounts[province] = (provinceCounts[province] || 0) + 1;
  });

  new Chart(document.getElementById("provinceChart"), {
    type: "bar",
    data: {
      labels: Object.keys(provinceCounts),
      datasets: [{
        label: "Réponses",
        data: Object.values(provinceCounts)
      }]
    }
  });

  const orgCounts = {};

  data.forEach(item => {
    const org = item.organization_type || "Non spécifié";
    orgCounts[org] = (orgCounts[org] || 0) + 1;
  });

  new Chart(document.getElementById("organizationChart"), {
    type: "doughnut",
    data: {
      labels: Object.keys(orgCounts),
      datasets: [{
        data: Object.values(orgCounts)
      }]
    }
  });

  const tbody = document.querySelector("#surveyTable tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : ""}</td>
      <td>${item.organisation || ""}</td>
      <td>${item.organization_type || ""}</td>
      <td>${item.province || ""}</td>
      <td>${item.affected_group || ""}</td>
      <td>${item.priority_needs || ""}</td>
    `;

    tbody.appendChild(row);
  });

  document.getElementById("searchInput").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#surveyTable tbody tr");

    rows.forEach(row => {
      row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
  });

});
