"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";
import { fozProspects } from "@/data/foz-prospects";

type Point = {
  id: string;
  name: string;
  segment: string;
  address: string;
  latitude: number;
  longitude: number;
  potential: "Alta" | "Média";
  status: "A visitar" | "Em contato" | "Visitado";
  contact?: string;
};

declare global {
  interface Window { L?: any }
}

const priorityPoints: Point[] = [
  // Prioridades comerciais já trabalhadas pela Bmaxbrasil
  { id: "formula", name: "Auto Posto Fórmula Foz — Matriz", segment: "Posto", address: "Av. Jorge Schimmelpfeng, 891 — Centro", latitude: -25.5409, longitude: -54.5868, potential: "Alta", status: "A visitar" },
  { id: "foz", name: "Hotel Foz do Iguaçu", segment: "Hotel", address: "Av. Brasil, 97 — Centro", latitude: -25.5455, longitude: -54.5897, potential: "Alta", status: "A visitar", contact: "Reservas e operações" },
  { id: "continental", name: "Hotel Continental Inn", segment: "Hotel", address: "Av. Paraná, 1089 — Centro", latitude: -25.5377, longitude: -54.5855, potential: "Alta", status: "A visitar" },
  { id: "rafain", name: "Hotel Rafain Centro", segment: "Hotel", address: "Rua Marechal Deodoro, 984 — Centro", latitude: -25.5431, longitude: -54.5894, potential: "Alta", status: "A visitar" },
  { id: "plaza", name: "Foz Plaza Hotel", segment: "Hotel", address: "Rua Marechal Deodoro, 1819 — Centro", latitude: -25.5358, longitude: -54.5825, potential: "Média", status: "A visitar" },
  { id: "pietro", name: "Hotel Pietro Angelo", segment: "Hotel", address: "Rua Almirante Barroso, 1864 — Centro", latitude: -25.5393, longitude: -54.5851, potential: "Alta", status: "A visitar" },
  { id: "golden", name: "Golden Park Internacional", segment: "Hotel", address: "Rua Almirante Barroso, 2006 — Centro", latitude: -25.5379, longitude: -54.5838, potential: "Alta", status: "A visitar" },
  { id: "italo", name: "Italo Supermercados", segment: "Varejo", address: "Rua Edmundo de Barros, 303 — Centro", latitude: -25.5447, longitude: -54.5852, potential: "Média", status: "A visitar" },
  { id: "bismillah", name: "Estacionamentos Bismillah", segment: "Estacionamento", address: "Rua Oswaldo Cruz, 368 — Vila Portes", latitude: -25.5128, longitude: -54.5901, potential: "Alta", status: "Em contato", contact: "Arif" },
  { id: "wish", name: "Wish Foz do Iguaçu", segment: "Hotel", address: "Av. das Cataratas, 6845 — Tamanduá", latitude: -25.5871, longitude: -54.4928, potential: "Alta", status: "Em contato", contact: "Gerência / infraestrutura" },
  // Hotelaria e resorts: hóspedes permanecem mais tempo e valorizam recarga no destino.
  { id: "rafain-palace", name: "Hotel Rafain Palace", segment: "Hotel", address: "Av. Olímpio Rafagnin, 2357 — Parque Imperatriz", latitude: -25.501368, longitude: -54.538477, potential: "Alta", status: "A visitar" },
  { id: "recanto-cataratas", name: "Recanto Cataratas Thermas Resort", segment: "Hotel", address: "Rua Sérgio Gasparetto, 510 — Vila Yolanda", latitude: -25.511904, longitude: -54.548152, potential: "Alta", status: "A visitar" },
  { id: "grand-carima", name: "Grand Carimã Resort & Convention Center", segment: "Hotel", address: "Av. das Cataratas, 4790 — Vila Carimã", latitude: -25.576872, longitude: -54.548824, potential: "Alta", status: "A visitar" },
  { id: "vivaz", name: "Vivaz Cataratas Hotel Resort", segment: "Hotel", address: "Av. das Cataratas — Foz do Iguaçu", latitude: -25.582388, longitude: -54.52904, potential: "Alta", status: "A visitar" },
  { id: "san-martin", name: "San Martin Hotel", segment: "Hotel", address: "Rodovia das Cataratas — Foz do Iguaçu", latitude: -25.613607, longitude: -54.48491, potential: "Alta", status: "A visitar" },
  { id: "nacional-inn", name: "Hotel Nacional Inn", segment: "Hotel", address: "Av. das Cataratas, 8355 — Jardim Gleba II", latitude: -25.590784, longitude: -54.515901, potential: "Alta", status: "A visitar" },
  { id: "san-juan", name: "Hotel San Juan", segment: "Hotel", address: "Av. das Cataratas — Foz do Iguaçu", latitude: -25.590071, longitude: -54.516653, potential: "Alta", status: "A visitar" },
  { id: "viale-cataratas", name: "Hotel Viale Cataratas", segment: "Hotel", address: "Av. das Cataratas — Foz do Iguaçu", latitude: -25.561469, longitude: -54.56187, potential: "Alta", status: "A visitar" },
  { id: "bourbon", name: "Bourbon Foz do Iguaçu Hotel", segment: "Hotel", address: "Av. Costa e Silva — Centro", latitude: -25.533676, longitude: -54.574647, potential: "Alta", status: "A visitar" },
  { id: "falls-galli", name: "Hotel Falls Galli", segment: "Hotel", address: "Foz do Iguaçu, PR", latitude: -25.524897, longitude: -54.564248, potential: "Média", status: "A visitar" },
  { id: "dom-pedro", name: "Dom Pedro I Palace Hotel", segment: "Hotel", address: "Foz do Iguaçu, PR", latitude: -25.562159, longitude: -54.559266, potential: "Média", status: "A visitar" },
  { id: "iguacu-plaza", name: "Iguaçu Plaza Hotel", segment: "Hotel", address: "Rua Bartolomeu de Gusmão, 859 — Centro", latitude: -25.539473, longitude: -54.583791, potential: "Média", status: "A visitar" },
  { id: "rouver", name: "Hotel Rouver", segment: "Hotel", address: "Av. Jorge Schimmelpfeng, 872 — Centro", latitude: -25.547169, longitude: -54.578981, potential: "Média", status: "A visitar" },
  { id: "san-rafael", name: "San Rafael Hotel", segment: "Hotel", address: "Rua Almirante Barroso, 1660 — Centro", latitude: -25.540677, longitude: -54.584462, potential: "Média", status: "A visitar" },
  { id: "vivaldi", name: "Rede Andrade — Vivaldi Hotel", segment: "Hotel", address: "Rua Sérgio Gasparetto, 934 — Portal da Foz", latitude: -25.503803, longitude: -54.539689, potential: "Média", status: "A visitar" },
  { id: "stella-solaris", name: "Hotel Stella Solaris Samba", segment: "Hotel", address: "Av. Olímpio Rafagnin — Parque Imperatriz", latitude: -25.50969, longitude: -54.548948, potential: "Média", status: "A visitar" },
  { id: "foz-ponte", name: "Hotel Foz Ponte", segment: "Hotel", address: "Vila Portes — Foz do Iguaçu", latitude: -25.513021, longitude: -54.59065, potential: "Média", status: "A visitar" },
  { id: "paradizzo", name: "Hotel Paradizzo", segment: "Hotel", address: "Rua Cassiano Ricardo, 575 — Vila Portes", latitude: -25.512315, longitude: -54.592296, potential: "Média", status: "A visitar" },
  { id: "mirante", name: "Mirante Hotel", segment: "Hotel", address: "Av. República Argentina, 672 — Centro", latitude: -25.534176, longitude: -54.587658, potential: "Média", status: "A visitar" },
  { id: "lawrence", name: "Hotel Lawrence", segment: "Hotel", address: "Av. Paraná, 463 — Vila Maracanã", latitude: -25.544108, longitude: -54.576609, potential: "Média", status: "A visitar" },
  { id: "kacique", name: "Kacique Salvatti Hotel", segment: "Hotel", address: "Centro — Foz do Iguaçu", latitude: -25.531193, longitude: -54.589404, potential: "Média", status: "A visitar" },
  { id: "danny", name: "Danny Hotel", segment: "Hotel", address: "Av. Brasil, 509 — Centro", latitude: -25.538611, longitude: -54.585832, potential: "Média", status: "A visitar" },
  // Varejo e centros de compras: estadia média e grande fluxo diário.
  { id: "jl-shopping", name: "Cataratas JL Shopping", segment: "Varejo", address: "Av. Costa e Silva, 185 — Centro", latitude: -25.53324, longitude: -54.574921, potential: "Alta", status: "Em contato" },
  { id: "catuai", name: "Shopping Catuaí Palladium", segment: "Varejo", address: "Av. das Cataratas, 3570 — Vila Yolanda", latitude: -25.568943, longitude: -54.55835, potential: "Alta", status: "A visitar" },
  { id: "muffato-jl", name: "Super Muffato — Cataratas JL Shopping", segment: "Varejo", address: "Av. Costa e Silva, 185 — Centro", latitude: -25.53324, longitude: -54.574921, potential: "Alta", status: "A visitar" },
  { id: "muffato-republica", name: "Muffato — República Argentina", segment: "Varejo", address: "Av. República Argentina — Foz do Iguaçu", latitude: -25.536978, longitude: -54.543105, potential: "Alta", status: "A visitar" },
  { id: "atacadao", name: "Atacadão Foz do Iguaçu", segment: "Varejo", address: "Rua Nelson da Cunha Júnior, 350 — Vila Pérola", latitude: -25.510961, longitude: -54.577512, potential: "Alta", status: "A visitar" },
  { id: "italo-republica", name: "Ítalo Supermercados — República Argentina", segment: "Varejo", address: "Av. República Argentina — Foz do Iguaçu", latitude: -25.536054, longitude: -54.558247, potential: "Alta", status: "A visitar" },
  { id: "muffato-norte", name: "Muffato Supermercado", segment: "Varejo", address: "Região Norte — Foz do Iguaçu", latitude: -25.494275, longitude: -54.553695, potential: "Média", status: "A visitar" },
  { id: "santa-ines", name: "Supermercado Santa Inês", segment: "Varejo", address: "Foz do Iguaçu, PR", latitude: -25.493234, longitude: -54.54499, potential: "Média", status: "A visitar" },
  { id: "kasi-petropolis", name: "Kasi Supermercado — Jardim Petrópolis", segment: "Varejo", address: "Rua Belo Horizonte, 703 — Jardim Petrópolis", latitude: -25.488897, longitude: -54.578434, potential: "Média", status: "A visitar" },
  { id: "kasi-belvedere", name: "Supermercado Kasi — Belvedere", segment: "Varejo", address: "Rua Guaraqueçaba, 409 — Jardim Belvedere", latitude: -25.476656, longitude: -54.579366, potential: "Média", status: "A visitar" },
  { id: "nandi", name: "Supermercado Nandi", segment: "Varejo", address: "Foz do Iguaçu, PR", latitude: -25.481772, longitude: -54.50836, potential: "Média", status: "A visitar" },
  { id: "shopping-mercosul", name: "Shopping Mercosul", segment: "Varejo", address: "Rua Rui Barbosa, 1032 — Centro", latitude: -25.53862, longitude: -54.582435, potential: "Média", status: "A visitar" },
  // Postos: oportunidade para recarga rápida e aumento de permanência do cliente.
  { id: "posto-uruqui", name: "Posto Uruçuí — Grupo Viale", segment: "Posto", address: "Av. Jorge Schimmelpfeng, 440 — Centro", latitude: -25.547242, longitude: -54.583493, potential: "Alta", status: "A visitar" },
  { id: "posto-boneti", name: "Posto Boneti", segment: "Posto", address: "Av. das Cataratas, 894 — Vila Yolanda", latitude: -25.552512, longitude: -54.570681, potential: "Alta", status: "A visitar" },
  { id: "posto-acaray", name: "Posto Acaray", segment: "Posto", address: "Foz do Iguaçu, PR", latitude: -25.490829, longitude: -54.509201, potential: "Alta", status: "A visitar" },
  { id: "posto-prisma", name: "Posto Prisma", segment: "Posto", address: "Vila Portes — Foz do Iguaçu", latitude: -25.508539, longitude: -54.585052, potential: "Alta", status: "A visitar" },
  { id: "posto-gasparin", name: "Posto Gasparin", segment: "Posto", address: "Av. Nilson Gottlieb — Foz do Iguaçu", latitude: -25.486583, longitude: -54.503099, potential: "Média", status: "A visitar" },
  { id: "posto-rota-vila", name: "Auto Posto Shell — Rota Vila", segment: "Posto", address: "Av. Gramado, 2145 — Foz do Iguaçu", latitude: -25.497827, longitude: -54.552921, potential: "Alta", status: "A visitar" },
  { id: "posto-azteca", name: "Posto Azteca", segment: "Posto", address: "Av. República Argentina — Foz do Iguaçu", latitude: -25.534498, longitude: -54.579769, potential: "Média", status: "A visitar" },
  { id: "posto-ibiza", name: "Posto Ibiza", segment: "Posto", address: "Av. República Argentina — Foz do Iguaçu", latitude: -25.534359, longitude: -54.582605, potential: "Média", status: "A visitar" },
  { id: "maxsul", name: "Posto Maxsul", segment: "Posto", address: "Vila Portes — Foz do Iguaçu", latitude: -25.513497, longitude: -54.588443, potential: "Média", status: "A visitar" },
  // Estacionamentos e atrações: fluxo turístico e permanência relevante.
  { id: "aeroporto", name: "Estacionamento Aeroporto Internacional de Foz do Iguaçu", segment: "Estacionamento", address: "Av. das Cataratas — Aeroporto IGU", latitude: -25.598927, longitude: -54.488233, potential: "Alta", status: "Em contato", contact: "Operação / infraestrutura" },
  { id: "terra-cataratas", name: "Estacionamento Terra das Cataratas", segment: "Estacionamento", address: "Vila Portes — Foz do Iguaçu", latitude: -25.505585, longitude: -54.588174, potential: "Alta", status: "A visitar" },
  { id: "aduana", name: "Estacionamento Aduana Brasileira", segment: "Estacionamento", address: "Ponte Internacional da Amizade — Foz do Iguaçu", latitude: -25.510015, longitude: -54.597302, potential: "Alta", status: "A visitar" },
  { id: "dreamland", name: "Dreamland Foz do Iguaçu", segment: "Atração", address: "Rodovia das Cataratas, 8100 — Foz do Iguaçu", latitude: -25.592421, longitude: -54.517004, potential: "Alta", status: "A visitar" },
  { id: "super-carros", name: "Super Carros — Dreamland", segment: "Atração", address: "Rodovia das Cataratas — Foz do Iguaçu", latitude: -25.591908, longitude: -54.516741, potential: "Alta", status: "A visitar" },
  { id: "cataratas-show", name: "Cataratas Parque Show", segment: "Atração", address: "Rodovia das Cataratas — Foz do Iguaçu", latitude: -25.590784, longitude: -54.51761, potential: "Alta", status: "A visitar" },
  { id: "itaipu", name: "Centro de Recepção de Visitantes — Itaipu", segment: "Atração", address: "Av. Tancredo Neves, 6702 — Foz do Iguaçu", latitude: -25.447072, longitude: -54.583882, potential: "Alta", status: "A visitar" },
  { id: "skydive", name: "SkydiveFoz", segment: "Atração", address: "Foz do Iguaçu, PR", latitude: -25.46072, longitude: -54.596565, potential: "Média", status: "A visitar" },
  { id: "bosque-guarani", name: "Parque Zoológico Bosque Guarani", segment: "Atração", address: "Centro — Foz do Iguaçu", latitude: -25.533091, longitude: -54.589887, potential: "Média", status: "A visitar" },
];

