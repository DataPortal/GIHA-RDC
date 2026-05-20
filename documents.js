const documents = [
  {
    title: "Snapshot stratégique GiHA RDC 2025–2026",
    category: "Rapport",
    date: "2026-05-20",
    description: "Document synthétique présentant les acquis, défis et recommandations clés du Comité GiHA.",
    file: "documents/snapshot-giha-rdc-2025-2026.pdf"
  },
  {
    title: "Plan d’action GiHA 2025–2026",
    category: "Outil",
    date: "2026-05-20",
    description: "Plan opérationnel interactif du Comité GiHA pour le suivi des engagements nationaux et provinciaux.",
    file: "documents/plan-action-giha-2025-2026.pdf"
  },
  {
    title: "Note d’analyse genre – Réponse humanitaire RDC",
    category: "Analyse",
    date: "2026-05-20",
    description: "Analyse genre pour appuyer la prise de décision de l’EHP, de l’ICCG et des clusters.",
    file: "documents/note-analyse-genre-rdc.pdf"
  },
  {
    title: "Présentation GiHA pour partenaires",
    category: "Présentation",
    date: "2026-05-20",
    description: "Support PowerPoint de présentation du mandat, des priorités et des produits GiHA.",
    file: "documents/presentation-giha-partenaires.pdf"
  }
];

const grid = document.getElementById("documentsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

function renderDocuments() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = documents.filter(doc => {
    const matchesSearch =
      doc.title.toLowerCase().includes(search) ||
      doc.description.toLowerCase().includes(search);

    const matchesCategory =
      category === "all" || doc.category === category;

    return matchesSearch && matchesCategory;
  });

  grid.innerHTML = "";

  if (filtered.length === 0) {
    grid.innerHTML = "<p>Aucun document trouvé.</p>";
    return;
  }

  filtered.forEach(doc => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <span class="badge">${doc.category}</span>
      <h3>${doc.title}</h3>
      <p>${doc.description}</p>
      <div class="meta">Date : ${doc.date}</div>
      <a href="${doc.file}" target="_blank">Ouvrir le document</a>
    `;

    grid.appendChild(card);
  });
}

searchInput.addEventListener("input", renderDocuments);
categoryFilter.addEventListener("change", renderDocuments);

renderDocuments();
