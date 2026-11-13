// ============================================================================
// PLANETCRED DI - EARTH OBSERVATION INTELLIGENCE (TEMPLATE LOGIQUE VIERGE)
// ============================================================================

// Sliding navigation: available on the dashboard and safe on pages without the menu.
const menuOpenButton = document.getElementById("menu-open");
if (menuOpenButton) {
  const slideMenu = document.getElementById("slide-menu");
  const menuBackdrop = document.getElementById("menu-backdrop");
  const menuCloseButton = document.getElementById("menu-close");
  const setMenuOpen = (open) => {
    slideMenu.classList.toggle("is-open", open);
    menuBackdrop.classList.toggle("is-open", open);
    slideMenu.setAttribute("aria-hidden", String(!open));
    slideMenu.inert = !open;
    menuOpenButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("overflow-hidden", open);
    if (open) menuCloseButton.focus();
    else menuOpenButton.focus();
  };
  menuOpenButton.addEventListener("click", () => setMenuOpen(true));
  menuCloseButton.addEventListener("click", () => setMenuOpen(false));
  menuBackdrop.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && slideMenu.classList.contains("is-open"))
      setMenuOpen(false);
  });
}

// 1. INITIALISATION DE LA CARTE LEAFLET & VARIABLES GLOBALES
const map = L.map("map").setView([-20.25, 57.55], 10);

L.tileLayer("https://{s}://{z}/{x}/{y}{r}.png", {
  attribution: "&copy; OpenStreetMap &copy; CARTO &copy; NASA EOSDIS GIBS",
}).addTo(map);

let allProjects = [];
let projectPolygon = null;
let projectMarker = null;
let gibsBeforeLayer = null;
let gibsAfterLayer = null;

// 2. INITIALISATION DU GRAPHIQUE TEMPOREL (Chart.js)
const ctx = document.getElementById("trendChart").getContext("2d");
const trendChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: ["T1", "T2", "T3", "T4", "T5"],
    datasets: [
      {
        label: "Environmental Variable (Placeholder)",
        data: [0.2, 0.25, 0.22, 0.3, 0.35],
        borderColor: "#10b981",
        backgroundColor: "rgba(16, 185, 129, 0.15)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: "#cbd5e1" } } },
    scales: {
      y: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" },
      },
      x: {
        grid: { color: "rgba(255, 255, 255, 0.05)" },
        ticks: { color: "#94a3b8" },
      },
    },
  },
});

// 3. CHARGEMENT INITIAL DES PROJETS DEPUIS LE JSON
function initDashboard() {
  fetch("data/project_records.json")
    .then((res) => res.json())
    .then((data) => {
      allProjects = data.projects;
      const selector = document.getElementById("project-selector");
      selector.innerHTML = ""; // Nettoyer les options par défaut

      // Remplir le menu déroulant
      allProjects.forEach((proj) => {
        const option = document.createElement("option");
        option.value = proj.id;
        option.textContent = proj.dropdown_label;
        selector.appendChild(option);
      });

      // Charger le premier projet par défaut
      if (allProjects.length > 0) {
        renderProjectDetails(allProjects[0]);
      }

      // Écouter le changement de projet dans le menu déroulant
      selector.addEventListener("change", (e) => {
        const selectedProj = allProjects.find((p) => p.id === e.target.value);
        if (selectedProj) renderProjectDetails(selectedProj);
      });
    })
    .catch((err) =>
      console.warn("En attente du fichier project_records.json :", err),
    );
}

