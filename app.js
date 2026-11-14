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

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let allProjects = [];
let projectPolygon = null;
let projectMarker = null;
let gibsBeforeLayer = null;
let gibsAfterLayer = null;
let landsatBeforeLayer = null;
let landsatAfterLayer = null;
let sentinelBeforeLayer = null;
let sentinelAfterLayer = null;
let activeProject = null;

// 2. INITIALISATION DU GRAPHIQUE TEMPOREL (Chart.js)
const chartCanvas = document.getElementById("trendChart");
const ctx = chartCanvas ? chartCanvas.getContext("2d") : null;
function buildNdviTrend(dates, values) {
  const points = dates
    .map((date, index) => ({
      x: Date.parse(`${date}T00:00:00Z`),
      y: Number(values[index]),
    }))
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));
  if (points.length < 2) return { points, fitted: [] };

  const firstTime = points[0].x;
  const years = points.map((point) => (point.x - firstTime) / 31557600000);
  const meanX = years.reduce((sum, value) => sum + value, 0) / years.length;
  const meanY = points.reduce((sum, point) => sum + point.y, 0) / points.length;
  const denominator = years.reduce(
    (sum, value) => sum + (value - meanX) ** 2,
    0,
  );
  const slope =
    years.reduce(
      (sum, value, index) => sum + (value - meanX) * (points[index].y - meanY),
      0,
    ) / denominator;
  const fitted = [points[0], points[points.length - 1]].map((point, index) => ({
    x: point.x,
    y: meanY + slope * (years[index === 0 ? 0 : years.length - 1] - meanX),
  }));
  return { points, fitted };
}

function inclusiveWindowLabel(period) {
  const endExclusive = new Date(`${period[1]}T00:00:00Z`);
  endExclusive.setUTCDate(endExclusive.getUTCDate() - 1);
  return `${period[0]} – ${endExclusive.toISOString().slice(0, 10)}`;
}

