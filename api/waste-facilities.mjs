const OVERPASS_ENDPOINTS = [
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

function sendJSON(response, status, data, cache = false) {
  response.status(status);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader(
    "Cache-Control",
    cache ? "public, max-age=600, s-maxage=21600, stale-while-revalidate=86400" : "no-store",
  );
  if (cache) response.setHeader("CDN-Cache-Control", "public, s-maxage=21600, stale-while-revalidate=86400");
  response.json(data);
}

function parseBounds(request) {
  const url = new URL(request.url || "/", `https://${request.headers.host || "localhost"}`);
  const values = (url.searchParams.get("bbox") || "").split(",").map(Number);
  if (values.length !== 4 || !values.every(Number.isFinite)) return null;
  const [south, west, north, east] = values;
  if (south < -90 || north > 90 || west < -180 || east > 180 || south >= north || west >= east) return null;
  if (north - south > 25 || east - west > 25) return null;
  return { south, west, north, east };
}

function createQuery(bounds) {
  const box = `${bounds.south},${bounds.west},${bounds.north},${bounds.east}`;
  return `
    [out:json][timeout:15];
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
    out center 50;
  `;
}

async function queryOverpass(endpoint, query) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "User-Agent": "PlanetCred-Waste-Dashboard/1.0 (OpenStreetMap facility lookup)",
    },
    body: new URLSearchParams({ data: query }),
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Overpass HTTP ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data.elements)) throw new Error("Overpass returned an invalid response");
  return data;
}

export default async function handler(request, response) {
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    return sendJSON(response, 405, { error: "Method not allowed." });
  }

  const bounds = parseBounds(request);
  if (!bounds) return sendJSON(response, 400, { error: "A valid bounding box no larger than 25 degrees is required." });

  const query = createQuery(bounds);
  const failures = [];
  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const data = await queryOverpass(endpoint, query);
      return sendJSON(response, 200, {
        elements: data.elements,
        source: new URL(endpoint).hostname,
        timestamp: data.osm3s?.timestamp_osm_base || null,
      }, true);
    } catch (error) {
      failures.push(`${new URL(endpoint).hostname}: ${error.name === "TimeoutError" ? "timeout" : error.message}`);
    }
  }

  console.error("OSM facility lookup failed:", failures.join("; "));
  return sendJSON(response, 502, { error: "OpenStreetMap facilities are temporarily unavailable." });
}
