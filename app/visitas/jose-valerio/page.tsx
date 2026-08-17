"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Stop = {
  id: string;
  time: string;
  name: string;
  segment: string;
  address: string;
  latitude: number;
  longitude: number;
  objective: string;
};

const joseRoute: Stop[] = [
  { id: "formula", time: "09:00", name: "Auto Posto Fórmula Foz — Matriz", segment: "Posto", address: "Av. Jorge Schimmelpfeng, 891 — Centro", latitude: -25.5409, longitude: -54.5868, objective: "Apresentar recarga rápida para ampliar permanência e ticket médio." },
  { id: "uruçui", time: "09:40", name: "Posto Uruçuí — Grupo Viale", segment: "Posto", address: "Av. Jorge Schimmelpfeng, 440 — Centro", latitude: -25.547242, longitude: -54.583493, objective: "Entender demanda e oferecer projeto de eletroposto." },
  { id: "foz-hotel", time: "10:20", name: "Hotel Foz do Iguaçu", segment: "Hotel", address: "Av. Brasil, 97 — Centro", latitude: -25.5455, longitude: -54.5897, objective: "Oferecer diferenciação para hóspedes e viagens de longa distância." },
  { id: "rafain", time: "11:00", name: "Hotel Rafain Centro", segment: "Hotel", address: "Rua Marechal Deodoro, 984 — Centro", latitude: -25.5431, longitude: -54.5894, objective: "Avaliar ponto de instalação e potência adequada ao hotel." },
  { id: "italo", time: "11:35", name: "Ítalo Supermercados", segment: "Varejo", address: "Rua Edmundo de Barros, 303 — Centro", latitude: -25.5447, longitude: -54.5852, objective: "Propor recarga enquanto o cliente realiza compras." },
  { id: "plaza", time: "13:00", name: "Foz Plaza Hotel", segment: "Hotel", address: "Rua Marechal Deodoro, 1819 — Centro", latitude: -25.5358, longitude: -54.5825, objective: "Apresentar soluções AC e DC conforme tempo médio de estadia." },
  { id: "pietro", time: "13:45", name: "Hotel Pietro Angelo", segment: "Hotel", address: "Rua Almirante Barroso, 1864 — Centro", latitude: -25.5393, longitude: -54.5851, objective: "Conseguir contato de operações ou manutenção." },
  { id: "golden", time: "14:25", name: "Golden Park Internacional", segment: "Hotel", address: "Rua Almirante Barroso, 2006 — Centro", latitude: -25.5379, longitude: -54.5838, objective: "Apresentar oportunidade de melhoria da experiência do hóspede." },
  { id: "jl", time: "15:10", name: "Cataratas JL Shopping", segment: "Varejo", address: "Av. Costa e Silva, 185 — Centro", latitude: -25.53324, longitude: -54.574921, objective: "Solicitar reunião com operações, estacionamento ou facilities." },
  { id: "continental", time: "16:00", name: "Hotel Continental Inn", segment: "Hotel", address: "Av. Paraná, 1089 — Centro", latitude: -25.5377, longitude: -54.5855, objective: "Fechar o dia com proposta de diagnóstico técnico sem compromisso." },
];

const storageKey = "bmax-jose-valerio-visit-notes";

function mapsUrl(stop: Stop) {
  return `https://www.google.com/maps/dir/?api=1&destination=${stop.latitude},${stop.longitude}`;
}

function fullRouteUrl() {
  const origin = `${joseRoute[0].latitude},${joseRoute[0].longitude}`;
  const destination = joseRoute.at(-1)!;
  const waypoints = joseRoute.slice(1, -1).map((stop) => `${stop.latitude},${stop.longitude}`).join("|");
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination.latitude},${destination.longitude}&waypoints=${encodeURIComponent(waypoints)}`;
}

export default function JoseValerioVisitsPage() {
  const [selectedId, setSelectedId] = useState(joseRoute[0].id);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const selected = useMemo(() => joseRoute.find((stop) => stop.id === selectedId) ?? joseRoute[0], [selectedId]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) setNotes(JSON.parse(stored));
    } catch { /* Anotações continuam disponíveis durante a sessão se o navegador bloquear armazenamento. */ }
  }, []);

  function selectStop(id: string) {
    setSelectedId(id);
    setSaved(false);
  }

  function saveNotes() {
    try { window.localStorage.setItem(storageKey, JSON.stringify(notes)); } catch { /* Mantém o conteúdo na tela. */ }
    setSaved(true);
  }

  return (
    <main className="seller-page">
      <header className="visits-header seller-header">
        <Link href="/" className="visits-brand"><img src="/logo-bmax.png" alt="Bmaxbrasil" /><span>BMAX<span>BRASIL</span></span></Link>
        <div><Link href="/visitas">← Mapa geral</Link><Link href="/">Voltar ao site</Link></div>
      </header>

      <section className="seller-hero">
        <p>ROTA DO VENDEDOR</p>
        <h1>José Valério<br /><em>Centro de Foz do Iguaçu.</em></h1>
        <span>10 visitas próximas · 09:00 às 16:40 · foco em hotéis, postos e varejo</span>
        <a href={fullRouteUrl()} target="_blank" rel="noreferrer">Abrir rota completa no Google Maps <b>↗</b></a>
      </section>

      <section className="seller-workspace">
        <aside className="seller-stops" aria-label="Rota do José Valério">
          <div className="seller-stops-title"><span>ITINERÁRIO</span><strong>Segunda-feira</strong></div>
          <div className="seller-stops-scroll">
            {joseRoute.map((stop, index) => <button type="button" key={stop.id} onClick={() => selectStop(stop.id)} className={`seller-stop ${selected.id === stop.id ? "selected" : ""}`}>
              <time>{stop.time}</time><span><small>{String(index + 1).padStart(2, "0")} · {stop.segment}</small><strong>{stop.name}</strong><em>{stop.address}</em></span>
            </button>)}
          </div>
        </aside>

        <section className="seller-detail" aria-label="Detalhes da visita selecionada">
          <span>PRÓXIMA VISITA · {selected.time}</span>
          <h2>{selected.name}</h2>
          <p>{selected.address}</p>
          <div className="seller-objective"><small>OBJETIVO DA ABORDAGEM</small><strong>{selected.objective}</strong></div>
          <a href={mapsUrl(selected)} target="_blank" rel="noreferrer">Abrir este local no mapa <b>↗</b></a>
        </section>

        <aside className="seller-notes" aria-label="Anotações do José Valério">
          <span>REGISTRO DA VISITA</span>
          <h2>Anotações</h2>
          <p>Registre contato, interesse, próximo passo e data de retorno.</p>
          <textarea value={notes[selected.id] ?? ""} onChange={(event) => { setNotes((current) => ({ ...current, [selected.id]: event.target.value })); setSaved(false); }} placeholder="Ex.: falei com o gerente; pediu catálogo e retorno na quinta-feira." rows={11} />
          <button type="button" onClick={saveNotes}>{saved ? "Anotações salvas neste navegador ✓" : "Salvar anotações"}</button>
        </aside>
      </section>
    </main>
  );
}
