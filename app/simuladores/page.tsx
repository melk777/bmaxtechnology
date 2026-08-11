import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Simuladores | BMAX Technology",
  description: "Planeje a sua operação de recarga com os simuladores BMAX.",
};

export default function SimuladoresPage() {
  return (
    <main className="sim-page">
      <nav className="sim-nav">
        <Link className="sim-brand" href="/">
          <Image src="/logo-bmax.png" alt="BMAX Technology" width={42} height={42} />
          <span>BMAX <b>Technology</b></span>
        </Link>
        <Link className="sim-back" href="/">← Voltar ao site</Link>
      </nav>

      <section className="sim-home-hero">
        <p className="eyebrow">PLANEJAMENTO BMAX</p>
        <h1>Mais clareza para<br />a sua próxima decisão.</h1>
        <p>Escolha um simulador e transforme dados essenciais em uma estimativa clara para a sua recarga ou operação.</p>
      </section>

      <section className="sim-choice-grid" aria-label="Escolha um simulador">
        <Link className="sim-choice revenue-choice" href="/simuladores/faturamento">
          <div className="choice-icon chart-icon"><i /><i /><i /><i /></div>
          <p>PARA EMPRESAS E ELETROPOSTOS</p>
          <h2>Simulador de<br />faturamento</h2>
          <span>Estime o potencial mensal do seu ponto <b>→</b></span>
        </Link>
        <Link className="sim-choice charge-choice" href="/simuladores/recarga">
          <div className="choice-icon battery-icon"><i /><b>ϟ</b></div>
          <p>PARA O SEU VEÍCULO</p>
          <h2>Estimativa de<br />recarga</h2>
          <span>Veja energia e tempo estimados <b>→</b></span>
        </Link>
      </section>

      <section className="sim-home-note">
        <span>01</span>
        <p>As simulações são informativas. Para um projeto técnico, orçamento de equipamento e instalação, fale com a equipe BMAX.</p>
        <a href="https://wa.me/5545988167775?text=Olá%2C%20quero%20falar%20sobre%20um%20projeto%20BMAX." target="_blank" rel="noreferrer">Falar com a BMAX ↗</a>
      </section>
    </main>
  );
}
