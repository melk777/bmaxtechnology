export type Vehicle = {
  brand: string;
  model: string;
  batteryKwh: number;
  acMaxKw?: number;
  dcMaxKw?: number;
  dcReference?: { from: number; to: number; minutes: number; atKw?: number };
  source: string;
};

// Só entram dados publicados pelas próprias montadoras. A lista será ampliada
// à medida que cada versão/ano tiver sua ficha técnica conferida.
export const vehicles: Vehicle[] = [
  { brand: "BYD", model: "Dolphin Mini", batteryKwh: 38, dcReference: { from: 30, to: 80, minutes: 30 }, source: "https://www.byd.com/content/dam/byd-site/br/fichas-t%C3%A9cnicas---update-2025/julho/Ficha_T%C3%A9cnica_Dolphin_Mini_16_Jul_25.pdf" },
  { brand: "BYD", model: "Dolphin", batteryKwh: 44.9, dcReference: { from: 30, to: 80, minutes: 30 }, source: "https://www.byd.com/content/dam/byd-site/br/fichas-t%C3%A9cnicas---update-2025/Ficha_Tecnica_Dolphin_06_2025.pdf" },
  { brand: "BYD", model: "Yuan Pro", batteryKwh: 45.1, acMaxKw: 6.6, dcMaxKw: 60, source: "https://www.byd.com/content/dam/byd-site/br/manuais-auto-byd/09.2024%20-%20Ficha_Tecnica%20-%20Yuan%20Pro.pdf" },
  { brand: "BYD", model: "Yuan Plus", batteryKwh: 60.48, dcMaxKw: 80, dcReference: { from: 30, to: 80, minutes: 30, atKw: 80 }, source: "https://www.byd.com/content/dam/byd-site/br/fichas-tecnicas-2026/356.1575.7802.8%20-%20FICHA%20TECNICA%20YUAN%20PLUS.pdf" },
  { brand: "Chevrolet", model: "Spark EUV", batteryKwh: 42, dcReference: { from: 30, to: 80, minutes: 35 }, source: "https://news.chevrolet.com.br/newsroom.detail.html/Pages/news/br/pt/2025/sep/0908-Chevrolet-Spark-EUV-estreia-como-primeiro-SUV-eletrico-acessivel-inteligente-Brasil.html" },
  { brand: "Nissan", model: "LEAF 40 kWh", batteryKwh: 40, dcMaxKw: 50, source: "https://www.nissan.com.br/content/dam/Nissan/br/site/servicos/manuais/leaf-2023/MP%20LEAF%20WEB%20Janeiro%2023.pdf" },
  { brand: "Peugeot", model: "e-2008 MY23", batteryKwh: 50, acMaxKw: 7.4, source: "https://carros.peugeot.com.br/content/dam/peugeot/brazil/b2c/tools/catalogos/agosto/e2008/PEUGEOT-e-2008-CATALOGO-MY23.pdf" },
  { brand: "Peugeot", model: "e-2008 2025", batteryKwh: 54, source: "https://carros.peugeot.com.br/content/dam/peugeot/brazil/b2c/our-range/e-2008/ficha-tecnica/janeiro/ficha-tecnica-e2008-jan25.pdf" },
  { brand: "Volvo", model: "EX30 Core / Plus Single Motor", batteryKwh: 51, acMaxKw: 11, dcMaxKw: 150, dcReference: { from: 10, to: 80, minutes: 26, atKw: 150 }, source: "https://www.volvocars.com/br/build/print?token=9822127488671685403" },
  { brand: "Volvo", model: "EX30 Cross Country Ultra", batteryKwh: 69, acMaxKw: 11, source: "https://www.volvocars.com/br/build/print?token=2332839682982122862" },
];
