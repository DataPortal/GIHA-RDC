// ================================
// CONFIGURATION SUPABASE
// ================================

const SUPABASE_URL = "https://pbxwkrvfzwbnkndjmkui.supabase.co";

const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBieHdrcnZmendibmtuZGpta3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyNzI4ODQsImV4cCI6MjA5NDg0ODg4NH0.DnxRQPzJPFuxkK66vS_Epap47mKtwXCpYedaI-87BMw";

const bucketName = "giha-documents";

const ACCESS_CODE = "GIHA2026";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);


// ================================
// AUTHENTIFICATION SIMPLE PAR CODE
// ================================

function checkAccess() {
  const access = localStorage.getItem("giha_access");

  if (access === "granted") {
    return true;
  }

  showLoginScreen();
  return false;
}

function showLoginScreen() {
  document.body.innerHTML = `
    <div style="
      max-width:450px;
      margin:80px auto;
      padding:35px;
      background:white;
      border-radius:14px;
      box-shadow:0 5px 20px rgba(0,0,0,.15);
      font-family:Arial">

      <h2>Accès Bibliothèque GiHA RDC</h2>

      <p>Veuillez saisir le code d'accès partagé.</p>

      <input
        id="accessInput"
        type="password"
        placeholder="Code d'accès"
        style="
          width:100%;
          padding:12px;
          margin-top:10px;
          border:1px solid #ccc;
          border-radius:8px;
          box-sizing:border-box">

      <button
        onclick="login()"
        style="
          margin-top:15px;
          width:100%;
          padding:12px;
          background:#448BCA;
          color:white;
          border:none;
          border-radius:8px">
        Se connecter
      </button>

      <div id="error" style="color:red;margin-top:10px"></div>
    </div>
  `;
}

function login() {
  const code = document.getElementById("accessInput").value.trim();

  if (code === ACCESS_CODE) {
    localStorage.setItem("giha_access", "granted");
    location.reload();
  } else {
    document.getElementById("error").innerHTML = "Code incorrect.";
  }
}

function logout() {
  localStorage.removeItem("giha_access");
  location.reload();
}

if (!checkAccess()) {
  throw new Error("Accès refusé");
}


// ================================
// BOUTON DECONNEXION
// ================================

window.addEventListener("load", () => {
  const btn = document.createElement("button");
  btn.innerHTML = "Déconnexion";
  btn.className = "logout-btn";
  btn.onclick = logout;
  document.body.appendChild(btn);
});


// ================================
// NETTOYAGE DES NOMS
// ================================

function cleanName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w.\s-]/gi, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}


// ================================
// CREER UN DOSSIER
// ================================

async function createFolder() {
  const folderName = document.getElementById("folderName").value.trim();

  if (!folderName) {
    alert("Veuillez saisir le nom du dossier.");
    return;
  }

  const cleanFolderName = cleanName(folderName);
  const folderPath = `${cleanFolderName}/.keep`;

  const emptyFile = new Blob([""], {
    type: "text/plain"
  });

  const { error } = await supabaseClient.storage
    .from(bucketName)
    .upload(folderPath, emptyFile, {
      upsert: true
    });

  if (error) {
    alert("Erreur création dossier : " + error.message);
    return;
  }

  alert("Dossier créé avec succès.");

  document.getElementById("folderName").value = "";

  await loadFolders();
  await loadFiles();
}


// ================================
// CHARGER LES DOSSIERS
// ================================

async function loadFolders() {
  const { data, error } = await supabaseClient.storage
    .from(bucketName)
    .list("", {
      limit: 100,
      offset: 0
    });

  if (error) {
    alert("Erreur chargement dossiers : " + error.message);
    return;
  }

  const folderSelect = document.getElementById("folderSelect");

  folderSelect.innerHTML = `
    <option value="">Racine principale</option>
  `;

  data.forEach(item => {
    if (!item.name.includes(".")) {
      const option = document.createElement("option");
      option.value = item.name;
      option.textContent = item.name;
      folderSelect.appendChild(option);
    }
  });
}


// ================================
// UPLOADER UN FICHIER
// ================================

async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const folder = document.getElementById("folderSelect").value;

  if (!fileInput.files.length) {
    alert("Veuillez sélectionner un fichier.");
    return;
  }

  const file = fileInput.files[0];
  const cleanFileName = cleanName(file.name);

  const filePath = folder
    ? `${folder}/${cleanFileName}`
    : cleanFileName;

  const { error } = await supabaseClient.storage
    .from(bucketName)
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type
    });

  if (error) {
    alert("Erreur upload : " + error.message);
    return;
  }

  alert("Fichier uploadé avec succès.");

  fileInput.value = "";

  await loadFiles();
  await loadFolders();
}


// ================================
// LISTER LES FICHIERS ET DOSSIERS
// ================================

