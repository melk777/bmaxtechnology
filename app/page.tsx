const whatsapp = "https://wa.me/554598437229?text=Olá%2C%20quero%20um%20orçamento%20para%20um%20carregador%20Bmax.";

const products = [
  { id: "CDZ-E", type: "RESIDENCIAL", power: "7 kW ou 22 kW", image: "/products/cdz-e.png", title: "Wallbox inteligente", copy: "Recarga AC compacta para casas, condomínios e vagas privativas.", specs: ["Tipo 2 · cabo de 5 m", "Wi-Fi, Ethernet e 4G", "IP55 · RFID"] },
  { id: "CDZ-B", type: "COMERCIAL AC", power: "Até 44 kW", image: "/products/cdz-b.png", title: "Recarga dupla em coluna", copy: "Duas saídas para empresas, hotéis, condomínios e estacionamentos.", specs: ["2 saídas de até 22 kW", "Tipo 2 · OCPP 1.6", "IP66 · IK10"] },
  { id: "CDZ-T", type: "RECARGA RÁPIDA", power: "60 kW ou 80 kW", image: "/products/cdz-t.png", title: "Potência que atrai clientes", copy: "Carregamento rápido DC com mídia, controle de acesso e dois conectores.", specs: ["2 conectores CCS2", "Tela touch + mídia de 43\"", "RFID · LAN · Wi-Fi"] },
  { id: "CDZ-WY", type: "ALTA DEMANDA", power: "60 kW, 80 kW ou 120 kW", image: "/products/cdz-wy.png", title: "Fluxo rápido, operação robusta", copy: "Solução DC para redes comerciais, estacionamentos e operações em expansão.", specs: ["2 conectores CCS2", "Eficiência de até 95%", "IP55 · IK10"] },
  { id: "CDZ-YE", type: "ALTA DEMANDA", power: "60 kW, 80 kW ou 120 kW", image: "/products/cdz-ye.png", title: "Recarga, mídia e experiência", copy: "Uma estação premium para locais de alto fluxo e grande visibilidade.", specs: ["Tela publicitária de 22\"", "LAN · Wi-Fi · 4G", "RFID · gerenciamento de cabos"] },
];

export default function Home() {
  return <main>
    <section className="hero" id="inicio">
      <nav className="nav container"><a href="#inicio" className="logo"><img src="/logo-bmax.png" alt="Bmax Technology" /><span>Bmax<br /><b>Technology</b></span></a><div className="links"><a href="#solucoes">Soluções</a><a href="#produtos">Produtos</a><a href="#revenda">Revenda</a></div><a className="outline" href={whatsapp} target="_blank">Falar com especialista ↗</a></nav>
      <div className="container hero-content"><p className="kicker">MOBILIDADE ELÉTRICA PARA O SUL DO BRASIL</p><h1>Onde a cidade<br /><i>continua em movimento.</i></h1><p className="hero-copy">A Bmax Technology conecta residências, negócios e grandes operações a uma nova forma de energia: inteligente, confiável e pronta para o agora.</p><div className="actions"><a className="primary" href={whatsapp} target="_blank">Solicitar orçamento <span>→</span></a><a className="text-button" href="#produtos">Explorar carregadores ↓</a></div><div className="hero-rail"><span>01</span><b>Energia para cada destino</b><span>Role para descobrir</span></div></div>
      <div className="city"><div className="skyline"><i/><i/><i/><i/><i/><i/><i/></div><div className="road"/><div className="ev-car"><div className="car-glow"/><div className="car-body"><span/><span/></div><div className="wheel left"/><div className="wheel right"/></div><div className="hero-station"><img src="/products/cdz-e.png" alt="Carregador Bmax" /><div className="charge-line"/><b>RECARGANDO</b></div></div>
    </section>

    <section className="intro container" id="solucoes"><div><p className="kicker dark">UMA REDE QUE CRESCE COM VOCÊ</p><h2>Do primeiro carregador<br />à sua próxima expansão.</h2></div><p>Não existe uma solução única para todos. Por isso, a Bmax trabalha com equipamentos para quem recarrega em casa, recebe clientes, administra estacionamentos ou quer revender mobilidade elétrica.</p></section>

    <section className="journey"><div className="container"><p className="kicker">PENSE NO SEU DESTINO</p><div className="journey-grid"><article><span>01</span><h3>Em casa</h3><p>Tenha seu veículo pronto para sair todos os dias.</p></article><article><span>02</span><h3>No seu negócio</h3><p>Crie uma experiência que faz o cliente ficar mais tempo.</p></article><article><span>03</span><h3>Na cidade</h3><p>Atenda grandes fluxos com recarga rápida e gestão inteligente.</p></article></div></div></section>

    <section className="products container" id="produtos"><div className="section-head"><div><p className="kicker dark">LINHA BMAX</p><h2>Escolha a energia<br />do seu projeto.</h2></div><p>Cada versão de potência é um equipamento próprio, configurado para a necessidade e o orçamento do seu projeto.</p></div><div className="product-grid">{products.map((p) => <article className="product" key={p.id}><div className="product-top"><span>{p.type}</span><b>{p.id}</b></div><div className="product-image"><img src={p.image} alt={`Carregador ${p.id}`} /></div><p className="power">{p.power}</p><h3>{p.title}</h3><p className="product-copy">{p.copy}</p><ul>{p.specs.map((s) => <li key={s}>{s}</li>)}</ul><a href={whatsapp} target="_blank">Orçar esta versão <span>→</span></a></article>)}</div></section>

    <section className="partner" id="revenda"><div className="container partner-grid"><div><p className="kicker">PARCEIRO BMAX</p><h2>Transforme<br />energia em negócio.</h2><p>Para empresas e revendedores que querem levar mobilidade elétrica para novos clientes, projetos e cidades.</p><a className="primary light" href={whatsapp} target="_blank">Quero ser revendedor <span>→</span></a></div><div className="partner-card"><span>ATENDEMOS O SUL DO BRASIL</span><strong>Uma nova rota<br />para o seu negócio.</strong><small>Residencial · Comercial · Revenda</small></div></div></section>

    <section className="cta container"><p className="kicker dark">COMECE AGORA</p><h2>Seu projeto de recarga<br />começa com uma conversa.</h2><a className="primary" href={whatsapp} target="_blank">Chamar no WhatsApp <span>→</span></a></section>
    <footer><div className="container footer"><a href="#inicio" className="logo"><img src="/logo-bmax.png" alt="Bmax Technology" /><span>Bmax<br /><b>Technology</b></span></a><span>Mobilidade elétrica para o Sul do Brasil.</span><span>© 2026 Bmax Technology</span></div></footer>
  </main>;
}
