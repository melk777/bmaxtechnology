"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";

const powers = [7, 22, 60, 80, 120];
const money = (value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function RangeField({ label, value, min, max, step, suffix, onChange }: { label: string; value: number; min: number; max: number; step: number; suffix: string; onChange: (value: number) => void }) {
  return <label className="range-field"><span><b>{label}</b><strong>{value.toLocaleString("pt-BR", { minimumFractionDigits: step < 1 ? 2 : 0, maximumFractionDigits: step < 1 ? 2 : 0 })} {suffix}</strong></span><input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

export default function FaturamentoPage() {
  const [power, setPower] = useState(60);
  const [hours, setHours] = useState(4);
  const [salePrice, setSalePrice] = useState(1.99);
  const [energyCost, setEnergyCost] = useState(0.85);
  const estimate = useMemo(() => {
    const energy = power * hours * 30;
    const revenue = energy * salePrice;
    const cost = energy * energyCost;
    return { energy, revenue, cost, margin: revenue - cost };
  }, [power, hours, salePrice, energyCost]);
  const whatsapp = `https://wa.me/5545988167775?text=${encodeURIComponent(`Olá, quero um estudo BMAX para uma operação de ${power} kW, com uso estimado de ${hours} horas por dia.`)}`;

  return <main className="calculator-page">
    <nav className="sim-nav dark-nav"><Link className="sim-brand" href="/"><Image src="/logo-bmax.png" alt="BMAX Technology" width={42} height={42} /><span>BMAX <b>Technology</b></span></Link><Link className="sim-back" href="/simuladores">← Simuladores</Link></nav>
    <header className="calculator-heading"><p className="eyebrow">SIMULADOR DE FATURAMENTO</p><h1>Visualize o potencial<br />da sua operação.</h1><p>Uma leitura simples para começar a planejar seu ponto de recarga.</p></header>
    <section className="calculator-layout">
      <aside className="calculator-inputs"><div className="input-title"><span>01</span><div><p>CONFIGURE O CENÁRIO</p><small>Altere os dados para atualizar a estimativa.</small></div></div>
        <div className="power-select"><b>Potência do carregador</b><div>{powers.map((item) => <button type="button" key={item} className={power === item ? "selected" : ""} onClick={() => setPower(item)}>{item}<small>kW</small></button>)}</div></div>
        <RangeField label="Uso médio por dia" value={hours} min={1} max={24} step={0.5} suffix="horas" onChange={setHours} />
        <RangeField label="Preço de venda" value={salePrice} min={0.5} max={5} step={0.05} suffix="R$/kWh" onChange={setSalePrice} />
        <RangeField label="Custo de energia" value={energyCost} min={0.2} max={3} step={0.05} suffix="R$/kWh" onChange={setEnergyCost} />
      </aside>
      <section className="calculator-result-panel revenue-result"><div className="result-top"><span>ESTIMATIVA MENSAL</span><i>ϟ</i></div><p>Margem bruta estimada</p><strong>{money(estimate.margin)}</strong><small>Antes de impostos, manutenção, demanda contratada, meios de pagamento e demais custos operacionais.</small><div className="result-stats"><div><span>Energia entregue</span><b>{estimate.energy.toLocaleString("pt-BR")} kWh</b></div><div><span>Faturamento bruto</span><b>{money(estimate.revenue)}</b></div><div><span>Custo de energia</span><b>{money(estimate.cost)}</b></div></div><a className="result-cta" href={whatsapp} target="_blank" rel="noreferrer">Quero um estudo para meu ponto <span>→</span></a></section>
    </section>
    <p className="calculator-disclaimer">Estimativa baseada em 30 dias de operação e uso contínuo durante as horas informadas. A viabilidade do projeto depende da tarifa local, demanda, infraestrutura elétrica, perfil de utilização e condições comerciais.</p>
  </main>;
}
