import { writeFile } from "node:fs/promises";

const query = `[out:json][timeout:180];
area["name"="Foz do Iguaçu"]["boundary"="administrative"]->.city;
(
  nwr["tourism"~"hotel|resort|motel|guest_house|hostel|attraction|theme_park|zoo|museum"](area.city);
  nwr["amenity"~"fuel|parking|hospital|clinic|college|university|school"](area.city);
  nwr["shop"~"mall|supermarket|department_store|car|car_repair|motorcycle|wholesale"](area.city);
  nwr["leisure"~"stadium|sports_centre"](area.city);
  nwr["aeroway"="aerodrome"](area.city);
);
out center tags;`;

const endpoints = [
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass-api.de/api/interpreter",
];

function segment(tags) {
  if (/hotel|resort|motel|guest_house|hostel/.test(tags.tourism ?? "")) return "Hotel";
  if (tags.amenity === "fuel") return "Posto";
  if (tags.amenity === "parking") return "Estacionamento";
  if (/hospital|clinic/.test(tags.amenity ?? "")) return "Saúde";
  if (/college|university|school/.test(tags.amenity ?? "")) return "Educação";
  if (/car|car_repair|motorcycle/.test(tags.shop ?? "")) return "Automotivo";
  if (/mall|supermarket|department_store|wholesale/.test(tags.shop ?? "")) return "Varejo";
  if (tags.aeroway === "aerodrome") return "Transporte";
  if (/stadium|sports_centre/.test(tags.leisure ?? "")) return "Esporte";
  return "Atração";
}

function potential(tags, type) {
  if (["Hotel", "Posto", "Estacionamento", "Transporte"].includes(type)) return "Alta";
  if (tags.shop === "mall" || tags.tourism === "theme_park" || tags.tourism === "resort") return "Alta";
  return "Média";
}

function address(tags) {
  const street = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(", ");
  return street ? `${street} — Foz do Iguaçu, PR` : "Foz do Iguaçu, PR";
}

function isPublicInstitution(tags) {
  const text = Object.values(tags).join(" ");
  return /\b(upa|unidade de pronto atendimento|unidade básica de saúde|ubs|hospital municipal|escola municipal|colégio estadual|universidade federal|instituto federal|unila|prefeitura|câmara municipal|secretaria municipal|receita federal|aduana|pol[ií]cia|delegacia|corpo de bombeiros|f[oó]rum|defensoria|minist[eé]rio p[uú]blico|parque zool[oó]gico bosque guarani|centro de recep[cç][aã]o de visitantes.*itaipu|ecomuseu de itaipu)\b/i.test(text);
}

let response;
for (const endpoint of endpoints) {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", "user-agent": "Bmaxbrasil-CommercialMap/1.0" },
      body: new URLSearchParams({ data: query }),
    });
    if (result.ok) { response = await result.json(); break; }
  } catch { /* try the next public Overpass mirror */ }
}

if (!response?.elements) throw new Error("Não foi possível obter os dados públicos do OpenStreetMap.");

const seen = new Set();
const points = response.elements
  .map((element) => {
    const tags = element.tags ?? {};
    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    if (!tags.name || latitude == null || longitude == null) return null;
    if (isPublicInstitution(tags)) return null;
    // Keeps the municipal commercial map focused on Foz do Iguaçu itself.
    if (latitude < -25.66 || latitude > -25.39 || longitude < -54.66 || longitude > -54.39) return null;
    const type = segment(tags);
    const key = `${tags.name}`.trim().toLocaleLowerCase("pt-BR");
    if (seen.has(key)) return null;
    seen.add(key);
    return {
      id: `osm-${element.type}-${element.id}`,
      name: tags.name.trim(),
      segment: type,
      address: address(tags),
      latitude: Number(latitude.toFixed(6)),
      longitude: Number(longitude.toFixed(6)),
      potential: potential(tags, type),
      status: "A visitar",
    };
  })
  .filter(Boolean)
  .sort((a, b) => a.segment.localeCompare(b.segment, "pt-BR") || a.name.localeCompare(b.name, "pt-BR"));

const file = `// Gerado a partir de dados públicos do OpenStreetMap em ${new Date().toISOString()}.\n// Atualize executando: node scripts/generate-foz-prospects.mjs\n\nexport const fozProspects = ${JSON.stringify(points, null, 2)} as const;\n`;
await writeFile(new URL("../data/foz-prospects.ts", import.meta.url), file, "utf8");
console.log(`${points.length} oportunidades geradas.`);
