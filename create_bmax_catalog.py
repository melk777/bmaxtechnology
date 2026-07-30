from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.platypus import Paragraph


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output" / "pdf" / "catalogo-bmax-technology.pdf"
PRODUCTS = ROOT / "public" / "products"
SCENES = ROOT / "public" / "scenes"
LOGO = ROOT / "public" / "logo-bmax.png"

W, H = A4
NAVY = colors.HexColor("#071522")
NAVY_2 = colors.HexColor("#0C2234")
BLUE = colors.HexColor("#1C8BFF")
GREEN = colors.HexColor("#52E0A0")
MIST = colors.HexColor("#DDEAF3")
INK = colors.HexColor("#142433")
MUTED = colors.HexColor("#5C7182")
WHITE = colors.white


def setup_fonts():
    regular = Path(r"C:\Windows\Fonts\arial.ttf")
    bold = Path(r"C:\Windows\Fonts\arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("Bmax", str(regular)))
        pdfmetrics.registerFont(TTFont("BmaxBold", str(bold)))
        return "Bmax", "BmaxBold"
    return "Helvetica", "Helvetica-Bold"


REG, BOLD = setup_fonts()


def crop_draw(c, image_path, x, y, w, h, anchor="center"):
    image = ImageReader(str(image_path))
    iw, ih = image.getSize()
    ratio = max(w / iw, h / ih)
    dw, dh = iw * ratio, ih * ratio
    if anchor == "right":
        dx = x + w - dw
    elif anchor == "left":
        dx = x
    else:
        dx = x + (w - dw) / 2
    dy = y + (h - dh) / 2
    c.saveState()
    p = c.beginPath()
    p.rect(x, y, w, h)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(image, dx, dy, dw, dh, mask="auto")
    c.restoreState()


def para(c, text, style, x, y, w, h=None):
    p = Paragraph(text, style)
    aw, ah = p.wrap(w, h or 1000 * mm)
    p.drawOn(c, x, y - ah)
    return ah


def styles():
    return {
        "eyebrow": ParagraphStyle("eyebrow", fontName=BOLD, fontSize=8.5, leading=11, textColor=GREEN, spaceAfter=5, tracking=1.2),
        "title": ParagraphStyle("title", fontName=BOLD, fontSize=30, leading=33, textColor=WHITE),
        "product_name": ParagraphStyle("product_name", fontName=BOLD, fontSize=24, leading=27, textColor=WHITE),
        "title_dark": ParagraphStyle("title_dark", fontName=BOLD, fontSize=27, leading=31, textColor=INK),
        "subtitle": ParagraphStyle("subtitle", fontName=REG, fontSize=11.5, leading=17, textColor=colors.HexColor("#D8E8F2")),
        "body": ParagraphStyle("body", fontName=REG, fontSize=10.2, leading=15, textColor=MUTED),
        "body_light": ParagraphStyle("body_light", fontName=REG, fontSize=10.2, leading=15, textColor=colors.HexColor("#D8E8F2")),
        "spec": ParagraphStyle("spec", fontName=REG, fontSize=9.2, leading=13, textColor=INK),
        "spec_label": ParagraphStyle("spec_label", fontName=BOLD, fontSize=8.5, leading=11, textColor=BLUE),
        "small": ParagraphStyle("small", fontName=REG, fontSize=8, leading=10.5, textColor=MUTED),
        "small_light": ParagraphStyle("small_light", fontName=REG, fontSize=8, leading=10.5, textColor=colors.HexColor("#AFC6D5")),
        "cta": ParagraphStyle("cta", fontName=BOLD, fontSize=13, leading=17, textColor=WHITE),
    }


S = styles()


def footer(c, page):
    c.setFillColor(colors.HexColor("#8FA6B6"))
    c.setFont(REG, 7.5)
    c.drawString(18 * mm, 13 * mm, "BMAX TECHNOLOGY  |  Carregadores elétricos para todos os ambientes")
    c.drawRightString(W - 18 * mm, 13 * mm, f"{page:02d}")


def brand_mark(c, x, y, size=16, dark=False):
    c.setFont(BOLD, size)
    c.setFillColor(BLUE)
    c.drawString(x, y, "BM")
    c.setFillColor(WHITE if dark else INK)
    c.drawString(x + size * 1.38, y, "AX")


def cover(c):
    crop_draw(c, SCENES / "resort-hero.png", 0, 0, W, H, "center")
    c.setFillColor(colors.Color(0.02, 0.08, 0.13, alpha=0.72))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(colors.Color(0.02, 0.08, 0.13, alpha=0.42))
    c.rect(0, 0, 112 * mm, H, fill=1, stroke=0)
    brand_mark(c, 20 * mm, H - 30 * mm, 20, True)
    c.setFillColor(colors.HexColor("#CFE2ED"))
    c.setFont(BOLD, 8)
    c.drawString(20 * mm, H - 39 * mm, "TECHNOLOGY")
    para(c, "CARREGADORES ELÉTRICOS<br/>PARA TODOS OS AMBIENTES.", S["title"], 20 * mm, H - 75 * mm, 96 * mm)
    para(c, "Soluções de recarga para residências, empresas, hotéis, estacionamentos, eletropostos e revendedores no Sul do Brasil.", S["subtitle"], 20 * mm, H - 145 * mm, 83 * mm)
    c.setFillColor(GREEN)
    c.rect(20 * mm, 30 * mm, 42 * mm, 0.9 * mm, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(BOLD, 9)
    c.drawString(20 * mm, 24 * mm, "CATÁLOGO DE SOLUÇÕES  |  2026")
    c.setFont(REG, 8.5)
    c.setFillColor(colors.HexColor("#CFE2ED"))
    c.drawString(20 * mm, 17 * mm, "www.bmaxbrasil.com.br")


def intro(c, page):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    brand_mark(c, 18 * mm, H - 28 * mm, 15, True)
    para(c, "A RECARGA CERTA<br/>PARA CADA DESTINO.", S["title"], 18 * mm, H - 58 * mm, 120 * mm)
    para(c, "A BMAX Technology projeta soluções de mobilidade elétrica para a realidade de cada operação. Não trabalhamos com uma potência genérica: cada equipamento é indicado, dimensionado e orçado de acordo com o local e a necessidade de uso.", S["body_light"], 18 * mm, H - 118 * mm, 106 * mm)
    cards = [
        ("RESIDÊNCIAS", "Recarga segura e inteligente para sua rotina."),
        ("EMPRESAS E HOTÉIS", "Uma experiência de energia para clientes, equipes e hóspedes."),
        ("ELETROPOSTOS", "Potência, conectividade e operação preparada para crescer."),
    ]
    y = 92 * mm
    for title, body in cards:
        c.setFillColor(NAVY_2)
        c.roundRect(18 * mm, y, 174 * mm, 29 * mm, 4 * mm, fill=1, stroke=0)
        c.setFillColor(GREEN)
        c.circle(27 * mm, y + 20 * mm, 2.2 * mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(BOLD, 10)
        c.drawString(35 * mm, y + 20 * mm, title)
        para(c, body, S["small_light"], 35 * mm, y + 14 * mm, 140 * mm)
        y -= 35 * mm
    footer(c, page)


def product_page(c, page, product):
    c.setFillColor(colors.HexColor("#F5F8FA"))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.rect(0, H - 49 * mm, W, 49 * mm, fill=1, stroke=0)
    brand_mark(c, 18 * mm, H - 25 * mm, 15, True)
    para(c, product["tag"], S["eyebrow"], 18 * mm, H - 36 * mm, 80 * mm)
    para(c, product["name"], S["product_name"], 18 * mm, H - 40 * mm, 118 * mm)
    c.setFillColor(colors.HexColor("#E8F0F5"))
    c.roundRect(18 * mm, 42 * mm, 77 * mm, 183 * mm, 4 * mm, fill=1, stroke=0)
    crop_draw(c, product["image"], 22 * mm, 54 * mm, 69 * mm, 160 * mm, "center")
    c.setFillColor(BLUE)
    c.roundRect(24 * mm, 45 * mm, 65 * mm, 11 * mm, 2 * mm, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(BOLD, 8.5)
    c.drawCentredString(56.5 * mm, 49 * mm, product["power"])
    x = 108 * mm
    headline_top = H - 78 * mm
    headline_height = para(c, product["headline"], S["title_dark"], x, headline_top, 84 * mm)
    para(c, product["description"], S["body"], x, headline_top - headline_height - 5 * mm, 84 * mm)
    y = H - 145 * mm
    for label, value in product["specs"]:
        c.setFillColor(colors.HexColor("#D7E3EB"))
        c.rect(x, y - 2 * mm, 84 * mm, 0.35 * mm, fill=1, stroke=0)
        para(c, label.upper(), S["spec_label"], x, y - 4 * mm, 84 * mm)
        para(c, value, S["spec"], x, y - 10 * mm, 84 * mm)
        y -= 19 * mm
    c.setFillColor(NAVY)
    c.roundRect(x, 34 * mm, 84 * mm, 18 * mm, 3 * mm, fill=1, stroke=0)
    para(c, "Solicite uma proposta para este equipamento.", S["small_light"], x + 6 * mm, 46 * mm, 70 * mm)
    footer(c, page)


def installation(c, page):
    crop_draw(c, SCENES / "installation-cdz-t.png", 0, 0, W, H, "center")
    c.setFillColor(colors.Color(0.02, 0.08, 0.13, alpha=0.76))
    c.rect(0, 0, 116 * mm, H, fill=1, stroke=0)
    brand_mark(c, 18 * mm, H - 30 * mm, 16, True)
    para(c, "DO PROJETO À<br/>INSTALAÇÃO.", S["title"], 18 * mm, H - 65 * mm, 84 * mm)
    para(c, "Nós fazemos a instalação e manutenção em qualquer empreendimento que precise de um carregador elétrico em seu estacionamento.", S["body_light"], 18 * mm, H - 122 * mm, 82 * mm)
    items = ["Avaliação técnica do local", "Dimensionamento da recarga", "Instalação profissional", "Manutenção e suporte"]
    y = H - 166 * mm
    for item in items:
        c.setFillColor(GREEN)
        c.circle(21 * mm, y + 2 * mm, 1.8 * mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont(REG, 10)
        c.drawString(28 * mm, y, item)
        y -= 12 * mm
    footer(c, page)


def contact(c, page):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    crop_draw(c, SCENES / "scale.png", 116 * mm, 0, W - 116 * mm, H, "right")
    c.setFillColor(colors.Color(0.02, 0.08, 0.13, alpha=0.86))
    c.rect(0, 0, 126 * mm, H, fill=1, stroke=0)
    brand_mark(c, 18 * mm, H - 30 * mm, 16, True)
    para(c, "VAMOS PLANEJAR<br/>SUA RECARGA?", S["title"], 18 * mm, H - 67 * mm, 92 * mm)
    para(c, "Fale com a equipe BMAX para receber o catálogo completo, orientação técnica e um orçamento sob medida para o seu projeto.", S["body_light"], 18 * mm, H - 123 * mm, 88 * mm)
    c.setFillColor(GREEN)
    c.roundRect(18 * mm, 70 * mm, 86 * mm, 23 * mm, 3 * mm, fill=1, stroke=0)
    c.setFillColor(NAVY)
    c.setFont(BOLD, 11)
    c.drawString(24 * mm, 83 * mm, "WHATSAPP")
    c.setFont(BOLD, 16)
    c.drawString(24 * mm, 75 * mm, "+55 45 9843-7229")
    c.setFillColor(colors.HexColor("#B7CBD7"))
    c.setFont(REG, 9)
    c.drawString(18 * mm, 51 * mm, "contato@bmaxbrasil.com.br")
    c.drawString(18 * mm, 42 * mm, "Atendimento na região Sul do Brasil")
    c.setFillColor(colors.HexColor("#8FA6B6"))
    c.setFont(REG, 7.5)
    c.drawString(18 * mm, 13 * mm, "Copyright 2026. Bmax Technology. Todos os direitos reservados.")
    c.drawRightString(W - 18 * mm, 13 * mm, f"{page:02d}")


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=A4)
    c.setTitle("Catálogo BMAX Technology 2026")
    c.setAuthor("BMAX Technology")
    cover(c); c.showPage()
    intro(c, 2); c.showPage()
    products = [
        {
            "tag": "RECARGA RESIDENCIAL", "name": "CDZ-E", "image": PRODUCTS / "cdz-e.png", "power": "7 kW ou 22 kW",
            "headline": "Energia inteligente para a sua casa.",
            "description": "Wallbox compacto para quem deseja recarregar o veículo com segurança, conectividade e praticidade no dia a dia.",
            "specs": [("Tipo de recarga", "AC - conector Tipo 2"), ("Conectividade", "OCPP 1.6, Ethernet, Wi-Fi e 4G"), ("Interface", "Tela touch de 4,3 polegadas e RFID"), ("Proteção", "IP55, IK10 e proteções elétricas integradas"), ("Garantia", "2 anos")],
        },
        {
            "tag": "RECARGA RESIDENCIAL", "name": "CDZ-PG", "image": PRODUCTS / "cdz-pg.png", "power": "7 kW ou 22 kW",
            "headline": "Recarga essencial, compacta e conectada.",
            "description": "Wallbox AC de formato compacto para projetos residenciais e empresariais que buscam segurança, autenticação por RFID e conectividade remota.",
            "specs": [("Tipo de recarga", "AC - conector Tipo 2"), ("Conectividade", "OCPP 1.6, Ethernet, Wi-Fi e 4G"), ("Interface", "Display de 4,3 polegadas e RFID"), ("Proteção", "IP55, IK10 e proteções elétricas integradas"), ("Garantia", "2 anos")],
        },
        {
            "tag": "EMPRESAS E CONDOMÍNIOS", "name": "CDZ-B", "image": PRODUCTS / "cdz-b.png", "power": "44 kW - 2 x 22 kW",
            "headline": "Duas recargas para uma operação conectada.",
            "description": "Estação AC de piso para operações que precisam atender dois veículos simultaneamente com gestão de acesso e alta resistência.",
            "specs": [("Tipo de recarga", "AC - 2 conectores Tipo 2"), ("Alimentação", "Trifásica 400 V, 50/60 Hz"), ("Conectividade", "OCPP 1.6, Ethernet e Wi-Fi"), ("Interface", "Tela touch de 4,3 polegadas e RFID"), ("Proteção", "IP66, IK10 e RCD-A")],
        },
        {
            "tag": "EMPRESAS E CONDOMÍNIOS", "name": "CDZ-BG", "image": PRODUCTS / "cdz-bg.png", "power": "44 kW - 2 x 22 kW",
            "headline": "Duas conexões em um formato compacto.",
            "description": "Carregador AC de parede para dois veículos, indicado para estacionamentos, condomínios e empresas que buscam otimizar o espaço de instalação.",
            "specs": [("Tipo de recarga", "AC - 2 conectores Tipo 2"), ("Alimentação", "Trifásica 400 V, 50/60 Hz"), ("Conectividade", "OCPP 1.6, Ethernet e Wi-Fi"), ("Interface", "Tela touch de 4,3 polegadas e RFID"), ("Proteção", "IP54, IK10, RCD-A e DC 6 mA")],
        },
        {
            "tag": "RECARGA RÁPIDA", "name": "CDZ-BT", "image": PRODUCTS / "cdz-bt.png", "power": "60 kW ou 80 kW",
            "headline": "Potência rápida em um perfil compacto.",
            "description": "Estação DC de dois conectores para estacionamentos, hotéis e empreendimentos que precisam oferecer recarga rápida com excelente aproveitamento de espaço.",
            "specs": [("Tipo de recarga", "DC - 2 conectores CCS2"), ("Interface", "Tela touch de 10,1 polegadas e RFID"), ("Conectividade", "OCPP 1.6J, LAN e Wi-Fi"), ("Eficiência", "Até 95%"), ("Proteção", "IP54 e IK10")],
        },
        {
            "tag": "RECARGA RÁPIDA COM MÍDIA", "name": "CDZ-T", "image": PRODUCTS / "cdz-t.png", "power": "60 kW ou 80 kW",
            "headline": "Potência rápida que também comunica.",
            "description": "Carregador DC de piso com dois conectores CCS2, tela touch de 10,1 polegadas e tela publicitária de 43 polegadas.",
            "specs": [("Tipo de recarga", "DC - 2 conectores CCS2"), ("Interface", "Tela touch de 10,1 pol. + mídia de 43 pol."), ("Conectividade", "OCPP 1.6J, LAN e Wi-Fi"), ("Eficiência", "Até 95%"), ("Proteção", "IP54, IK10 e leitor RFID")],
        },
        {
            "tag": "ALTA POTÊNCIA", "name": "CDZ-A", "image": PRODUCTS / "cdz-a.png", "power": "120 kW",
            "headline": "Alta potência para acelerar grandes fluxos.",
            "description": "Estação DC de 120 kW com dois conectores CCS2 para operações que precisam atender uma demanda intensa de recarga com eficiência e robustez.",
            "specs": [("Tipo de recarga", "DC - 2 conectores CCS2"), ("Interface", "Tela touch de 10,1 polegadas e RFID"), ("Conectividade", "OCPP 1.6J, LAN e Wi-Fi"), ("Eficiência", "Até 95%"), ("Proteção", "IP55 e IK10")],
        },
        {
            "tag": "RECARGA RÁPIDA PARA OPERAÇÕES", "name": "CDZ-WY", "image": PRODUCTS / "cdz-wy.png", "power": "60 kW, 80 kW ou 120 kW",
            "headline": "Alta potência para o fluxo do seu negócio.",
            "description": "Estação DC robusta para estacionamentos, hotéis, centros comerciais e eletropostos que precisam de velocidade e disponibilidade.",
            "specs": [("Tipo de recarga", "DC - 2 conectores CCS2"), ("Interface", "Tela touch de 10,1 polegadas"), ("Conectividade", "OCPP 1.6J, LAN e Wi-Fi"), ("Eficiência", "Até 95%"), ("Proteção", "IP55, IK10 e leitor RFID")],
        },
        {
            "tag": "ELETROPOSTOS E GRANDES FLUXOS", "name": "CDZ-YE", "image": PRODUCTS / "cdz-ye.png", "power": "60 kW, 80 kW ou 120 kW",
            "headline": "Uma estação completa para sua operação crescer.",
            "description": "Carregador DC de dois conectores com gestão de cabos, conectividade 4G e tela publicitária integrada para valorizar o ponto de recarga.",
            "specs": [("Tipo de recarga", "DC - 2 conectores CCS2"), ("Interface", "Tela touch de 10,1 pol. + mídia de 22 pol."), ("Conectividade", "OCPP 1.6J, LAN, Wi-Fi e 4G"), ("Eficiência", "Até 95%"), ("Proteção", "IP54, IK10 e leitor RFID")],
        },
    ]
    for index, product in enumerate(products, start=3):
        product_page(c, index, product)
        c.showPage()
    installation(c, len(products) + 3); c.showPage()
    contact(c, len(products) + 4)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
