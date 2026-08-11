"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { vehicles } from "./vehicles";

const powers = [60, 80, 120];

function RangeField({ label, value, min, max, suffix, onChange }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="range-field"><span><b>{label}</b><strong>{value} {suffix}</strong></span><input type="range" value={value} min={min} max={max} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

function formatDuration(value: number) {
  const minutes = Math.max(0, Math.round(value * 60));
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60 ? `${minutes % 60}min` : ""}`;
}

export default function RecargaPage() {
  const [power, setPower] = useState(60);
  const [brand, setBrand] = useState("BYD");
  const [model, setModel] = useState("Dolphin Mini");
  const initial = 20;
  const final = 70;
  const brands = Array.from(new Set(vehicles.map((vehicle) => vehicle.brand)));
  const models = vehicles.filter((vehicle) => vehicle.brand === brand);
  const vehicle = models.find((item) => item.model === model) ?? models[0];
  const estimate = useMemo(() => {
    const percentage = Math.max(0, final - initial);
    const energy = vehicle.batteryKwh * percentage / 100;
    const effectivePower = Math.min(power, power <= 22 ? vehicle.acMaxKw ?? power : vehicle.dcMaxKw ?? power);
    return { energy, duration: energy / Math.max(1, effectivePower * .9), percentage, effectivePower };
  }, [final, initial, power, vehicle]);
  const whatsapp = `https://wa.me/5545988167775?text=${encodeURIComponent(`Olá, quero saber qual carregador BMAX é mais indicado para ${vehicle.brand} ${vehicle.model}.`)}`;

  return <main className="calculator-page charge-page">
    <nav className="sim-nav dark-nav"><Link className="sim-brand" href="/"><Image src="/logo-bmax.png" alt="BMAX Technology" width={42} height={42} /><span>BMAX <b>Technology</b></span></Link><Link className="sim-back" href="/simuladores">← Simuladores</Link></nav>
    <header className="calculator-heading"><p className="eyebrow">ESTIMATIVA DE RECARGA</p><h1>Entenda o tempo<br />da sua recarga.</h1><p>Escolha a marca, o modelo e a potência do carregador para estimar uma recarga rápida DC de 20% a 70%.</p></header>
    <section className="calculator-layout">
      <aside className="calculator-inputs"><div className="input-title"><span>02</span><div><p>CONFIGURE O VEÍCULO</p><small>Dados de bateria e limites de recarga por modelo.</small></div></div>
        <label className="vehicle-select"><b>Marca</b><select value={brand} onChange={(event) => { const nextBrand = event.target.value; setBrand(nextBrand); setModel(vehicles.find((item) => item.brand === nextBrand)?.model ?? ""); }}>{brands.map((item) => <option key={item}>{item}</option>)}</select></label>
        <label className="vehicle-select"><b>Modelo / versão</b><select value={model} onChange={(event) => setModel(event.target.value)}>{models.map((item) => <option key={item.model}>{item.model}</option>)}</select></label>
        <div className="power-select"><b>Potência do carregador rápido DC</b><div>{powers.map((item) => <button type="button" key={item} className={power === item ? "selected" : ""} onClick={() => setPower(item)}>{item}<small>kW</small></button>)}</div></div>
      </aside>
      <section className="calculator-result-panel charge-result"><div className="result-top"><span>ESTIMATIVA DE RECARGA</span><i>ϟ</i></div><div className="charge-ring"><span>{initial}%</span><b>→</b><strong>{final}%</strong></div><p>Tempo estimado</p><strong>{formatDuration(estimate.duration)}</strong><small>Base: {vehicle.batteryKwh.toLocaleString("pt-BR")} kWh. Potência considerada: até {estimate.effectivePower.toLocaleString("pt-BR")} kW.</small><div className="result-stats"><div><span>Energia estimada</span><b>{estimate.energy.toLocaleString("pt-BR", { maximumFractionDigits: 1 })} kWh</b></div><div><span>Intervalo de carga</span><b>{estimate.percentage}% da bateria</b></div><div><span>Fonte técnica</span><b><a href={vehicle.source} target="_blank" rel="noreferrer">Fabricante ↗</a></b></div></div><a className="result-cta" href={whatsapp} target="_blank" rel="noreferrer">Realizar um orçamento <span>→</span></a></section>
    </section>
    <p className="calculator-disclaimer">Resultado informativo. A velocidade de recarga pode reduzir em níveis altos de bateria e depende da aceitação máxima do veículo, conector, rede elétrica e condições de uso.</p>
  </main>;
}