const trendChart =
  ctx &&
  new Chart(ctx, {
    type: "line",
    data: {
      datasets: [
        {
          label: "Observed NDVI",
          data: [],
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          borderWidth: 1.8,
          pointRadius: 2,
          pointHoverRadius: 4,
          tension: 0.15,
          fill: true,
        },
        {
          label: "Linear trend from observed data",
          data: [],
          borderColor: "#a7f3d0",
          borderDash: [7, 5],
          borderWidth: 2.5,
          pointRadius: 0,
          tension: 0,
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#cbd5e1" } },
        tooltip: {
          callbacks: {
            title: (items) =>
              items.length
                ? new Date(items[0].parsed.x).toISOString().slice(0, 10)
                : "",
          },
        },
      },
      scales: {
        y: {
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: { color: "#94a3b8" },
        },
        x: {
          type: "linear",
          grid: { color: "rgba(255, 255, 255, 0.05)" },
          ticks: {
            color: "#94a3b8",
            maxTicksLimit: 7,
            callback: (value) => new Date(Number(value)).getUTCFullYear(),
          },
        },
      },
    },
  });

// 3. CHARGEMENT INITIAL DES PROJETS DEPUIS LE JSON
function initDashboard() {
  fetch("data/project_records.json")
    .then((res) => {
      if (!res.ok)
        throw new Error(`HTTP ${res.status} loading project_records.json`);
      return res.json();
    })
    .then((data) => {
      allProjects = data.projects;
      const selector = document.getElementById("project-selector");
      if (!selector || !Array.isArray(allProjects)) {
        throw new Error("project-selector or projects array is missing");
      }
      selector.innerHTML = ""; // Nettoyer les options par défaut

      // Remplir le menu déroulant
      allProjects.forEach((proj) => {
        const option = document.createElement("option");
        option.value = proj.id;
        option.textContent = localizedProjectLabel(proj);
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
    .catch((err) => {
      console.error("Unable to load project_records.json:", err);
      const selector = document.getElementById("project-selector");
      if (selector)
        selector.innerHTML = `<option value="">${t("common.unavailable")}</option>`;
    });
}

function localizedProjectLabel(project) {
  if (project.id === "project-01") return t("project.title");
  if (project.id === "project-02") return t("project.pendingOption");
  return project.dropdown_label;
}

// 4. MISE À JOUR DE LA COLONNE DE GAUCHE, DE LA CARTE ET DES ÉTAPES
function renderProjectDetails(project) {
  activeProject = project;
  // A. Informations textuelles de base
  document.getElementById("ui-project-title").textContent =
    project.id === "project-01"
      ? t("project.title")
      : t("project.pendingTitle");
  const verificationBadge = document.getElementById("ui-verification");
  if (verificationBadge)
    verificationBadge.textContent = t(
      project.id === "project-01"
        ? "project.publicSources"
        : "project.pendingStatus",
    );
  document.getElementById("ui-org-name").textContent = project.organisation;
  document.getElementById("ui-coords").textContent =
    project.coordinates.join(", ");
  document.getElementById("ui-start-date").textContent = project.start_date;
  document.getElementById("ui-description").textContent =
    project.id === "project-01"
      ? t("project.description")
      : t("project.pendingDescription");

  // B. Galerie "Community Proof Visualizer" (Preuves terrain)
  const evidenceContainer = document.getElementById("ui-evidence-gallery");
  if (evidenceContainer) {
    evidenceContainer.innerHTML = ""; // Réinitialiser la galerie
    if (project.community_evidence.length === 0) {
      evidenceContainer.innerHTML = `<p class="col-span-2 text-xs text-slate-500">${t("proof.empty")}</p>`;
    } else {
      const titleKeys = [
        "proof.planting",
        "proof.saplings",
        "proof.method",
        "proof.forest",
      ];
      const noteKeys = [
        "proof.plantingNote",
        "proof.saplingNote",
        "proof.methodNote",
        "proof.forestNote",
      ];
      const typeKeys = [
        "proof.fieldPhoto",
        "proof.forestPhoto",
        "proof.organizationSource",
        "proof.projectPhoto",
      ];
      project.community_evidence.forEach((item, index) => {
        const title = t(titleKeys[index] || "proof.source");
        const card = document.createElement("article");
        card.className =
          "flex flex-col justify-between rounded-lg border border-slate-700 bg-slate-800/80 p-2";
        card.innerHTML = `<div class="relative mb-2 flex h-24 items-center justify-center overflow-hidden rounded bg-slate-900"><img class="h-full w-full object-cover"><span class="evidence-status absolute right-1 top-1 rounded border border-emerald-600/50 bg-emerald-950/90 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400"></span></div><p class="evidence-title truncate text-xs font-semibold text-white"></p><p class="evidence-type mt-1 text-[10px] text-slate-400"></p><div class="mt-1.5 flex items-center justify-between border-t border-slate-700/70 pt-1.5"><span class="evidence-check text-[10px] font-medium text-emerald-400"></span><button type="button" class="rounded bg-slate-700 px-2 py-0.5 text-[10px] text-slate-200 transition hover:bg-slate-600"></button></div>`;
        const image = card.querySelector("img");
        image.src = item.image_url;
        image.alt = title;
        image.onerror = () => {
          image.style.display = "none";
        };
        card.querySelector(".evidence-status").textContent =
          `● ${t("proof.source")}`;
        card.querySelector(".evidence-title").textContent = title;
        card.querySelector(".evidence-type").textContent = t(
          typeKeys[index] || "proof.fieldPhoto",
        );
        card.querySelector(".evidence-check").textContent =
          `✓ ${t("proof.source")}`;
        const inspect = card.querySelector("button");
        inspect.textContent = t("proof.inspect");
        inspect.addEventListener("click", () => {
          const note = t(noteKeys[index] || "proof.source");
          window.alert(
            `${t("proof.auditLog")}: ${note}${item.date ? ` (${item.date})` : ""}`,
          );
        });
        evidenceContainer.appendChild(card);
      });
    }
  }

  // C. Journal "Project Milestone Validation Log" (EO Verified vs Ground Verified)
  const milestoneContainer = document.getElementById("ui-milestone-log");
  if (milestoneContainer) {
    milestoneContainer.innerHTML = "";
    project.milestones.forEach((m) => {
      const eoIcon = m.eo_verified
        ? '<span class="text-emerald-400 font-bold">✓</span>'
        : '<span class="text-slate-600">○</span>';
      const groundIcon = m.ground_verified
        ? '<span class="text-emerald-400 font-bold">✓</span>'
        : '<span class="text-slate-600">○</span>';
      const milestoneKeys = [
        "milestone.sitePrep",
        "milestone.planting",
        "milestone.monitoring",
      ];
      milestoneContainer.innerHTML += `
                <div class="flex justify-between items-center py-2 border-b border-slate-800/80 text-xs">
                    <span class="text-slate-300">${t(milestoneKeys[project.milestones.indexOf(m)] || "milestone.empty")}</span>
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
    .bindPopup(
      `<b>${project.id === "project-01" ? t("project.title") : t("project.pendingTitle")}</b><br>${project.organisation}`,
    );

  if (project.boundary_polygon && project.boundary_polygon.length > 0) {
    projectPolygon = L.polygon(project.boundary_polygon, {
      color: "#10b981",
      fillColor: "#10b981",
      fillOpacity: 0.035,
      weight: 3,
    })
      .bindTooltip(t("project.analysisExtent"))
      .addTo(map);
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
      document.getElementById("ui-dataset").textContent = t(
        "metric.datasetLandsat",
      );
      const trendKey =
        {
          increasing: "trend.increasing",
          decreasing: "trend.decreasing",
          "no trend": "trend.noTrend",
        }[nasaData.statistiques.trend_direction] || "trend.noTrend";
      document.getElementById("ui-trend").textContent = t(trendKey);
      document.getElementById("ui-pvalue").textContent = Number(
        nasaData.statistiques.p_value,
      ).toFixed(5);
      document.getElementById("ui-significance").textContent = nasaData
        .statistiques.significatif
        ? t("metric.significant")
        : t("metric.notSignificant");

      // Mise à jour du graphique Chart.js
      if (trendChart) {
        const dates = nasaData.serie_temporelle.dates;
        const values = nasaData.serie_temporelle.valeurs;
        const { points, fitted } = buildNdviTrend(dates, values);
        const isSignificant = nasaData.statistiques.significatif;
        const direction = nasaData.statistiques.trend_direction;
        const trendColor =
          direction === "increasing" && isSignificant
            ? "#10b981"
            : direction === "decreasing" && isSignificant
              ? "#fb7185"
              : "#fbbf24";
        trendChart.data.datasets[0].data = points;
        trendChart.data.datasets[0].label = t("chart.observed", {
          count: points.length,
        });
        trendChart.data.datasets[0].borderColor = trendColor;
        trendChart.data.datasets[0].backgroundColor =
          direction === "increasing" && isSignificant
            ? "rgba(16, 185, 129, 0.14)"
            : "rgba(148, 163, 184, 0.10)";
        trendChart.data.datasets[1].data = fitted;
        trendChart.data.datasets[1].label = t("chart.fitted");
        trendChart.data.datasets[1].borderColor = trendColor;
        const startNDVI = points[0]?.y;
        const endNDVI = points.at(-1)?.y;
        if (Number.isFinite(startNDVI) && Number.isFinite(endNDVI)) {
          const delta = endNDVI - startNDVI;
          const percent =
            startNDVI === 0 ? null : (delta / Math.abs(startNDVI)) * 100;
          const formatSigned = (number, digits) =>
            `${number >= 0 ? "+" : ""}${number.toFixed(digits)}`;
          document.getElementById("ui-ndvi-change").textContent = t(
            "metric.deltaFormat",
            {
              delta: formatSigned(delta, 3),
              percent: percent === null ? "—" : formatSigned(percent, 1),
            },
          );
        }
        const firstYear = dates[0]?.slice(0, 4);
        const lastYear = dates.at(-1)?.slice(0, 4);
        document.getElementById("trend-heading").textContent = t(
          "chart.title",
          { first: firstYear, last: lastYear },
        );
        trendChart.update();
      }
      const sentinelSection = document.getElementById("sentinel2-downloads");
      const sentinel = nasaData.sentinel2_visual;
      const comparison = sentinel || nasaData.landsat_rgb;
      if (comparison) {
        const beforeRange =
          comparison.before.period || comparison.before_period;
        const afterRange = comparison.after.period || comparison.after_period;
        const beforeYear = beforeRange[0].slice(0, 4);
        const afterYear = afterRange[0].slice(0, 4);
        document.getElementById("btn-layer-before").textContent = t(
          "map.before",
          { year: beforeYear },
        );
        document.getElementById("btn-layer-after").textContent = t(
          "map.after",
          { year: afterYear },
        );
        document.getElementById("btn-layer-before").title = t(
          "map.windowTitle",
          { range: inclusiveWindowLabel(beforeRange) },
        );
        document.getElementById("btn-layer-after").title = t(
          "map.windowTitle",
          { range: inclusiveWindowLabel(afterRange) },
        );
        document.getElementById("layer-period-caption").textContent = t(
          "map.windows",
          {
            before: inclusiveWindowLabel(beforeRange),
            after: inclusiveWindowLabel(afterRange),
          },
        );
      }
      if (sentinelSection && sentinel) {
        sentinelSection.hidden = false;
        ["before", "after"].forEach((period) => {
          const preview = document.getElementById(
            `sentinel2-${period}-preview`,
          );
          const previewLink = document.getElementById(
            `sentinel2-${period}-open`,
          );
          const downloadLink = document.getElementById(
            `sentinel2-${period}-download`,
          );
          preview.src = sentinel[period].preview;
          preview.alt = t("imagery.alt", {
            period: t(
              period === "before" ? "imagery.reference" : "imagery.recent",
            ),
          });
          previewLink.href = sentinel[period].preview;
          downloadLink.href = sentinel[period].geotiff;
          downloadLink.download = `sentinel2_${period}.tif`;
          document.getElementById(`sentinel2-${period}-dates`).textContent =
            inclusiveWindowLabel(sentinel[period].period);
        });
      }
      const period = document.getElementById("ui-period");
      if (period && nasaData.serie_temporelle.dates.length) {
        period.textContent = `${nasaData.serie_temporelle.dates[0]} – ${nasaData.serie_temporelle.dates.at(-1)}`;
      }

      // Préférer Sentinel-2 (10 m), puis Landsat (30 m); GIBS reste le
      // contexte de repli si le pipeline n'a pas encore produit les images.
      if (gibsBeforeLayer) map.removeLayer(gibsBeforeLayer);
      if (gibsAfterLayer) map.removeLayer(gibsAfterLayer);
      if (landsatBeforeLayer) map.removeLayer(landsatBeforeLayer);
      if (landsatAfterLayer) map.removeLayer(landsatAfterLayer);
      if (sentinelBeforeLayer) map.removeLayer(sentinelBeforeLayer);
      if (sentinelAfterLayer) map.removeLayer(sentinelAfterLayer);

      if (sentinel && sentinel.bounds) {
        sentinelBeforeLayer = L.imageOverlay(
          sentinel.before.preview,
          sentinel.bounds,
          { opacity: 1, interactive: false },
        );
        sentinelAfterLayer = L.imageOverlay(
          sentinel.after.preview,
          sentinel.bounds,
          { opacity: 1, interactive: false },
        ).addTo(map);
        if (projectPolygon) projectPolygon.bringToFront();
        if (projectMarker) projectMarker.setZIndexOffset(1000);
      } else if (nasaData.landsat_rgb && nasaData.landsat_rgb.bounds) {
        landsatBeforeLayer = L.imageOverlay(
          nasaData.landsat_rgb.before,
          nasaData.landsat_rgb.bounds,
          { opacity: 0.95, interactive: false },
        );
        landsatAfterLayer = L.imageOverlay(
          nasaData.landsat_rgb.after,
          nasaData.landsat_rgb.bounds,
          { opacity: 0.95, interactive: false },
        ).addTo(map);
        if (projectPolygon) projectPolygon.bringToFront();
        if (projectMarker) projectMarker.setZIndexOffset(1000);
      } else if (nasaData.gibs_urls) {
        gibsBeforeLayer = L.tileLayer(nasaData.gibs_urls.true_color_avant, {
          maxNativeZoom: 9,
          maxZoom: 18,
          opacity: 0.75,
        });
        gibsAfterLayer = L.tileLayer(nasaData.gibs_urls.true_color_apres, {
          maxNativeZoom: 9,
          maxZoom: 18,
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
  if (landsatAfterLayer) map.removeLayer(landsatAfterLayer);
  if (sentinelAfterLayer) map.removeLayer(sentinelAfterLayer);
  if (gibsBeforeLayer) gibsBeforeLayer.addTo(map);
  if (landsatBeforeLayer) landsatBeforeLayer.addTo(map);
  if (sentinelBeforeLayer) sentinelBeforeLayer.addTo(map);
  if (projectPolygon) projectPolygon.bringToFront();
  if (projectMarker) projectMarker.setZIndexOffset(1000);
});

document.getElementById("btn-layer-after").addEventListener("click", () => {
  if (gibsBeforeLayer) map.removeLayer(gibsBeforeLayer);
  if (landsatBeforeLayer) map.removeLayer(landsatBeforeLayer);
  if (sentinelBeforeLayer) map.removeLayer(sentinelBeforeLayer);
  if (gibsAfterLayer) gibsAfterLayer.addTo(map);
  if (landsatAfterLayer) landsatAfterLayer.addTo(map);
  if (sentinelAfterLayer) sentinelAfterLayer.addTo(map);
  if (projectPolygon) projectPolygon.bringToFront();
  if (projectMarker) projectMarker.setZIndexOffset(1000);
});

// Refresh data-driven labels whenever the language selector changes.
document.addEventListener("app-language-changed", () => {
  const selector = document.getElementById("project-selector");
  if (selector && allProjects.length) {
    const selectedId = activeProject?.id || selector.value;
    selector.innerHTML = "";
    allProjects.forEach((project) => {
      const option = document.createElement("option");
      option.value = project.id;
      option.textContent = localizedProjectLabel(project);
      selector.appendChild(option);
    });
    selector.value = selectedId;
    const selectedProject = allProjects.find(
      (project) => project.id === selectedId,
    );
    if (selectedProject) renderProjectDetails(selectedProject);
  }
});

// Start the application when the page has loaded.
document.addEventListener("DOMContentLoaded", initDashboard);
