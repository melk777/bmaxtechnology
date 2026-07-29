"use client";

import { useEffect, useState } from "react";

const whatsapp = "https://wa.me/554598437229?text=Ol%C3%A1%2C%20quero%20um%20or%C3%A7amento%20para%20um%20carregador%20Bmax.";

const scenes = [
  { id: "resort", number: "01", eyebrow: "HOTÉIS E RESORTS", title: "Carregadores elétricos para todos os ambientes.", body: "Transforme seu estacionamento em uma experiência premium para hóspedes e visitantes.", product: "CDZ-T", power: "Recarga rápida DC · 60 kW ou 80 kW", image: "/products/cdz-t.png", className: "resort" },
  { id: "home", number: "02", eyebrow: "RECARGA EM CASA", title: "Recarregador residencial de alta potência.", body: "A solução compacta para recarregar com conforto, segurança e controle na sua própria vaga.", product: "CDZ-E", power: "Wallbox AC · 7 kW ou 22 kW", image: "/products/cdz-e.png", className: "home" },
  { id: "station", number: "03", eyebrow: "ELETROPOSTOS", title: "Seu posto merece ter o melhor carregador elétrico.", body: "Instale recarga rápida no seu posto e crie uma nova parada para quem está em movimento.", product: "CDZ-WY", power: "Recarga rápida DC · até 120 kW", image: "/products/cdz-wy.png", className: "station" },
  { id: "scale", number: "04", eyebrow: "ALTA POTÊNCIA", title: "Solicite o nosso catálogo.", body: "Projetos robustos para alto fluxo, com equipamentos, instalação e suporte comercial no Sul do Brasil.", product: "CDZ-YE", power: "Recarga rápida DC · até 120 kW", image: "/products/cdz-ye.png", className: "scale" },
];

const products = [
  ["CDZ-E", "Residencial", "7 kW ou 22 kW", "/products/cdz-e.png"],
  ["CDZ-B", "Comercial AC", "Até 44 kW", "/products/cdz-b.png"],
  ["CDZ-T", "Recarga rápida", "60 kW ou 80 kW", "/products/cdz-t.png"],
  ["CDZ-WY", "Alta demanda", "60 kW, 80 kW ou 120 kW", "/products/cdz-wy.png"],
  ["CDZ-YE", "Alta demanda", "60 kW, 80 kW ou 120 kW", "/products/cdz-ye.png"],
];

export default function Home() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const updateActive = () => { const sections = document.querySelectorAll<HTMLElement>("[data-scene]"); const center = window.innerHeight * .52; let next = 0; sections.forEach((section, index) => { const rect = section.getBoundingClientRect(); if (rect.top <= center && rect.bottom >= center) next = index; }); setActive(next); };
    updateActive(); window.addEventListener("scroll", updateActive, { passive: true }); return () => window.removeEventListener("scroll", updateActive);
  }, []);
  const current = scenes[active];
  return <main>
    <nav className="topbar"><a className="brand" href="#inicio"><img src="/logo-bmax.png" alt="Bmax Technology" /><span>Bmax <b>Technology</b></span></a><div className="toplinks"><a href="#catalogo">Catálogo</a><a href="#projeto">Para empresas</a><a href={whatsapp} target="_blank">WhatsApp ↗</a></div></nav>
    <section className="world" id="inicio"><div className={`world-stage stage-${current.className}`}><div className="resort-photo" /><div className="world-grid" /><div className="ambient-orb orb-one" /><div className="ambient-orb orb-two" /><div className="scene-city" /><img className={`scene-product product-${current.className}`} src={current.image} alt={`Carregador Bmax ${current.product}`} /><div className="charge-pulse" /><div className="stage-scrim" /><div className="stage-copy"><h1>{current.title}</h1><p>{current.body}</p><div className="scene-meta"><b>{current.product}</b><span>{current.power}</span></div>{active === 3 ? <a className="button" href={whatsapp} target="_blank">Falar sobre meu projeto <span>→</span></a> : <a className="button" href="#catalogo">Conhecer soluções <span>↓</span></a>}</div><div className="stage-number"><span>{current.number}</span><small>/ 04</small></div><div className="stage-progress">{scenes.map((scene, index) => <a key={scene.id} href={`#${scene.id}`} className={index === active ? "active" : ""} aria-label={`Ir para ${scene.eyebrow}`}><i /></a>)}</div></div><div className="world-scroll">{scenes.map(scene => <section className="scroll-marker" data-scene id={scene.id} key={scene.id} aria-label={scene.eyebrow} />)}</div></section>
    <section className="catalog" id="catalogo"><div className="catalog-head"><div><p className="eyebrow ink">LINHA BMAX</p><h2>Alguns dos nossos carregadores elétricos para veículos automotores.</h2></div><a href={whatsapp} target="_blank">Quero o catálogo completo <span>→</span></a></div><div className="catalog-grid">{products.map(([id,type,power,image]) => <article key={id}><div className="catalog-label"><span>{type}</span><b>{id}</b></div><img src={image} alt={`Carregador Bmax ${id}`} /><p>{power}</p><a href={whatsapp} target="_blank">Solicitar orçamento <span>→</span></a></article>)}</div></section>
    <section className="project" id="projeto"><div className="project-copy"><p className="eyebrow">BMAX TECHNOLOGY</p><h2>Instalação e manutenção para o seu empreendimento.</h2><p>Nós fazemos a instalação e manutenção em qualquer empreendimento que precise de um carregador elétrico em seu estacionamento.</p><a className="button light" href={whatsapp} target="_blank">Falar sobre instalação <span>→</span></a></div><img src="/scenes/installation-cdz-t.png" alt="Equipe instalando carregador rápido Bmax CDZ-T em estacionamento" /></section>
    <section className="lead-form" id="contato"><div><p className="eyebrow ink">FALE COM A BMAX</p><h2>Encontre a solução ideal para a sua recarga.</h2><p>Preencha seus dados e receba um atendimento personalizado para seu projeto.</p></div><form action="https://formsubmit.co/contato@bmaxbrasil.com.br" method="POST"><input type="hidden" name="_subject" value="Novo lead — Bmax Technology" /><input type="hidden" name="_captcha" value="false" /><input type="hidden" name="_template" value="table" /><label>Nome completo<input name="nome" type="text" autoComplete="name" required /></label><label>Telefone<input name="telefone" type="tel" autoComplete="tel" required /></label><label>CPF ou CNPJ<input name="documento" type="text" inputMode="numeric" required /></label><label>E-mail<input name="email" type="email" autoComplete="email" required /></label><label className="full">Mensagem<textarea name="mensagem" rows={5} required /></label><button className="button light" type="submit">Solicitar atendimento <span>→</span></button><p className="form-note">Seus dados serão enviados para a equipe Bmax.</p></form></section>
    <footer><span>Copyright 2026. Bmax Technology. Todos os direitos reservados.</span><span>Mobilidade elétrica para o Sul do Brasil.</span></footer>
  </main>;
}
