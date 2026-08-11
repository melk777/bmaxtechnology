from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF


ROOT = Path(__file__).resolve().parent
OUT = ROOT / "output" / "pdf" / "cartao-visitas-bmax-jose-valerio.pdf"
OFFICE = ROOT / "output" / "cards" / "bmax-luxury-office-background.png"

# Cartão 90 x 50 mm, com 3 mm de sangria em cada lado.
TRIM_W, TRIM_H = 90 * mm, 50 * mm
BLEED = 3 * mm
W, H = TRIM_W + 2 * BLEED, TRIM_H + 2 * BLEED
NAVY = colors.HexColor("#101010")
GOLD = colors.HexColor("#C9A66B")
GOLD_DARK = colors.HexColor("#947343")
WHITE = colors.HexColor("#F7F1E7")
PALE = colors.HexColor("#D8C8AA")


def setup_fonts():
    regular = Path(r"C:\Windows\Fonts\arial.ttf")
    bold = Path(r"C:\Windows\Fonts\arialbd.ttf")
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("BmaxCard", str(regular)))
        pdfmetrics.registerFont(TTFont("BmaxCardBold", str(bold)))
        return "BmaxCard", "BmaxCardBold"
    return "Helvetica", "Helvetica-Bold"


REG, BOLD = setup_fonts()


def brand_mark(c, x, y, size, dark=True):
    c.setFont(BOLD, size)
    c.setFillColor(GOLD)
    c.drawString(x, y, "BMAX")


def line(c, x1, y1, x2, y2, color, width=0.5):
    c.setStrokeColor(color)
    c.setLineWidth(width)
    c.line(x1, y1, x2, y2)


def qr_code(c, value, x, y, size):
    widget = qr.QrCodeWidget(value)
    bounds = widget.getBounds()
    width = bounds[2] - bounds[0]
    height = bounds[3] - bounds[1]
    drawing = Drawing(size, size, transform=[size / width, 0, 0, size / height, 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, c, x, y)


def front(c):
    c.drawImage(ImageReader(str(OFFICE)), 0, 0, W, H, mask="auto")
    c.setFillColor(colors.Color(0.02, 0.02, 0.02, alpha=0.26))
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(colors.Color(0.02, 0.02, 0.02, alpha=0.60))
    c.rect(0, 0, 61 * mm, H, fill=1, stroke=0)
    brand_mark(c, 9 * mm, H - 15 * mm, 18, True)
    c.setFillColor(PALE)
    c.setFont(BOLD, 6.7)
    c.drawString(9 * mm, H - 21 * mm, "TECHNOLOGY")
    c.setFillColor(WHITE)
    c.setFont(BOLD, 11.5)
    c.drawString(9 * mm, 25 * mm, "ENERGIA PARA UM NOVO")
    c.drawString(9 * mm, 19 * mm, "PADRÃO DE EXPERIÊNCIA.")
    c.setFillColor(GOLD)
    c.rect(9 * mm, 12 * mm, 20 * mm, 0.45 * mm, fill=1, stroke=0)
    c.setFillColor(PALE)
    c.setFont(REG, 6.4)
    c.drawString(9 * mm, 7 * mm, "Carregadores elétricos para todos os ambientes")


def back(c):
    c.setFillColor(NAVY)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(8 * mm, 8 * mm, 0.55 * mm, H - 16 * mm, fill=1, stroke=0)
    brand_mark(c, 13 * mm, H - 13 * mm, 12, True)
    c.setFillColor(WHITE)
    c.setFont(BOLD, 13)
    c.drawString(13 * mm, H - 23 * mm, "Melk")
    c.setFillColor(GOLD)
    c.setFont(BOLD, 7.2)
    c.drawString(13 * mm, H - 28 * mm, "CEO | BMAX TECHNOLOGY")
    line(c, 13 * mm, H - 32 * mm, 58 * mm, H - 32 * mm, GOLD_DARK, 0.55)
    c.setFillColor(WHITE)
    c.setFont(REG, 7.2)
    c.drawString(13 * mm, H - 38 * mm, "+55 45 98816-7775")
    c.drawString(13 * mm, H - 43 * mm, "contato@bmaxbrasil.com.br")
    c.drawString(13 * mm, H - 47 * mm, "www.bmaxbrasil.com.br")
    c.setFillColor(PALE)
    c.setFont(REG, 5.9)
    c.drawString(13 * mm, 5 * mm, "Aponte a câmera para falar com a BMAX")
    qr_y = (H - 22 * mm) / 2
    c.setFillColor(WHITE)
    c.roundRect(66 * mm, qr_y, 22 * mm, 22 * mm, 1 * mm, fill=1, stroke=0)
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.7)
    c.roundRect(66 * mm, qr_y, 22 * mm, 22 * mm, 1 * mm, fill=0, stroke=1)
    qr_code(c, "https://wa.me/5545988167775?text=Olá%2C%20quero%20conhecer%20as%20soluções%20da%20BMAX.", 68 * mm, qr_y + 2 * mm, 18 * mm)
    c.setFillColor(GOLD)
    c.circle(74.5 * mm, qr_y - 1.5 * mm, 1.3 * mm, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(BOLD, 5.8)
    c.drawString(77 * mm, qr_y - 3.3 * mm, "WHATSAPP")


def build():
    OUT.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(OUT), pagesize=(W, H))
    c.setTitle("Cartão de Visitas - Melk | BMAX Technology")
    c.setAuthor("BMAX Technology")
    front(c)
    c.showPage()
    back(c)
    c.save()
    print(OUT)


if __name__ == "__main__":
    build()
