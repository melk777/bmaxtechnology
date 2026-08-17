"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useRef, useState } from "react";

type Point = {
  id: string;
  name: string;
  segment: "Hotel" | "Posto" | "Varejo" | "Estacionamento";
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

const points: Point[] = [
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
];

const filters = ["Todos", "Hotel", "Posto", "Varejo", "Estacionamento"] as const;

export default function VisitasPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const [leafletReady, setLeafletReady] = useState(false);
  const [filter, setFilter] = useState<(typeof filters)[number]>("Todos");
  const [selectedId, setSelectedId] = useState("formula");
  const [visitStatus, setVisitStatus] = useState("A visitar");
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const selected = points.find((point) => point.id === selectedId) ?? points[0];
  const visible = useMemo(() => filter === "Todos" ? points : points.filter((point) => point.segment === filter), [filter]);

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
    markers.current.forEach((marker) => marker.remove());
    markers.current = visible.map((point) => {
      const marker = L.circleMarker([point.latitude, point.longitude], {
        radius: point.id === selectedId ? 12 : 9,
        color: "#ffffff",
        weight: 2,
        fillColor: point.potential === "Alta" ? "#e1262e" : "#1496d4",
        fillOpacity: 1,
      }).addTo(leafletMap.current);
      marker.bindTooltip(`<strong>${point.name}</strong><br/>${point.segment}`, { direction: "top", offset: [0, -9] });
      marker.on("click", () => { setSelectedId(point.id); setSaved(false); });
      return marker;
    });
  }, [visible, selectedId]);

  useEffect(() => {
    if (leafletMap.current) leafletMap.current.flyTo([selected.latitude, selected.longitude], 15, { duration: 0.6 });
    setVisitStatus(selected.status);
    setNote("");
    setSaved(false);
  }, [selected]);

  function selectPoint(id: string) { setSelectedId(id); }
  function directionsUrl(point: Point) { return `https://www.google.com/maps/dir/?api=1&destination=${point.latitude},${point.longitude}`; }
  function saveVisit() { setSaved(true); }

  return (
    <main className="visits-page">
      <Script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" strategy="afterInteractive" onLoad={() => setLeafletReady(true)} />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <header className="visits-header">
        <Link href="/" className="visits-brand"><img src="/logo-bmax.png" alt="Bmaxbrasil" /><span>BMAX<span>BRASIL</span></span></Link>
        <div><span className="header-live"><i /> OPERAÇÃO COMERCIAL</span><Link href="/">← Voltar ao site</Link></div>
      </header>

      <section className="visits-hero">
        <p>PLANEJAMENTO DE CAMPO</p>
        <h1>Visitas que viram<br /><em>novos pontos de recarga.</em></h1>
        <span>Foz do Iguaçu, PR · <b>{points.length} oportunidades mapeadas</b></span>
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
