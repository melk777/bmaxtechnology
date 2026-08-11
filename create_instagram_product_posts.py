from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math

ROOT = Path(__file__).parent
PRODUCTS = ROOT / "public" / "products"
OUT = ROOT / "output" / "instagram-produtos"

W, H = 1080, 1350
NAVY = (7, 16, 31)
INK = (14, 28, 47)
BLUE = (32, 139, 232)
GREEN = (73, 224, 158)
WHITE = (247, 250, 253)
MIST = (180, 205, 226)

FONT_BOLD = r"C:\Windows\Fonts\arialbd.ttf"
FONT_REG = r"C:\Windows\Fonts\arial.ttf"

def font(path, size):
    return ImageFont.truetype(path, size)

def wrap(draw, text, fnt, max_width):
    words, lines, line = text.split(), [], ""
    for word in words:
        trial = (line + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            line = trial
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines

def rounded_mask(size, radius):
    m = Image.new("L", size, 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, *size), radius, fill=255)
    return m

def product_cutout(path):
    im = Image.open(path).convert("RGBA")
    px = im.load()
    # Remove only near-white studio background, preserving product highlights.
    for y in range(im.height):
        for x in range(im.width):
            r, g, b, a = px[x, y]
            if r > 244 and g > 244 and b > 244:
                px[x, y] = (r, g, b, 0)
            elif r > 228 and g > 228 and b > 228:
                alpha = int((255 - max(r, g, b)) / 27 * a)
                px[x, y] = (r, g, b, max(0, alpha))
    bbox = im.getbbox()
    return im.crop(bbox) if bbox else im

def make_background(accent):
    bg = Image.new("RGB", (W, H), NAVY)
    d = ImageDraw.Draw(bg)
    # Smooth radial waves / premium technical glow.
    for radius in range(720, 30, -12):
        a = int(38 * (1 - radius / 720))
        col = tuple(int(NAVY[i] * (1-a/255) + accent[i] * (a/255)) for i in range(3))
        d.ellipse((W - 620 - radius, 80 - radius, W - 620 + radius, 80 + radius), fill=col)
    for y in range(620, H, 42):
        d.line((0, y, W, y), fill=(14, 36, 60), width=1)
    for x in range(-200, W + 300, 80):
        d.line((x, H, x + 430, 590), fill=(11, 34, 58), width=1)
    return bg

