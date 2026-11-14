const DEFAULT_CENTER = [-20.28, 57.55];
const BASELINE_YEAR = 2015;
const CURRENT_YEAR = new Date().getUTCFullYear() - 1;
const POWER_START = `${BASELINE_YEAR}0101`;
const POWER_END = `${CURRENT_YEAR}1231`;
const tr = (key, values) => (window.t ? window.t(key, values) : key);

const wasteMap = L.map("waste-map", { scrollWheelZoom: true }).setView(
  DEFAULT_CENTER,
  10,
);
const satelliteLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics",
  },
).addTo(wasteMap);

const modisDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
const thermalLayer = L.tileLayer.wms(
  "https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi",
  {
    layers: "MODIS_Terra_Land_Surface_Temp_Day",
    format: "image/png",
    transparent: true,
    version: "1.1.1",
    time: modisDate,
    uppercase: true,
    opacity: 0.58,
    attribution: "NASA EOSDIS GIBS / MODIS Terra LST",
  },
).addTo(wasteMap);

let mapLayerControl;
let mapLegendControl;
function refreshMapLayerControl() {
  if (mapLayerControl) wasteMap.removeControl(mapLayerControl);
  mapLayerControl = L.control
    .layers(
      { [tr("waste.baseSatellite")]: satelliteLayer },
      { [tr("waste.thermalLayer")]: thermalLayer },
      { collapsed: false },
    )
    .addTo(wasteMap);
}
refreshMapLayerControl();

function refreshMapLegend() {
  if (mapLegendControl) wasteMap.removeControl(mapLegendControl);
  mapLegendControl = L.control({ position: "bottomleft" });
  mapLegendControl.onAdd = () => {
    const legend = L.DomUtil.create(
      "div",
      "rounded-lg border border-slate-600 bg-slate-950/90 px-3 py-2 text-[11px] text-white shadow-lg backdrop-blur-sm",
    );
    legend.setAttribute("aria-label", tr("waste.legendTitle"));
    legend.innerHTML = `
      <p class="mb-1.5 font-semibold">${tr("waste.legendTitle")}</p>
      <div class="flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-emerald-500"></span><span>${tr("waste.legendLow")}</span></div>
      <div class="mt-1 flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-yellow-400"></span><span>${tr("waste.legendModerate")}</span></div>
      <div class="mt-1 flex items-center gap-2"><span class="h-2.5 w-2.5 rounded-full bg-orange-500"></span><span>${tr("waste.legendHigh")}</span></div>`;
    L.DomEvent.disableClickPropagation(legend);
    L.DomEvent.disableScrollPropagation(legend);
    return legend;
  };
  mapLegendControl.addTo(wasteMap);
}
refreshMapLegend();

const wasteMarkers = L.layerGroup().addTo(wasteMap);
let currentExportData = [];
let currentLocationTitle = "Mauritius";
let currentFacilities = [];
let currentClimate = null;
let hasSearchResult = false;
let searchStatus = { key: "waste.loading", values: {} };