const municipalQuery = `[out:json][timeout:120];
area["name"="Foz do Iguaçu"]["boundary"="administrative"]->.city;
(
  nwr["tourism"~"hotel|resort|motel|guest_house|hostel|attraction|theme_park|zoo|museum"](area.city);
  nwr["amenity"~"fuel|parking|hospital|clinic|college|university|school"](area.city);
  nwr["shop"~"mall|supermarket|department_store|car|car_repair|motorcycle|wholesale"](area.city);
  nwr["leisure"~"stadium|sports_centre"](area.city);
  nwr["aeroway"="aerodrome"](area.city);
);
out center tags;`;

function normalizedName(name: string) { return name.trim().toLocaleLowerCase("pt-BR"); }

// Órgãos e equipamentos públicos não entram na rota de venda direta.
// Eles exigem acompanhamento de compras públicas, edital ou processo próprio.
const publicInstitutionPattern = /\b(upa|unidade de pronto atendimento|unidade básica de saúde|ubs|hospital municipal|escola municipal|colégio estadual|universidade federal|instituto federal|unila|prefeitura|câmara municipal|secretaria municipal|receita federal|aduana|pol[ií]cia|delegacia|corpo de bombeiros|f[oó]rum|defensoria|minist[eé]rio p[uú]blico|parque zool[oó]gico bosque guarani|centro de recep[cç][aã]o de visitantes.*itaipu|ecomuseu de itaipu)\b/i;