async function loadFiles(path = "") {
  const { data, error } = await supabaseClient.storage
    .from(bucketName)
    .list(path, {
      limit: 100,
      offset: 0
    });

  if (error) {
    alert("Erreur chargement fichiers : " + error.message);
    return;
  }

  const fileList = document.getElementById("fileList");

  fileList.innerHTML = "";

  if (path !== "") {
    const backDiv = document.createElement("div");
    backDiv.className = "file-item";
    backDiv.innerHTML = `
      <button onclick="loadFiles('')">Retour à la racine</button>
    `;
    fileList.appendChild(backDiv);
  }

  if (!data || data.length === 0) {
    const emptyDiv = document.createElement("div");
    emptyDiv.className = "file-item";
    emptyDiv.innerHTML = "Aucun fichier disponible.";
    fileList.appendChild(emptyDiv);
    return;
  }

  data.forEach(item => {
    if (item.name === ".keep") return;

    const fullPath = path
      ? `${path}/${item.name}`
      : item.name;

    const div = document.createElement("div");
    div.className = "file-item";

    if (!item.metadata) {
      div.innerHTML = `
        📁 <strong>${item.name}</strong>
        <br><br>

        <button onclick="loadFiles('${fullPath}')">
          Ouvrir
        </button>

        <button onclick="deleteFolder('${fullPath}')"
          style="background:#dc2626;margin-left:8px;">
          Supprimer dossier
        </button>
      `;
    } else {
      const { data: publicUrlData } = supabaseClient.storage
        .from(bucketName)
        .getPublicUrl(fullPath);

      div.innerHTML = `
        📄 <a href="${publicUrlData.publicUrl}" target="_blank">
          ${item.name}
        </a>

        <br><br>

        <button onclick="deleteFile('${fullPath}', '${path}')"
          style="background:#dc2626;">
          Supprimer fichier
        </button>
      `;
    }

    fileList.appendChild(div);
  });
}


// ================================
// SUPPRIMER UN FICHIER
// ================================

async function deleteFile(filePath, currentPath = "") {
  const confirmDelete = confirm(
    "Voulez-vous vraiment supprimer ce fichier ?"
  );

  if (!confirmDelete) return;

  const { error } = await supabaseClient.storage
    .from(bucketName)
    .remove([filePath]);

  if (error) {
    alert("Erreur suppression fichier : " + error.message);
    return;
  }

  alert("Fichier supprimé avec succès.");

  await loadFiles(currentPath);
  await loadFolders();
}


// ================================
// SUPPRIMER UN DOSSIER
// ================================

async function deleteFolder(folderPath) {
  const confirmDelete = confirm(
    "Voulez-vous vraiment supprimer ce dossier et tous ses fichiers ?"
  );

  if (!confirmDelete) return;

  const { data, error } = await supabaseClient.storage
    .from(bucketName)
    .list(folderPath, {
      limit: 1000,
      offset: 0
    });

  if (error) {
    alert("Erreur lecture dossier : " + error.message);
    return;
  }

  if (!data || data.length === 0) {
    alert("Dossier vide ou introuvable.");
    return;
  }

  const filesToDelete = data.map(item => {
    return `${folderPath}/${item.name}`;
  });

  const { error: deleteError } = await supabaseClient.storage
    .from(bucketName)
    .remove(filesToDelete);

  if (deleteError) {
    alert("Erreur suppression dossier : " + deleteError.message);
    return;
  }

  alert("Dossier supprimé avec succès.");

  await loadFiles("");
  await loadFolders();
}
async function loadHDXDataset() {
  const datasetId = "republique-democratique-du-congo-cas-et-deces-d-ebola";

  const apiUrl =
    `https://data.humdata.org/api/3/action/package_show?id=${datasetId}`;

  const box = document.getElementById("hdxDatasetBox");

  box.innerHTML = "Chargement des données HDX...";

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error("Erreur API HDX");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error("Dataset introuvable");
    }

    const dataset = result.result;

    let html = `
      <div class="file-item">
        <h3>${dataset.title}</h3>
        <p>${dataset.notes || "Aucune description disponible."}</p>
        <p><strong>Organisation :</strong> ${dataset.organization?.title || "Non précisée"}</p>
        <p><strong>Dernière mise à jour :</strong> ${dataset.metadata_modified || "Non précisée"}</p>
        <p>
          <a href="https://data.humdata.org/dataset/${dataset.name}" target="_blank">
            Voir la fiche complète sur HDX
          </a>
        </p>
      </div>
    `;

    dataset.resources.forEach(resource => {
      html += `
        <div class="file-item">
          <strong>📄 ${resource.name}</strong>
          <p>Format : ${resource.format || "Non précisé"}</p>
          <p>Date de mise à jour : ${resource.last_modified || resource.created || "Non précisée"}</p>
          <a href="${resource.url}" target="_blank">Télécharger / ouvrir</a>
        </div>
      `;
    });

    box.innerHTML = html;

  } catch (error) {
    box.innerHTML = `
      <div class="file-item" style="color:red;">
        Erreur de chargement HDX : ${error.message}
      </div>
    `;
  }
}

// ================================
// INITIALISATION
// ================================

window.addEventListener("load", async () => {
  await loadFolders();
  await loadFiles();
});