function setSearchStatus(key, values = {}) {
  searchStatus = { key, values };
  const renderedValues = { ...values };
  if (values.problemKeys) {
    renderedValues.problems = values.problemKeys.map((problemKey) => tr(problemKey)).join("; ");
  }
  document.getElementById("search-status").textContent = tr(key, renderedValues);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function formatTemperature(value) {
  return Number.isFinite(value) ? `${value.toFixed(1)} °C` : tr("waste.tempUnavailable");
}

async function fetchJSON(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function geocodeLocation(query) {
  const params = new URLSearchParams({ q: query, format: "jsonv2", limit: "1" });
  const results = await fetchJSON(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
  );
  if (!Array.isArray(results) || results.length === 0) {
    const error = new Error(query);
    error.code = "locationNotFound";
    throw error;
  }
  return results[0];
}

function getBoundingBox(place) {
  if (Array.isArray(place.boundingbox) && place.boundingbox.length === 4) {
    const [south, north, west, east] = place.boundingbox.map(Number);
    if ([south, north, west, east].every(Number.isFinite)) {
      return { south, north, west, east };
    }
  }
  const lat = Number(place.lat);
  const lon = Number(place.lon);
  return { south: lat - 0.08, north: lat + 0.08, west: lon - 0.08, east: lon + 0.08 };
}

function getFacilityTypeKey(tags) {
  if (tags.landuse === "landfill") return "waste.facilityLandfill";
  if (tags.amenity === "waste_transfer_station") return "waste.facilityTransfer";
  if (tags.amenity === "waste_disposal") return "waste.facilityDisposal";
  if (tags.recycling === "centre") return "waste.facilityRecycling";
  return "waste.facilityOther";
}

async function loadWasteFacilities(bounds) {
  const box = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  const query = `
    [out:json][timeout:25];
    (
      node["landuse"="landfill"](${box});
      way["landuse"="landfill"](${box});
      relation["landuse"="landfill"](${box});
      node["amenity"="waste_transfer_station"](${box});
      way["amenity"="waste_transfer_station"](${box});
      node["amenity"="waste_disposal"](${box});
      way["amenity"="waste_disposal"](${box});
      node["recycling"="centre"](${box});
    );
    out center 100;
  `;
  const body = new URLSearchParams({ data: query });
  const result = await fetchJSON("https://overpass-api.de/api/interpreter", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body,
  });
  return (result.elements || [])
    .map((element) => {
      const lat = Number(element.lat ?? element.center?.lat);
      const lon = Number(element.lon ?? element.center?.lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
      return {
        id: `${element.type}/${element.id}`,
        name: element.tags?.name || element.tags?.operator || "Unnamed waste facility",
        typeKey: getFacilityTypeKey(element.tags || {}),
        lat,
        lon,
        osmUrl: `https://www.openstreetmap.org/${encodeURIComponent(element.type)}/${element.id}`,
      };
    })
    .filter(Boolean);
}

async function loadRegionalClimate(lat, lon) {
  const params = new URLSearchParams({
    parameters: "T2M_MAX",
    community: "RE",
    longitude: String(lon),
    latitude: String(lat),
    start: POWER_START,
    end: POWER_END,
    format: "JSON",
    "time-standard": "UTC",
  });
  const data = await fetchJSON(
    `https://power.larc.nasa.gov/api/temporal/daily/point?${params.toString()}`,
  );
  const series = data?.properties?.parameter?.T2M_MAX;
  if (!series || typeof series !== "object") {
    throw new Error("NASA POWER returned no T2M_MAX series");
  }

  const annualMeans = {};
  for (const year of [BASELINE_YEAR, CURRENT_YEAR]) {
    const values = Object.entries(series)
      .filter(
        ([date, value]) =>
          date.startsWith(String(year)) &&
          value !== null &&
          value !== "" &&
          Number.isFinite(Number(value)) &&
          Number(value) > -900,
      )
      .map(([, value]) => Number(value));
    annualMeans[year] = values.length
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : null;
  }
  return {
    baselineYear: BASELINE_YEAR,
    currentYear: CURRENT_YEAR,
    baseline: annualMeans[BASELINE_YEAR],
    current: annualMeans[CURRENT_YEAR],
  };
}

function renderFacilities(sites, climate) {
  currentFacilities = sites;
  currentClimate = climate;
  hasSearchResult = true;
  wasteMarkers.clearLayers();
  const tbody = document.getElementById("waste-table-body");
  const change =
    Number.isFinite(climate?.baseline) && Number.isFinite(climate?.current)
      ? climate.current - climate.baseline
      : null;

  if (!sites.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="px-4 py-5 text-slate-500">${tr("waste.noSites")} ${tr("waste.tryWider")}</td></tr>`;
  } else {
    tbody.innerHTML = sites
      .map((site) => {
        const facilityType = tr(site.typeKey);
        const popup = `<strong>${escapeHTML(site.name)}</strong><br>${escapeHTML(facilityType)}<br>${site.lat.toFixed(5)}, ${site.lon.toFixed(5)}<br><a href="${site.osmUrl}" target="_blank" rel="noopener">${tr("waste.openRecord")}</a>`;
        L.circleMarker([site.lat, site.lon], {
          radius: 7,
          color: "#f59e0b",
          fillColor: "#fbbf24",
          fillOpacity: 0.9,
          weight: 2,
        })
          .bindPopup(popup)
          .addTo(wasteMarkers);
        return `
          <tr class="hover:bg-slate-800/40">
            <td class="px-4 py-3 font-medium text-white">${escapeHTML(site.name)}<span class="block text-[11px] text-slate-500">${site.lat.toFixed(4)}, ${site.lon.toFixed(4)}</span></td>
            <td class="px-4 py-3">${escapeHTML(facilityType)}</td>
            <td class="px-4 py-3"><a class="text-emerald-300 underline" href="${site.osmUrl}" target="_blank" rel="noopener">${tr("waste.tableOsm")}</a></td>
            <td class="px-4 py-3 font-mono">${formatTemperature(climate?.baseline)}</td>
            <td class="px-4 py-3 font-mono">${formatTemperature(climate?.current)}</td>
            <td class="px-4 py-3 font-mono">${formatTemperature(change)}</td>
          </tr>`;
      })
      .join("");
  }

  currentExportData = sites.map((site) => ({ ...site, type: tr(site.typeKey), climate }));
  document.getElementById("kpi-site-count").textContent = tr("waste.siteCount", {
    count: sites.length,
    plural: sites.length === 1 ? "" : "s",
  });
  document.getElementById("kpi-temperature-change").textContent = formatTemperature(change);
  document.getElementById("kpi-temperature-note").textContent = tr("waste.regionalNote", {
    baselineYear: climate?.baselineYear ?? BASELINE_YEAR,
    currentYear: climate?.currentYear ?? CURRENT_YEAR,
  });
  document.getElementById("table-year-current").textContent = tr("waste.tableLatest", {
    year: climate?.currentYear ?? CURRENT_YEAR,
  });
  document.getElementById("climate-period").textContent = tr("waste.climatePeriod", {
    baselineYear: climate?.baselineYear ?? BASELINE_YEAR,
    currentYear: climate?.currentYear ?? CURRENT_YEAR,
  });
  renderSummary(sites, climate);
}

function renderSummary(sites, climate) {
  const box = document.getElementById("ai-summary-content");
  const change =
    Number.isFinite(climate?.baseline) && Number.isFinite(climate?.current)
      ? climate.current - climate.baseline
      : null;
  const climateText =
    change === null
      ? tr("waste.summaryClimateUnavailable")
      : tr("waste.summaryClimateChange", {
          change: formatTemperature(change),
          baselineYear: climate.baselineYear,
          currentYear: climate.currentYear,
        });
  box.innerHTML = `
    <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
      <article class="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><h3 class="font-bold text-indigo-300">${tr("waste.summaryClimate")}</h3><p class="mt-2">${climateText} ${tr("waste.summaryPoint")}</p></article>
      <article class="rounded-lg border border-amber-900/40 bg-amber-950/10 p-3"><h3 class="font-bold text-amber-300">${tr("waste.summaryRegistry")}</h3><p class="mt-2">${tr("waste.summarySites", { count: sites.length, plural: sites.length === 1 ? "" : "s" })}</p></article>
      <article class="rounded-lg border border-emerald-900/40 bg-emerald-950/10 p-3"><h3 class="font-bold text-emerald-300">${tr("waste.summaryInterpretation")}</h3><p class="mt-2">${tr("waste.summaryLimits")}</p></article>
    </div>`;
}

const menuOpenButton = document.getElementById("menu-open");
const slideMenu = document.getElementById("slide-menu");
const menuBackdrop = document.getElementById("menu-backdrop");
const menuCloseButton = document.getElementById("menu-close");
if (menuOpenButton && slideMenu && menuBackdrop && menuCloseButton) {
  const setMenuOpen = (open) => {
    slideMenu.classList.toggle("is-open", open);
    menuBackdrop.classList.toggle("is-open", open);
    slideMenu.setAttribute("aria-hidden", String(!open));
    slideMenu.inert = !open;
    menuBackdrop.setAttribute("aria-hidden", String(!open));
    menuOpenButton.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("overflow-hidden", open);
    if (open) menuCloseButton.focus();
    else menuOpenButton.focus();
  };

  menuOpenButton.addEventListener("click", () => setMenuOpen(true));
  menuCloseButton.addEventListener("click", () => setMenuOpen(false));
  menuBackdrop.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && slideMenu.classList.contains("is-open")) {
      setMenuOpen(false);
    }
  });
}

async function scanLocation(query) {
  const button = document.getElementById("btn-search-location");
  setSearchStatus("waste.searching", { query });
  button.disabled = true;
  button.classList.add("cursor-wait", "opacity-60");

  try {
    const place = await geocodeLocation(query);
    const lat = Number(place.lat);
    const lon = Number(place.lon);
    const bounds = getBoundingBox(place);
    currentLocationTitle = place.display_name.split(",")[0] || query;
    wasteMap.fitBounds(
      [
        [bounds.south, bounds.west],
        [bounds.north, bounds.east],
      ],
      { padding: [20, 20], maxZoom: 13 },
    );

    const [facilityResult, climateResult] = await Promise.allSettled([
      loadWasteFacilities(bounds),
      loadRegionalClimate(lat, lon),
    ]);
    const sites = facilityResult.status === "fulfilled" ? facilityResult.value : [];
    const climate = climateResult.status === "fulfilled" ? climateResult.value : null;
    renderFacilities(sites, climate);

    const problems = [];
    if (facilityResult.status === "rejected") problems.push(tr("waste.osmUnavailable"));
    if (climateResult.status === "rejected") problems.push(tr("waste.nasaUnavailable"));
    setSearchStatus(
      problems.length ? "waste.statusPartial" : "waste.statusLoaded",
      {
        problemKeys: problems.length
          ? [
              ...(facilityResult.status === "rejected" ? ["waste.osmUnavailable"] : []),
              ...(climateResult.status === "rejected" ? ["waste.nasaUnavailable"] : []),
            ]
          : [],
        location: currentLocationTitle,
        count: sites.length,
        plural: sites.length === 1 ? "" : "s",
      },
    );
  } catch (error) {
    wasteMarkers.clearLayers();
    renderFacilities([], null);
    setSearchStatus(
      error.code === "locationNotFound" ? "waste.locationNotFound" : "waste.statusError",
      error.code === "locationNotFound" ? { query } : { message: error.message },
    );
  } finally {
    button.disabled = false;
    button.classList.remove("cursor-wait", "opacity-60");
  }
}

document.getElementById("country-search-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.getElementById("location-input").value.trim();
  if (query) scanLocation(query);
});

document.getElementById("btn-export-excel").addEventListener("click", () => {
  if (!window.XLSX) {
    window.alert(tr("waste.exportUnavailable"));
    return;
  }
  const rows = currentExportData.map((site) => ({
    [tr("waste.exportLocation")]: currentLocationTitle,
    [tr("waste.exportName")]: site.name,
    [tr("waste.exportType")]: site.type,
    Latitude: site.lat,
    Longitude: site.lon,
    [tr("waste.exportRecord")]: site.osmUrl,
    [tr("waste.exportBaseline")]: site.climate?.baseline ?? tr("waste.tempUnavailable"),
    [tr("waste.exportCurrent", { year: site.climate?.currentYear ?? CURRENT_YEAR })]: site.climate?.current ?? tr("waste.tempUnavailable"),
  }));
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(
    rows.length
      ? rows
      : [{ [tr("waste.exportLocation")]: currentLocationTitle, Note: tr("waste.exportEmpty") }],
  );
  XLSX.utils.book_append_sheet(workbook, worksheet, tr("waste.exportSheet"));
  XLSX.writeFile(
    workbook,
    `PlanetCred_Waste_Report_${currentLocationTitle.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`,
  );
});

document.addEventListener("app-language-changed", () => {
  refreshMapLayerControl();
  refreshMapLegend();
  if (hasSearchResult) renderFacilities(currentFacilities, currentClimate);
  setSearchStatus(searchStatus.key, searchStatus.values);
});

document.addEventListener("DOMContentLoaded", () => scanLocation("Mauritius"));