function isDirectSalesLead(point: Point) {
  return !publicInstitutionPattern.test(`${point.name} ${point.address}`);
}

function mapSegment(tags: Record<string, string>) {
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

function toMunicipalPoints(elements: any[]): Point[] {
  const seen = new Set<string>();
  return elements.flatMap((element) => {
    const tags = (element.tags ?? {}) as Record<string, string>;
    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    if (!tags.name || latitude == null || longitude == null) return [];
    // Evita resultados turísticos externos à malha urbana/comercial de Foz.
    if (latitude < -25.66 || latitude > -25.39 || longitude < -54.66 || longitude > -54.39) return [];
    const key = normalizedName(tags.name);
    if (seen.has(key)) return [];
    seen.add(key);
    const segment = mapSegment(tags);
    const street = [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(", ");
    return [{
      id: `osm-${element.type}-${element.id}`,
      name: tags.name,
      segment,
      address: street ? `${street} — Foz do Iguaçu, PR` : "Foz do Iguaçu, PR",
      latitude: Number(latitude),
      longitude: Number(longitude),
      potential: ["Hotel", "Posto", "Estacionamento", "Transporte"].includes(segment) || tags.shop === "mall" || tags.tourism === "theme_park" ? "Alta" : "Média",
      status: "A visitar",
    }];
  });
}

export default function VisitasPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<any>(null);
  const markerLayer = useRef<any>(null);
  const [leafletReady, setLeafletReady] = useState(false);
  const [clusterReady, setClusterReady] = useState(false);
  const [municipalPoints, setMunicipalPoints] = useState<Point[]>([...fozProspects]);
  const [municipalState, setMunicipalState] = useState<"loading" | "ready" | "fallback">("loading");
  const [filter, setFilter] = useState("Todos");
  const [selectedId, setSelectedId] = useState("formula");
  const [visitStatus, setVisitStatus] = useState("A visitar");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const points = useMemo(() => {
    const priorityNames = new Set(priorityPoints.map((point) => normalizedName(point.name)));
    return [
      ...priorityPoints.filter(isDirectSalesLead),
      ...municipalPoints.filter((point) => isDirectSalesLead(point) && !priorityNames.has(normalizedName(point.name))),
    ];
  }, [municipalPoints]);
  const filters = useMemo(() => ["Todos", ...Array.from(new Set(points.map((point) => point.segment))).sort((a, b) => a.localeCompare(b, "pt-BR"))], [points]);
  const selected = points.find((point) => point.id === selectedId) ?? points[0];
  const visible = useMemo(() => filter === "Todos" ? points : points.filter((point) => point.segment === filter), [filter, points]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadMunicipalBase() {
      const endpoints = ["https://overpass.kumi.systems/api/interpreter", "https://overpass-api.de/api/interpreter"];
      try {
        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
              body: new URLSearchParams({ data: municipalQuery }),
              signal: controller.signal,
            });
            if (!response.ok) continue;
            const data = await response.json();
            const imported = toMunicipalPoints(data.elements ?? []);
            if (imported.length) setMunicipalPoints(imported);
            setMunicipalState("ready");
            return;
          } catch (error) {
            if ((error as Error).name === "AbortError") return;
          }
        }
        setMunicipalState("fallback");
      } catch { setMunicipalState("fallback"); }
    }
    loadMunicipalBase();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current || !window.L || leafletMap.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { zoomControl: false, scrollWheelZoom: true }).setView([-25.542, -54.584], 13);
    L.control.zoom({ position: "bottomright" }).addTo(map);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
    }).addTo(map);
    leafletMap.current = map;
    return () => { map.remove(); leafletMap.current = null; };
  }, [leafletReady]);

  useEffect(() => {
    if (!leafletMap.current || !window.L) return;
    const L = window.L;
    markerLayer.current?.remove();
    const layer = clusterReady && typeof L.markerClusterGroup === "function"
      ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 48, spiderfyOnMaxZoom: true })
      : L.layerGroup();
    visible.forEach((point) => {
      const marker = L.marker([point.latitude, point.longitude], {
        icon: L.divIcon({
          className: "",
          html: `<i style="display:block;width:18px;height:18px;border:3px solid #fff;border-radius:50%;background:${point.potential === "Alta" ? "#e1262e" : "#1496d4"};box-shadow:${point.id === selectedId ? "0 0 0 5px #e1262e32,0 2px 9px #08233366" : "0 2px 9px #08233366"};transform:${point.id === selectedId ? "scale(1.35)" : "scale(1)"}"></i>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        }),
      });
      marker.bindTooltip(`<strong>${point.name}</strong><br/>${point.segment}`, { direction: "top", offset: [0, -9] });
      marker.bindPopup(`<strong>${point.name}</strong><br/><span>${point.segment} · potencial ${point.potential.toLowerCase()}</span><br/><small>${point.address}</small>`);
      marker.on("click", () => { setSelectedId(point.id); setSaved(false); });
      layer.addLayer(marker);
    });
    layer.addTo(leafletMap.current);
    markerLayer.current = layer;
  }, [visible, selectedId, clusterReady]);

  useEffect(() => {
    // A lista funciona como um painel de controle: ao escolher uma empresa,
    // o mapa posiciona o ponto imediatamente, sem deslocar a página inteira.
    if (leafletMap.current) leafletMap.current.setView([selected.latitude, selected.longitude], 16, { animate: false });
    setVisitStatus(selected.status);
    setNote("");
    setSaved(false);
  }, [selected, leafletReady]);

  function selectPoint(id: string) { setSelectedId(id); }
  function directionsUrl(point: Point) { return `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`; }
  function saveVisit() { setSaved(true); }

  return (
    <main className="visits-page">
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" onLoad={() => setLeafletReady(true)} />
      <Script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" strategy="afterInteractive" onLoad={() => setClusterReady(true)} />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" />
      <header className="visits-header">
        <Link href="/" className="visits-brand"><img src="/logo-bmax.png" alt="Bmaxbrasil" /><span>BMAX<span>BRASIL</span></span></Link>
        <div><span className="header-live"><i /> OPERAÇÃO COMERCIAL</span><Link href="/">← Voltar ao site</Link></div>
      </header>

      <section className="visits-hero">
        <p>PLANEJAMENTO DE CAMPO</p>
        <h1>Visitas que viram<br /><em>novos pontos de recarga.</em></h1>
        <span>Foz do Iguaçu, PR · <b>{points.length} oportunidades mapeadas</b> · {municipalState === "loading" ? "atualizando base municipal…" : municipalState === "ready" ? "base municipal atualizada" : "base comercial disponível"}</span>
      </section>

      <section className="visits-workspace">
        <aside className="visit-list" aria-label="Lista de oportunidades">
          <div className="visit-list-top"><div><span>ROTA COMERCIAL</span><strong>{visible.length} locais</strong></div><button type="button" onClick={() => { setFilter("Todos"); setSelectedId("formula"); }}>Redefinir</button></div>
          <div className="visit-filters">{filters.map((item) => <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>
          <div className="visit-cards">{visible.map((point, index) => <button key={point.id} className={`visit-card ${selectedId === point.id ? "selected" : ""}`} type="button" onClick={() => selectPoint(point.id)}><span className={`pin-dot ${point.potential === "Alta" ? "hot" : ""}`}>{String(index + 1).padStart(2, "0")}</span><span><small>{point.segment} · potencial {point.potential.toLowerCase()}</small><strong>{point.name}</strong><em>{point.address}</em></span></button>)}</div>
        </aside>

        <div className="map-panel"><div ref={mapRef} className="real-map" aria-label="Mapa de Foz do Iguaçu com oportunidades comerciais" /><div className="map-legend"><span><i className="hot-dot" /> Alto potencial</span><span><i /> Potencial médio</span></div></div>

        <aside className="visit-detail" aria-label="Registro da visita">
          <div className="detail-top"><span>OPORTUNIDADE SELECIONADA</span><b>#{String(points.findIndex((point) => point.id === selected.id) + 1).padStart(2, "0")}</b></div>
          <div className="detail-title"><p>{selected.segment} · Potencial {selected.potential}</p><h2>{selected.name}</h2><span>{selected.address}</span>{selected.contact && <small>Contato: {selected.contact}</small>}</div>
          <a className="route-button" href={directionsUrl(selected)} target="_blank" rel="noreferrer">Abrir rota no Google Maps <span>↗</span></a>
          <div className="visit-log"><label>Status da visita<select value={visitStatus} onChange={(event) => { setVisitStatus(event.target.value); setSaved(false); }}><option>A visitar</option><option>Em contato</option><option>Visitado</option><option>Proposta enviada</option><option>Sem interesse</option></select></label><label>O que aconteceu nesta visita?<textarea value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} placeholder="Ex.: falei com o gerente, solicitou catálogo e retorno na próxima semana." rows={6} /></label><button type="button" className="save-visit" onClick={saveVisit}>{saved ? "Registro salvo nesta sessão ✓" : "Registrar visita"}</button><p className="data-note">Na versão compartilhada, os registros ficam visíveis para toda a equipe Bmax.</p></div>
        </aside>
      </section>
      <section className="visits-footer"><p>Mapa base © OpenStreetMap contributors. Dados comerciais devem ser confirmados antes de cada abordagem.</p><a href="https://wa.me/554598437229?text=Olá%2C%20quero%20organizar%20uma%20visita%20comercial." target="_blank" rel="noreferrer">Falar com a Bmaxbrasil ↗</a></section>
    </main>
  );
}
