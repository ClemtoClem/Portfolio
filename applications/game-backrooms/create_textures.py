import struct, zlib, os, random, math, argparse, sys

# --- FONCTIONS DE BASE ---

import struct
import zlib

def chunk(tag, data):
    return (
        struct.pack(">I", len(data)) +
        tag +
        data +
        struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    )

def png(filename, pixels):
    h = len(pixels)
    if h == 0:
        raise ValueError("Image vide")

    w = len(pixels[0])
    if w == 0:
        raise ValueError("Largeur nulle")

    # Vérifie que toutes les lignes ont la même largeur
    for row in pixels:
        if len(row) != w:
            raise ValueError("Toutes les lignes doivent avoir la même largeur")

    # Détecte si RGBA
    first = pixels[0][0]
    if len(first) not in (3, 4):
        raise ValueError("Les pixels doivent être RGB ou RGBA")

    has_alpha = len(first) == 4
    color_type = 6 if has_alpha else 2

    raw = bytearray()

    for row in pixels:
        raw.append(0)  # filtre PNG = None
        for px in row:
            if has_alpha:
                if len(px) == 3:
                    r, g, b = px
                    a = 255
                elif len(px) == 4:
                    r, g, b, a = px
                else:
                    raise ValueError("Pixel invalide")
                raw.extend((r, g, b, a))
            else:
                if len(px) < 3:
                    raise ValueError("Pixel RGB invalide")
                r, g, b = px[:3]
                raw.extend((r, g, b))

    data = b'\x89PNG\r\n\x1a\n'

    data += chunk(
        b'IHDR',
        struct.pack(">IIBBBBB", w, h, 8, color_type, 0, 0, 0)
    )

    data += chunk(b'IDAT', zlib.compress(bytes(raw), 9))
    data += chunk(b'IEND', b'')

    with open(filename, "wb") as f:
        f.write(data)

# --- OUTILS ---

def clamp(v):
    return max(0, min(255, int(v)))

def add_noise(r, g, b, a=255, amount=10):
    """Ajoute du grain aléatoire pour simuler la matière."""
    n = random.randint(-amount, amount)
    return [clamp(r + n), clamp(g + n), clamp(b + n), a]

# --- GÉNÉRATEURS DE TEXTURES ---

def solid(r,g,b,a, w=32,h=32):
    return [[[r,g,b,a]]*w for _ in range(h)]

def grid_tex(br, bg_, bb, ba, lr, lg, lb, la, step=8, noise=10, w=32, h=32):
    """Grille avec du bruit sur les dalles et les joints."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            if y % step == 0 or x % step == 0:
                row.append(add_noise(lr, lg, lb, la, noise)) # Jointure
            else:
                row.append(add_noise(br, bg_, bb, ba, noise)) # Dalle
        pix.append(row)
    return pix

def noisy_solid(r, g, b, a, noise=15, w=32, h=32):
    """Couleur unie avec du bruit (parfait pour tapis, béton brut)."""
    return [[add_noise(r, g, b, a, noise) for _ in range(w)] for _ in range(h)]

def carpet_texture(r, g, b, a, w=32, h=32):
    """Moquette avec du grain et quelques taches sombres (moisissure/saleté)."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            if random.random() < 0.03: # 3% de chance d'avoir une tache
                row.append(add_noise(r-50, g-50, b-50, a, 20))
            else:
                row.append(add_noise(r, g, b, a, 12))
        pix.append(row)
    return pix

def wallpaper_house(w=32,h=32):
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            if (x + y) % 16 < 2 or (x - y) % 16 < 2:
                row.append(add_noise(0xb8, 0x9a, 0x6a, 0xFF, 5))
            elif x % 8 > 2 and y % 8 > 2:
                row.append(add_noise(0xe0, 0xc8, 0x9a, 0xFF, 8))
            else:
                row.append(add_noise(0xd4, 0xb4, 0x83, 0xFF, 8))
        pix.append(row)
    return pix

def wallpaper_hotel(w=32,h=32):
    pix=[]
    for y in range(h):
        row=[]
        for x in range(w):
            row.append([0x9a,0x78,0x50,0xFF] if x%4<2 else [0x7a,0x5c,0x3a,0xFF])
        pix.append(row)
    return pix

def hospital_wall(w=32,h=32):
    pix=[]
    for y in range(h):
        row=[]
        for x in range(w):
            row.append([0xcc,0xcc,0xcc,0xFF] if y%8==0 or x%8==0 else [0xee,0xee,0xee,0xFF])
        pix.append(row)
    return pix