// 4. MISE À JOUR DE LA COLONNE DE GAUCHE, DE LA CARTE ET DES ÉTAPES
function renderProjectDetails(project) {
  // A. Informations textuelles de base
  document.getElementById("ui-project-title").textContent = project.title;
  document.getElementById("ui-org-name").textContent = project.organisation;
  document.getElementById("ui-coords").textContent =
    project.coordinates.join(", ");
  document.getElementById("ui-start-date").textContent = project.start_date;
  document.getElementById("ui-description").textContent = project.description;

  // B. Galerie "Community Proof Visualizer" (Preuves terrain)
  const evidenceContainer = document.getElementById("ui-evidence-gallery");
  if (evidenceContainer) {
    evidenceContainer.innerHTML = ""; // Réinitialiser la galerie
    if (project.community_evidence.length === 0) {
      evidenceContainer.innerHTML = `<p class="text-xs text-slate-500 col-span-2">No ground evidence uploaded yet.</p>`;
    } else {
      project.community_evidence.forEach((item) => {
        evidenceContainer.innerHTML += `
                    <div class="bg-slate-800/80 border border-slate-700 rounded-lg p-2 flex flex-col justify-between">
                        <div class="relative h-24 bg-slate-900 rounded overflow-hidden mb-2 flex items-center justify-center">
                            <img src="${item.image_url}" alt="${item.title}" class="object-cover w-full h-full" onerror="this.style.display='none'">
                            <span class="absolute top-1 right-1 bg-emerald-950/90 text-emerald-400 border border-emerald-600/50 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                ● ${item.status}
                            </span>
                        </div>
                        <p class="text-xs font-semibold text-white truncate">${item.title}</p>
                        <div class="flex justify-between items-center mt-1.5 pt-1.5 border-t border-slate-700/70">
                            <span class="text-[10px] text-emerald-400 font-medium">✓ ${item.status}</span>
                            <button onclick="alert('Audit Log: ${item.notes} (${item.date})')" class="text-[10px] bg-slate-700 hover:bg-slate-600 text-slate-200 px-2 py-0.5 rounded transition">
                                Inspect
                            </button>
                        </div>
                    </div>
                `;
      });
    }
  }

  // C. Journal "Project Milestone Validation Log" (EO Verified vs Ground Verified)
  const milestoneContainer = document.getElementById("ui-milestone-log");
  if (milestoneContainer) {
    milestoneContainer.innerHTML = "";
    project.milestones.forEach((m) => {
      const eoIcon = m.eo_verified
        ? '<span class="text-emerald-400 font-bold">✔</span>'
        : '<span class="text-slate-600">○</span>';
      const groundIcon = m.ground_verified
        ? '<span class="text-emerald-400 font-bold">✔</span>'
        : '<span class="text-slate-600">○</span>';
      milestoneContainer.innerHTML += `
                <div class="flex justify-between items-center py-2 border-b border-slate-800/80 text-xs">
                    <span class="text-slate-300">${m.task}</span>
                    <div class="flex gap-12 pr-4">
                        <span>${eoIcon}</span>
                        <span>${groundIcon}</span>
                    </div>
                </div>
            `;
    });
  }

  // D. Mise à jour de la carte (Zoom + Polygone vert + Marqueur)
  map.setView(project.coordinates, project.zoom_level || 13);

  if (projectMarker) map.removeLayer(projectMarker);
  if (projectPolygon) map.removeLayer(projectPolygon);

  projectMarker = L.marker(project.coordinates)
    .addTo(map)
    .bindPopup(`<b>${project.title}</b><br>${project.organisation}`);

  if (project.boundary_polygon && project.boundary_polygon.length > 0) {
    projectPolygon = L.polygon(project.boundary_polygon, {
      color: "#10b981",
      fillColor: "#10b981",
      fillOpacity: 0.25,
      weight: 2,
    }).addTo(map);
  }

  // E. Charger les résultats d'analyse NASA associés à ce projet
  if (project.analysis_file) {
    loadNasaAnalysis(project.analysis_file);
  }
}

// 5. CHARGEMENT DES DONNÉES SCIENTIFIQUES NASA (GEE + GIBS)
function loadNasaAnalysis(analysisJsonPath) {
  fetch(analysisJsonPath)
    .then((res) => {
      if (!res.ok) throw new Error("Fichier d'analyse NASA non généré.");
      return res.json();
    })
    .then((nasaData) => {
      // Mise à jour des KPIs du haut
      document.getElementById("ui-dataset").textContent =
        nasaData.source_calcul;
      document.getElementById("ui-trend").textContent =
        nasaData.statistiques.trend_direction.toUpperCase();
      document.getElementById("ui-pvalue").textContent =
        nasaData.statistiques.p_value;
      document.getElementById("ui-significance").textContent = nasaData
        .statistiques.significatif
        ? "Significant (p < 0.05)"
        : "Not Significant";

      // Mise à jour du graphique Chart.js
      trendChart.data.labels = nasaData.serie_temporelle.dates;
      trendChart.data.datasets[0].data = nasaData.serie_temporelle.valeurs;
      trendChart.data.datasets[0].label = "NASA Landsat 8 NDVI Time-Series";
      trendChart.update();

      // Chargement des couches visuelles NASA GIBS (Avant / Après)
      if (gibsBeforeLayer) map.removeLayer(gibsBeforeLayer);
      if (gibsAfterLayer) map.removeLayer(gibsAfterLayer);

      if (nasaData.gibs_urls) {
        gibsBeforeLayer = L.tileLayer(nasaData.gibs_urls.true_color_avant, {
          maxZoom: 9,
          opacity: 0.75,
        });
        gibsAfterLayer = L.tileLayer(nasaData.gibs_urls.true_color_apres, {
          maxZoom: 9,
          opacity: 0.75,
        }).addTo(map);
      }
    })
    .catch((err) =>
      console.log("Mode Template (En attente des données GEE) :", err.message),
    );
}

// 6. BOUTONS DE BASCULEMENT AVANT / APRÈS (NASA GIBS)
document.getElementById("btn-layer-before").addEventListener("click", () => {
  if (gibsAfterLayer) map.removeLayer(gibsAfterLayer);
  if (gibsBeforeLayer) gibsBeforeLayer.addTo(map);
});

document.getElementById("btn-layer-after").addEventListener("click", () => {
  if (gibsBeforeLayer) map.removeLayer(gibsBeforeLayer);
  if (gibsAfterLayer) gibsAfterLayer.addTo(map);
});

// Lancement de l'application au chargement de la page
document.addEventListener("DOMContentLoaded", initDashboard);