def create_post(data):
    accent = GREEN if data["type"] == "AC" else BLUE
    canvas = make_background(accent).convert("RGBA")
    draw = ImageDraw.Draw(canvas)

    # Header / wordmark
    draw.text((72, 70), "BMAX", font=font(FONT_BOLD, 46), fill=WHITE)
    draw.text((73, 123), "TECHNOLOGY", font=font(FONT_BOLD, 17), fill=accent)
    draw.line((72, 159, 1008, 159), fill=(54, 83, 110), width=2)
    draw.text((72, 194), data["category"], font=font(FONT_BOLD, 20), fill=accent)
    draw.text((72, 236), data["name"], font=font(FONT_BOLD, 72), fill=WHITE)
    draw.text((72, 320), data["power"], font=font(FONT_BOLD, 31), fill=MIST)

    # Product panel with subtle glow
    panel = (72, 405, 1008, 1010)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.rounded_rectangle((panel[0]-8, panel[1]-8, panel[2]+8, panel[3]+8), 44, fill=accent + (90,))
    canvas = Image.alpha_composite(canvas, glow.filter(ImageFilter.GaussianBlur(28)))
    draw = ImageDraw.Draw(canvas)
    draw.rounded_rectangle(panel, 40, fill=(12, 30, 50, 238), outline=(77, 109, 137, 150), width=2)

    item = product_cutout(PRODUCTS / data["image"])
    max_w, max_h = 620, 535
    scale = min(max_w / item.width, max_h / item.height)
    item = item.resize((int(item.width * scale), int(item.height * scale)), Image.Resampling.LANCZOS)
    # Product base and a restrained artificial ground highlight.
    px = (W - item.width) // 2
    py = 440 + (535 - item.height) // 2
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    sd.ellipse((W//2-230, 930, W//2+230, 978), fill=(0, 0, 0, 105))
    canvas = Image.alpha_composite(canvas, shadow.filter(ImageFilter.GaussianBlur(16)))
    canvas.alpha_composite(item, (px, py))
    draw = ImageDraw.Draw(canvas)

    # Commercial message and data chips
    y = 1060
    title_font = font(FONT_BOLD, 32)
    for line in wrap(draw, data["headline"], title_font, 900):
        draw.text((72, y), line, font=title_font, fill=WHITE)
        y += 39
    y += 18
    chips = data["chips"]
    x = 72
    chip_fnt = font(FONT_BOLD, 17)
    for chip in chips:
        tw = draw.textbbox((0, 0), chip, font=chip_fnt)[2]
        cw = tw + 42
        draw.rounded_rectangle((x, y, x+cw, y+43), 20, fill=(22, 50, 77), outline=(76, 112, 142), width=1)
        draw.text((x+21, y+11), chip, font=chip_fnt, fill=WHITE)
        x += cw + 12
    draw.text((72, 1282), "bmaxbrasil.com.br", font=font(FONT_BOLD, 19), fill=MIST)
    draw.text((1008, 1282), "ARRASTE • SALVE • FALE COM A BMAX", font=font(FONT_BOLD, 15), fill=accent, anchor="ra")

    OUT.mkdir(parents=True, exist_ok=True)
    canvas.convert("RGB").save(OUT / f"post-{data['name'].lower()}.jpg", quality=95, subsampling=0)

products = [
    {"name":"CDZ-E", "image":"cdz-e.png", "category":"RECARGA RESIDENCIAL", "power":"7 kW ou 22 kW", "type":"AC", "headline":"Sua casa pronta para a mobilidade elétrica.", "chips":["AC", "TIPO 2", "RFID"]},
    {"name":"CDZ-PG", "image":"cdz-pg.png", "category":"RECARGA RESIDENCIAL", "power":"7 kW ou 22 kW", "type":"AC", "headline":"Recarga compacta, segura e conectada.", "chips":["AC", "TIPO 2", "OCPP 1.6"]},
    {"name":"CDZ-B", "image":"cdz-b.png", "category":"EMPRESAS E CONDOMÍNIOS", "power":"44 kW • 2 × 22 kW", "type":"AC", "headline":"Duas recargas para o ritmo do seu negócio.", "chips":["AC", "2 VEÍCULOS", "IP66"]},
    {"name":"CDZ-BG", "image":"cdz-bg.png", "category":"EMPRESAS E CONDOMÍNIOS", "power":"44 kW • 2 × 22 kW", "type":"AC", "headline":"Dois veículos, um espaço otimizado.", "chips":["AC", "2 VEÍCULOS", "RFID"]},
    {"name":"CDZ-BT", "image":"cdz-bt.png", "category":"RECARGA RÁPIDA", "power":"60 kW ou 80 kW", "type":"DC", "headline":"Potência rápida em formato inteligente.", "chips":["DC", "2 CCS2", "ATÉ 95%"]},
    {"name":"CDZ-T", "image":"cdz-t.png", "category":"RECARGA RÁPIDA COM MÍDIA", "power":"60 kW ou 80 kW", "type":"DC", "headline":"Recarga rápida que também valoriza sua marca.", "chips":["DC", "2 CCS2", "TELA 43\""]},
    {"name":"CDZ-A", "image":"cdz-a.png", "category":"ALTA POTÊNCIA", "power":"120 kW", "type":"DC", "headline":"Alta potência para grandes demandas.", "chips":["DC", "2 CCS2", "120 kW"]},
    {"name":"CDZ-WY", "image":"cdz-wy.png", "category":"RECARGA RÁPIDA PARA OPERAÇÕES", "power":"60 kW, 80 kW ou 120 kW", "type":"DC", "headline":"Mais energia para o fluxo da sua operação.", "chips":["DC", "2 CCS2", "IP55"]},
    {"name":"CDZ-YE", "image":"cdz-ye.png", "category":"ELETROPOSTOS E GRANDES FLUXOS", "power":"60 kW, 80 kW ou 120 kW", "type":"DC", "headline":"Uma estação completa para crescer junto.", "chips":["DC", "2 CCS2", "4G"]},
]

if __name__ == "__main__":
    for product in products:
        create_post(product)
    print(f"Criados {len(products)} posts em {OUT}")