def pool_tile(w=32, h=32):
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            if y % 8 == 0 or x % 8 == 0:
                row.append(add_noise(0x66, 0xaa, 0xcc, 0xFF, 5)) # joints
            else:
                # Ajout de variations de lumière d'une dalle à l'autre
                tile_shade = ((x // 8) * 3 + (y // 8) * 7) % 15
                row.append(add_noise(0x88 - tile_shade, 0xcc - tile_shade, 0xee, 0xFF, 8))
        pix.append(row)
    return pix

def vent_tex(w=32,h=32):
    pix=[]
    for y in range(h):
        row=[]
        for x in range(w):
            on_border = x==0 or x==w-1 or y==0 or y==h-1
            on_bar = y%3==0
            row.append([0x44,0x44,0x44,0xB4] if on_border or on_bar else [0x88,0x88,0x88,0xFF])
        pix.append(row)
    return pix

def exit_sign(w=32,h=32):
    pix=[]
    for y in range(h):
        row=[]
        for x in range(w):
            if x==0 or x==w-1 or y==0 or y==h-1:
                row.append([0x00,0x66,0x00,0xFF])
            elif 4<=x<=11 and 6<=y<=10:
                row.append([0xff,0xff,0xff,0xFF])
            else:
                row.append([0x00,0x99,0x00,0xFF])
        pix.append(row)
    return pix

def lamp_tex(w=32,h=32):
    pix=[]
    for y in range(h):
        row=[]
        for x in range(w):
            cx,cy=abs(x-7),abs(y-7)
            if x==0 or x==w-1 or y==0 or y==h-1:
                row.append([0x88,0x88,0x88,0xFF])
            elif cx<5 and cy<3:
                row.append([0xff,0xff,0xcc,0xFF])
            else:
                row.append([0xcc,0xcc,0xbb,0xFF])
        pix.append(row)
    return pix

def asphalt(w=32, h=32):
    """L'asphalte réaliste est principalement du bruit de haute fréquence."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Grain très fort, de gris foncé à noir
            v = random.randint(30, 70)
            row.append([v, v, v, 0xFF])
        pix.append(row)
    return pix

def elevator_tex(w=32,h=32):
    pix=[]
    for y in range(h):
        row=[]
        for x in range(w):
            if x==0 or x==w-1 or y==0 or y==h-1:
                row.append([0x80,0x80,0x90,0xFF])
            elif 6<=x<=9 and 4<=y<=11:
                row.append([0x22,0xaa,0xff,0xFF])
            else:
                row.append([0xb0,0xb0,0xb8,0xFF])
        pix.append(row)
    return pix

def water_tileset(frames=4, w=32, h=32):
    """Génère un spritesheet horizontal d'eau animée et transparente."""
    total_w = w * frames
    pix = []
    for y in range(h):
        row = []
        for x in range(total_w):
            frame_idx = x // w
            local_x = x % w

            # Calcul de l'onde : on décale l'animation selon la frame
            offset = frame_idx * (math.pi * 2 / frames)
            wave = math.sin((local_x * 0.4) + (y * 0.3) + offset)

            # Couleur de base de l'eau (Bleu verdâtre foncé)
            r = 10
            g = 120 + int(30 * wave)
            b = 180 + int(40 * wave)
            a = 160 # Canal Alpha (160/255 = ~62% d'opacité, donc transparent)

            # Reflets écumeux sur les crêtes de la vague
            if wave > 0.7:
                # Éclaircit la couleur et augmente l'opacité
                r, g, b, a = 180, 230, 255, 200

            # On retourne 4 valeurs : [Rouge, Vert, Bleu, Alpha]
            row.append([clamp(r), clamp(g), clamp(b), clamp(a)])
        pix.append(row)
    return pix

def wood_texture(r, g, b, a=255, grain_density=0.5, wave_intensity=2.0, noise_amount=10, wave_distortion=0.25, w=32, h=32):
    """Génère une texture de bois organique avec des veines ondulées."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Distorsion sur l'axe Y pour faire "vagueller" les veines
            distortion = math.sin(y * wave_distortion) * wave_intensity
            
            # Onde principale sur l'axe X (les lignes du bois) combinée à la distorsion
            grain = math.sin((x + distortion) * grain_density)
            
            # Normaliser la valeur du grain (de -1..1 à 0..1)
            grain_normalized = (grain + 1) / 2.0
            
            # Assombrissement : les veines sont plus sombres que la couleur de base
            # Le facteur varie entre 0.6 (sombre) et 1.0 (couleur pure)
            factor = 0.6 + (0.4 * grain_normalized)
            
            cr = int(r * factor)
            cg = int(g * factor)
            cb = int(b * factor)
            
            # 5. Ajout du grain/bruit pour simuler la fibre rugueuse du bois
            row.append(add_noise(cr, cg, cb, a, noise_amount))
        pix.append(row)
    return pix

def elevator_cabin_wall(w=32, h=32):
    """Paroi intérieure : métal brossé avec rivets aux coins et filet horizontal."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Base métal brossé (légères stries horizontales)
            stripe = 1 if y % 4 < 1 else 0
            base_r = clamp(0xb0 - stripe * 12 + random.randint(-6, 6))
            base_g = clamp(0xb0 - stripe * 12 + random.randint(-6, 6))
            base_b = clamp(0xb8 - stripe * 10 + random.randint(-6, 6))

            # Bord cadre (1 px noir)
            if x == 0 or x == w-1 or y == 0 or y == h-1:
                row.append([0x30, 0x30, 0x35, 0xFF])
            # Filet horizontal au milieu
            elif y == h // 2:
                row.append([0x78, 0x78, 0x88, 0xFF])
            # Rivets aux quatre coins intérieurs
            elif (x in (2,3) or x in (w-4, w-3)) and (y in (2,3) or y in (h-4, h-3)):
                row.append([0xd0, 0xd0, 0xd8, 0xFF])
            else:
                row.append([base_r, base_g, base_b, 0xFF])
        pix.append(row)
    return pix

def elevator_cabin_door(w=32, h=32):
    """Face avant de la cabine : deux battants métalliques avec fente centrale."""
    pix = []
    center = w // 2
    for y in range(h):
        row = []
        for x in range(w):
            # Fente centrale (joint entre les deux battants)
            if abs(x - center) <= 1:
                row.append([0x18, 0x18, 0x20, 0xFF])
            # Bord extérieur
            elif x == 0 or x == w-1 or y == 0 or y == h-1:
                row.append([0x40, 0x40, 0x50, 0xFF])
            # Panneau des battants : métal avec reflets verticaux
            else:
                # Reflet vertical sur chaque battant
                dist_to_center = abs(x - center)
                half = (w - 2) // 2
                # Position normalisée dans le battant (0.0 = fente, 1.0 = bord)
                t = min(dist_to_center, half) / half
                # Reflet en cloche (plus brillant au centre du battant)
                bright = int(20 * math.exp(-((t - 0.35) ** 2) / 0.03))
                strie = 1 if y % 6 < 1 else 0
                r = clamp(0xa8 + bright - strie * 10 + random.randint(-4, 4))
                g = clamp(0xa8 + bright - strie * 10 + random.randint(-4, 4))
                b = clamp(0xb5 + bright - strie *  8 + random.randint(-4, 4))
                row.append([r, g, b, 0xFF])
        pix.append(row)
    return pix

def elevator_cabin_panel(w=32, h=32):
    """Panneau de contrôle : fond sombre avec boutons lumineux et afficheur de niveau."""
    pix = []
    # Couleurs
    C_BG      = [0x22, 0x22, 0x28]   # fond du panneau
    C_BEZEL   = [0x3a, 0x3a, 0x45]   # encadrement des boutons
    C_BTN_OFF = [0x55, 0x55, 0x60]   # bouton inactif
    C_BTN_ON  = [0x33, 0xcc, 0x55]   # bouton actif (vert)
    C_SCREEN  = [0x00, 0x22, 0x00]   # fond de l'afficheur
    C_TEXT    = [0x00, 0xff, 0x44]   # chiffre LED vert

    # Disposition : 2 colonnes × 3 rangées de boutons + afficheur en haut
    btn_positions = []
    for row_i in range(3):
        for col_i in range(2):
            bx = 5 + col_i * 11
            by = 14 + row_i * 5
            btn_positions.append((bx, by))

    for y in range(h):
        row = []
        for x in range(w):
            # Bordure panneau
            if x == 0 or x == w-1 or y == 0 or y == h-1:
                row.append(C_BEZEL + [0xFF])
            # Afficheur de niveau (haut du panneau)
            elif 3 <= x <= w-4 and 2 <= y <= 8:
                # Pixel de l'afficheur : simuler un "−5" en LED
                on_screen = (x == 5 and y == 5)   # trait du tiret
                if on_screen:
                    row.append(C_TEXT + [0xFF])
                else:
                    row.append(C_SCREEN + [0xFF])
            # Boutons
            elif any(bx <= x <= bx+6 and by <= y <= by+3 for bx, by in btn_positions):
                # Quel bouton ? Premier bouton allumé (bas = niveau à atteindre)
                is_active = (x <= 5+6 and y <= 14+3)
                btn_col = C_BTN_ON if is_active else C_BTN_OFF
                row.append(btn_col + [0xFF])
            else:
                row.append(C_BG + [0xFF])
        pix.append(row)
    return pix

def elevator_cabin_top(w=32, h=32):
    """Plafond de cabine : métal avec lampe centrale rayonnante."""
    pix = []
    cx, cy = w // 2, h // 2
    for y in range(h):
        row = []
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)

            # Lampe centrale (disque de 5 px de rayon)
            if dist < 5:
                glow = int(255 * (1 - dist / 5.0))
                row.append([clamp(0xdd + glow//3), clamp(0xdd + glow//3), clamp(0xbb + glow//2), 0xFF])
            # Halo de la lampe (5..10 px)
            elif dist < 10:
                t = (dist - 5) / 5.0
                v = int(0xaa * (1 - t))
                row.append([clamp(0xb0 + v//4), clamp(0xb0 + v//4), clamp(0xb8 + v//3), 0xFF])
            # Bord cadre
            elif x == 0 or x == w-1 or y == 0 or y == h-1:
                row.append([0x30, 0x30, 0x38, 0xFF])
            # Plafond métal brossé (stries concentriques légères)
            else:
                ring = int(dist) % 4
                stripe_v = 8 if ring < 1 else 0
                r = clamp(0x98 - stripe_v + random.randint(-5, 5))
                g = clamp(0x98 - stripe_v + random.randint(-5, 5))
                b = clamp(0xa0 - stripe_v + random.randint(-5, 5))
                row.append([r, g, b, 0xFF])
        pix.append(row)
    return pix

def elevator_particle(w=8, h=8):
    """Particule d'ascenseur : petit carré doré avec bords transparents."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            cx2, cy2 = abs(x - w//2), abs(y - h//2)
            if cx2 <= 2 and cy2 <= 2:
                t = max(cx2, cy2) / 2.0
                a = int(255 * (1 - t * 0.5))
                row.append([0xff, clamp(0xcc + random.randint(-20,20)), 0x44, a])
            else:
                row.append([0, 0, 0, 0])
        pix.append(row)
    return pix

def elevator_rail_side(w=32, h=32):
    """Rail latéral : poutre en acier brossé avec guide horizontal."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Corps principal de la poutre (zone gauche, 0..9 px)
            in_beam = (x < 10)
            # Guides horizontaux (bandes transversales) tous les 8 px
            on_guide = (y % 8 < 2)
            if in_beam:
                if on_guide:
                    # Guide : acier plus clair
                    v = clamp(0xc0 + random.randint(-8, 8))
                    row.append([v, v, clamp(v + 8), 0xFF])
                else:
                    # Poutre : acier brossé avec stries verticales
                    stripe = 12 if (x % 4 < 2) else 0
                    v = clamp(0x88 + stripe + random.randint(-6, 6))
                    row.append([v, v, clamp(v + 10), 0xFF])
            elif x < 16 and on_guide:
                # Extension horizontale du guide
                v = clamp(0xaa + random.randint(-6, 6))
                row.append([v, v, clamp(v + 8), 0xFF])
            else:
                row.append([0, 0, 0, 0])  # transparent
        pix.append(row)
    return pix

def elevator_rail_face(w=32, h=32):
    """Face avant du rail : profil en U avec boulons."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Profil en U (0..4 et 28..31 px en x, ou 0..2 en y par bande)
            left_flange  = (x < 5)
            right_flange = (x > 26)
            web          = (y % 8 < 2)  # âme (bande horizontale)
            # Boulons tous les 8 px
            is_bolt = (abs(x - 2) < 2 and y % 8 == 4) or \
                      (abs(x - 29) < 2 and y % 8 == 4)
            if is_bolt:
                row.append([0x60, 0x60, 0x70, 0xFF])
            elif left_flange or right_flange:
                v = clamp(0x90 + random.randint(-8, 8))
                row.append([v, v, clamp(v + 12), 0xFF])
            elif web:
                v = clamp(0xb0 + random.randint(-6, 6))
                row.append([v, v, clamp(v + 8), 0xFF])
            else:
                row.append([0, 0, 0, 0])
        pix.append(row)
    return pix

def elevator_rail_top(w=32, h=32):
    """Vue de dessus du rail : section transversale en acier."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            in_section = (x < 10) or (x > 21)
            in_web     = (4 < x < 27) and (13 < y < 18)
            if in_section:
                v = clamp(0x88 + random.randint(-8, 8))
                row.append([v, v, clamp(v + 12), 0xFF])
            elif in_web:
                v = clamp(0x70 + random.randint(-6, 6))
                row.append([v, v, clamp(v + 10), 0xFF])
            else:
                row.append([0, 0, 0, 0])
        pix.append(row)
    return pix

def elevator_cable(w=32, h=32):
    """Câble tressé : torons métalliques torsadés."""
    pix = []
    cx = w // 2
    for y in range(h):
        row = []
        for x in range(w):
            dx = x - cx
            # Rayon du câble : 3 px
            # Torsion : les torons tournent de 360° sur 12 px de hauteur
            angle = (y / 12.0) * 2 * math.pi
            # Centre du toron principal
            tc1x = int(math.cos(angle) * 2)
            tc2x = int(math.cos(angle + math.pi) * 2)
            tc3x = int(math.cos(angle + 2*math.pi/3) * 2)

            dist_main   = abs(dx - tc1x)
            dist_sec1   = abs(dx - tc2x)
            dist_sec2   = abs(dx - tc3x)
            dist_center = abs(dx)

            if dist_center < 4:
                if dist_main < 2:
                    # Toron principal : acier brillant
                    v = clamp(0xcc + random.randint(-10, 10))
                    row.append([v, v, clamp(v + 8), 0xFF])
                elif dist_sec1 < 2 or dist_sec2 < 2:
                    # Torons secondaires
                    v = clamp(0xaa + random.randint(-8, 8))
                    row.append([v, v, clamp(v + 10), 0xFF])
                else:
                    # Ombre entre torons
                    v = clamp(0x55 + random.randint(-6, 6))
                    row.append([v, v, v, 0xFF])
            else:
                row.append([0, 0, 0, 0])  # transparent autour du câble
        pix.append(row)
    return pix

def elevator_cable_top(w=32, h=32):
    """Vue de dessus du câble : section circulaire tressée."""
    pix = []
    cx, cy = w // 2 - 0.5, h // 2 - 0.5
    for y in range(h):
        row = []
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            angle = math.atan2(dy, dx)
            if dist < 4:
                # Torons en section circulaire
                sector = int((angle + math.pi) / (math.pi / 3)) % 6
                base = 0xcc if sector % 2 == 0 else 0xaa
                v = clamp(base + random.randint(-10, 10))
                row.append([v, v, clamp(v + 8), 0xFF])
            else:
                row.append([0, 0, 0, 0])
        pix.append(row)
    return pix

def elevator_motor_top(w=32, h=32):
    """Dessus du moteur : boîtier industriel avec ventilation."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Grille de ventilation (fentes horizontales)
            on_vent = (2 < x < 29 and y % 5 < 2 and 2 < y < 29)
            on_edge = (x < 2 or x > 29 or y < 2 or y > 29)
            if on_edge:
                row.append([0x40, 0x40, 0x48, 0xFF])  # cadre sombre
            elif on_vent:
                row.append([0x20, 0x20, 0x28, 0xFF])  # fente noire
            else:
                v = clamp(0x70 + random.randint(-8, 8))
                row.append([v, v, clamp(v + 8), 0xFF])
        pix.append(row)
    return pix

def elevator_motor_bottom(w=32, h=32):
    """Dessous du moteur : poulie et point d'attache du câble."""
    pix = []
    cx, cy = w // 2, h // 2
    for y in range(h):
        row = []
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            # Poulie centrale (anneau)
            if 5 < dist < 10:
                v = clamp(0x90 + random.randint(-8, 8))
                row.append([v, v, clamp(v + 10), 0xFF])
            elif dist < 5:
                # Axe central
                v = clamp(0x50 + random.randint(-5, 5))
                row.append([v, v, v, 0xFF])
            else:
                v = clamp(0x68 + random.randint(-6, 6))
                row.append([v, v, clamp(v + 8), 0xFF])
        pix.append(row)
    return pix

def elevator_motor_side(w=32, h=32):
    """Côté du moteur : caisse industrielle avec boulons et plaque de données."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            on_edge  = (x < 2 or x > 29 or y < 2 or y > 29)
            is_bolt  = ((x in [3, 28]) and (y in [3, 28]))
            # Plaque de données (rectangle en bas à droite)
            on_plate = (18 < x < 30 and 20 < y < 30)
            if on_edge:
                row.append([0x38, 0x38, 0x40, 0xFF])
            elif is_bolt:
                row.append([0x80, 0x80, 0x90, 0xFF])
            elif on_plate:
                row.append([0x22, 0x44, 0x22, 0xFF])  # plaque verte
            else:
                v = clamp(0x62 + random.randint(-8, 8))
                row.append([v, v, clamp(v + 10), 0xFF])
        pix.append(row)
    return pix

def elevator_motor_front(w=32, h=32):
    """Face avant du moteur : ventilateur centrifuge visible."""
    pix = []
    cx, cy = w // 2, h // 2
    for y in range(h):
        row = []
        for x in range(w):
            dx, dy = x - cx, y - cy
            dist  = math.sqrt(dx*dx + dy*dy)
            angle = math.atan2(dy, dx)
            # Carter circulaire
            on_edge = (x < 2 or x > 29 or y < 2 or y > 29)
            if on_edge:
                row.append([0x38, 0x38, 0x40, 0xFF])
            elif dist > 13:
                v = clamp(0x60 + random.randint(-6, 6))
                row.append([v, v, clamp(v + 8), 0xFF])
            elif dist < 3:
                # Moyeu central
                row.append([0x30, 0x30, 0x38, 0xFF])
            else:
                # Pales du ventilateur (8 pales)
                blade_angle = (angle + math.pi) % (math.pi / 4)
                on_blade = (blade_angle < 0.12) and (dist < 13)
                if on_blade:
                    v = clamp(0xa0 + random.randint(-8, 8))
                    row.append([v, v, clamp(v + 12), 0xFF])
                else:
                    v = clamp(0x48 + random.randint(-6, 6))
                    row.append([v, v, clamp(v + 8), 0xFF])
        pix.append(row)
    return pix

# --- TEXTURES DU PERSONNAGE ---
# Toutes les textures du personnage sont générées en blanc + variations
# de luminance (≤ 255) afin d'être teintées côté JS via le MeshBasicMaterial.
# Ainsi la même texture sert pour toute la palette de couleurs choisie par
# l'utilisateur dans l'éditeur de personnage.

def _white_noise(amount=10, w=32, h=32):
    """Surface blanche avec un grain doux : base universelle teintable."""
    pix = []
    for _ in range(h):
        row = []
        for _ in range(w):
            n = random.randint(-amount, amount)
            v = clamp(240 + n)
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_skin(w=32, h=32):
    """Peau : grain fin + quelques taches plus sombres (grain de peau, taches de rousseur)."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            v = clamp(240 + random.randint(-12, 12))
            # Petites taches plus sombres réparties aléatoirement.
            if random.random() < 0.02:
                v = clamp(v - 35)
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_skin_face(w=32, h=32):
    """Variante face : zones d'ombre sous les yeux + cernes légers."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            v = clamp(240 + random.randint(-12, 12))
            # Cernes sous les yeux (deux taches symétriques en haut).
            if (6 <= y <= 9) and ((6 <= x <= 11) or (20 <= x <= 25)):
                v = clamp(v - 30)
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_hair(w=32, h=32):
    """Cheveux : fines bandes verticales (mèches) en blanc tintable."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Une "mèche" tous les 2-3 pixels.
            strand_intensity = (math.sin(x * 1.7) + math.cos(x * 0.7)) * 18
            v = clamp(240 + int(strand_intensity) + random.randint(-6, 6))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_beard(w=32, h=32):
    """Barbe : poils courts plus contrastés et grain plus marqué que les cheveux."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            v = clamp(240 + random.randint(-30, 10))
            # Quelques "poils" plus sombres.
            if random.random() < 0.18:
                v = clamp(v - 40)
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_fabric(w=32, h=32):
    """Tissu tissé (chemise / haut) : motif damier 1×1 doux."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            # Trame entrecroisée : pair-pair sombre / impair-impair clair.
            base = 245 if (x + y) % 2 == 0 else 230
            v = clamp(base + random.randint(-8, 8))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_jeans(w=32, h=32):
    """Denim : diagonales nettes — typique du tissage twill du jeans."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            twill = 18 if (x - y) % 3 == 0 else 0
            v = clamp(230 - twill + random.randint(-6, 6))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_leather(w=32, h=32):
    """Cuir des chaussures : grain irrégulier en cellules de Voronoï bon marché."""
    pix = []
    # Quelques centres pour simuler des pores.
    centers = [(random.randint(0, w - 1), random.randint(0, h - 1)) for _ in range(14)]
    for y in range(h):
        row = []
        for x in range(w):
            d = min(((x - cx) ** 2 + (y - cy) ** 2) for cx, cy in centers)
            v = clamp(240 - int(min(40, d * 1.3)))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_eye(w=32, h=32):
    """Œil : sclère blanche + iris coloré (sera teinté par la couleur des yeux)
    + pupille noire centrale. Note: l'iris est en blanc neutre, la teinte
    finale vient du paramètre `eyeColor` côté JS."""
    pix = []
    cx, cy = w // 2, h // 2
    for y in range(h):
        row = []
        for x in range(w):
            d = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            if d < 3:
                # Pupille
                row.append([20, 20, 20, 255])
            elif d < 9:
                # Iris (sera teinté)
                v = clamp(200 - int(d * 6))
                row.append([v, v, v, 255])
            else:
                # Sclère blanche
                row.append([245, 245, 245, 255])
        pix.append(row)
    return pix


def char_glasses(w=32, h=32):
    """Verres de lunettes : centre transparent, contour foncé. Lit deux types
    selon paramètre `shape`: 'round' ou 'square'."""
    def _gen(shape='round'):
        pix = []
        cxL, cxR = 9, 22
        cy = 16
        rad = 6
        for y in range(h):
            row = []
            for x in range(w):
                if shape == 'round':
                    dL = math.sqrt((x - cxL) ** 2 + (y - cy) ** 2)
                    dR = math.sqrt((x - cxR) ** 2 + (y - cy) ** 2)
                    on_frame_L = abs(dL - rad) < 1
                    on_frame_R = abs(dR - rad) < 1
                    inside_L = dL < rad
                    inside_R = dR < rad
                else:
                    on_frame_L = (cxL - rad <= x <= cxL + rad) and (abs(y - cy) == rad or abs(x - cxL) == rad)
                    on_frame_R = (cxR - rad <= x <= cxR + rad) and (abs(y - cy) == rad or abs(x - cxR) == rad)
                    inside_L = (cxL - rad < x < cxL + rad) and (cy - rad < y < cy + rad)
                    inside_R = (cxR - rad < x < cxR + rad) and (cy - rad < y < cy + rad)

                on_bridge = (cxL + rad <= x <= cxR - rad) and (cy - 1 <= y <= cy + 1)
                if on_frame_L or on_frame_R or on_bridge:
                    row.append([30, 30, 30, 255])
                elif inside_L or inside_R:
                    # Verre lui-même légèrement opaque.
                    row.append([200, 220, 240, 80])
                else:
                    row.append([0, 0, 0, 0])
            pix.append(row)
        return pix
    return _gen


def char_cap_fabric(w=32, h=32):
    """Tissu fin pour casquette : tissage serré + petite couture diagonale."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            base = 240 if (x + y) % 2 == 0 else 232
            # Une couture en diagonale.
            if abs((x - y) % 16) < 1:
                base -= 25
            v = clamp(base + random.randint(-5, 5))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_beanie_knit(w=32, h=32):
    """Maille tricotée : motif en V répété (typique d'un bonnet)."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            local_x = x % 4
            local_y = y % 4
            v_base = 245
            # Les "V" du tricot : valeur plus sombre en bordure de maille.
            if local_y == 0 or local_y == 3 or local_x == 0 or local_x == 3:
                v_base -= 25
            v = clamp(v_base + random.randint(-6, 6))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


def char_felt(w=32, h=32):
    """Feutre (chapeau à large bord) : grain doux plus chaud."""
    pix = []
    for y in range(h):
        row = []
        for x in range(w):
            v = clamp(225 + random.randint(-14, 14))
            row.append([v, v, v, 255])
        pix.append(row)
    return pix


# --- GÉNÉRATION ---

out = "./textures"
os.makedirs(out, exist_ok=True)

textures_map = {
    "backrooms_house_wallpaper":        ( wallpaper_house, (), {}),
    "backrooms_house_carpet":           ( carpet_texture, (0xc8,0xb0,0x78,0xFF), {}),
    "backrooms_house_ceil":             ( grid_tex, (0xe8,0xe0,0xc8,0xFF, 0xcc,0xc4,0xaa,0xFF), {"step":16}),
    "backrooms_baseboard":              ( carpet_texture, (0x8b,0x73,0x55,0xFF), {}),
    "backrooms_hotel_wallpaper":        ( wallpaper_hotel, (), {}),
    "backrooms_hotel_carpet":           ( carpet_texture, (0x8b,0x00,0x00,0xFF), {}),
    "backrooms_hotel_ceil":             ( grid_tex, (0xf0,0xe8,0xd8,0xFF, 0xcc,0xc0,0xb0,0xFF), {}),
    "backrooms_light_wood":             ( wood_texture, (200, 160, 110, 0xFF), {"grain_density":0.6, "wave_intensity":1.0}),
    "backrooms_dark_wood":              ( wood_texture, (80, 50, 35, 0xFF), {"grain_density":0.8, "wave_intensity":1.5, "noise_amount":8}),
    "backrooms_mahogany":               ( wood_texture, (120, 40, 30, 0xFF), {"grain_density":0.8, "wave_intensity":1.5, "noise_amount":15}),
    "backrooms_hospital_wall":          ( hospital_wall, (), {}),
    "backrooms_hospital_floor":         ( grid_tex, (0xf0,0xf0,0xf0,0xFF, 0xcc,0xcc,0xcc,0xFF), {"step":16, "noise":5}),
    "backrooms_hospital_ceil":          ( grid_tex, (0xf8,0xf8,0xf8,0xFF, 0xcc,0xcc,0xcc,0xFF), {}),
    "backrooms_blue_tile":              ( solid, (0x44,0x88,0xcc,0xFF), {}),
    "backrooms_concrete":               ( noisy_solid, (120, 120, 120,0xFF), {"noise":25}),
    "backrooms_concrete_dark":          ( noisy_solid, (70, 70, 70,0xFF), {"noise":25}),
    "backrooms_asphalt":                ( asphalt, (), {}),
    "backrooms_road_line":              ( solid, (0xff,0xff,0x00,0xFF), {}),
    "backrooms_pool_tile":              ( pool_tile, (), {}),
    #"backrooms_pool_water_animated":   ( water_tileset, (), {frames:4, w:32, h:32}),
    "backrooms_pool_floor":             ( solid, (0x55,0xaa,0xcc,0xFF), {}),
    "backrooms_lamp":                   ( lamp_tex, (), {}),
    "backrooms_exit_sign":              ( exit_sign, (), {}),
    "backrooms_ventilation":            ( vent_tex, (), {}),
    "backrooms_elevator":               ( elevator_tex, (), {}),
    "backrooms_scaffold":               ( grid_tex, (0x80,0x60,0x30,0xFF, 0x50,0x38,0x18,0xFF), {"step":4}),
    "backrooms_parking_mark":           ( solid, (0xff,0xff,0x00,0xFF), {}),
    "backrooms_pillar":                 ( grid_tex, (0x77,0x77,0x77,0xFF, 0x55,0x55,0x55,0xFF), {"step":4}),
    "backrooms_outer":                  ( solid, (0x10,0x10,0x10,0xFF), {}),
    "backrooms_elevator_cabin_wall":    ( elevator_cabin_wall,  (), {}),
    "backrooms_elevator_cabin_door":    ( elevator_cabin_door,  (), {}),
    "backrooms_elevator_cabin_panel":   ( elevator_cabin_panel, (), {}),
    "backrooms_elevator_cabin_top":     ( elevator_cabin_top,   (), {}),
    "backrooms_elevator_particle":      ( elevator_particle,    (), {}),
    "backrooms_elevator_rail_side":     ( elevator_rail_side,   (), {}),
    "backrooms_elevator_rail_face":     ( elevator_rail_face,   (), {}),
    "backrooms_elevator_rail_top":      ( elevator_rail_top,    (), {}),
    "backrooms_elevator_cable":         ( elevator_cable,       (), {}),
    "backrooms_elevator_cable_top":     ( elevator_cable_top,   (), {}),
    "backrooms_elevator_motor_top":     ( elevator_motor_top,   (), {}),
    "backrooms_elevator_motor_bottom":  ( elevator_motor_bottom,(), {}),
    "backrooms_elevator_motor_side":    ( elevator_motor_side,  (), {}),
    "backrooms_elevator_motor_front":   ( elevator_motor_front, (), {}),

    # ── Textures du personnage (toutes blanches : teintées côté JS) ──
    "backrooms_char_skin":              ( char_skin,         (), {}),
    "backrooms_char_skin_face":         ( char_skin_face,    (), {}),
    "backrooms_char_hair":              ( char_hair,         (), {}),
    "backrooms_char_beard":             ( char_beard,        (), {}),
    "backrooms_char_fabric":            ( char_fabric,       (), {}),
    "backrooms_char_jeans":             ( char_jeans,        (), {}),
    "backrooms_char_leather":           ( char_leather,      (), {}),
    "backrooms_char_eye":               ( char_eye,          (), {}),
    # Lunettes : version ronde par défaut, mais le générateur expose aussi
    # une variante carrée (appel direct au callback retourné).
    "backrooms_char_glasses_round":     ( lambda: char_glasses()('round'),  (), {}),
    "backrooms_char_glasses_square":    ( lambda: char_glasses()('square'), (), {}),
    "backrooms_char_cap":               ( char_cap_fabric,   (), {}),
    "backrooms_char_beanie":            ( char_beanie_knit,  (), {}),
    "backrooms_char_felt":              ( char_felt,         (), {}),
}

def main():
    available_names = sorted(textures_map.keys())

    parser = argparse.ArgumentParser(
        description="Générateur de textures procédurales pour les Backrooms.",
        formatter_class=argparse.RawTextHelpFormatter,
        epilog=f"Textures disponibles : {', '.join(available_names)}"
    )
    
    parser.add_argument(
        "--all", action="store_true", help="Génère TOUTES les textures disponibles."
    )
    parser.add_argument(
        "--names", nargs="*", help="Noms des textures spécifiques à générer (ex: backrooms_concrete)."
    )
    parser.add_argument(
        "--out", default="./textures", help="Dossier de sortie (défaut: ./textures)."
    )

    args = parser.parse_args()

    # Si aucun argument n'est fourni, on affiche l'aide
    if len(sys.argv) == 1:
        parser.print_help()
        return

    to_generate = []
    if args.all:
        to_generate = available_names
    else:
        # On vérifie que les noms demandés existent
        for name in args.names:
            if name in textures_map:
                to_generate.append(name)
            else:
                print(f"⚠️ Attention : La texture '{name}' n'existe pas.")

    if not to_generate:
        print("❌ Aucune texture valide à générer.")
        return

    os.makedirs(args.out, exist_ok=True)
    for name in to_generate:
        print(f"🔨 Génération de {name}.png...")
        callback, f_args, f_kwargs = textures_map[name]
        pixels = callback(*f_args, **f_kwargs)
        png(os.path.join(args.out, f"{name}.png"), pixels)

    print(f"\n✅ Terminé ! {len(to_generate)} fichier(s) dans '{args.out}'.")

if __name__ == "__main__":
    main()
