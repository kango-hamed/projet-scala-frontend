# Flup — Design System
> Extrait du dashboard Flup · Prêt pour Antigravity

---

## 1. Couleurs

### Palette principale

| Token | Valeur | Usage |
|-------|--------|-------|
| `--accent` | `#22c993` | CTA, états actifs, icônes primaires |
| `--accent-light` | `#e6faf3` | Fond hover actif, badges positifs bg |
| `--bg` | `#f0f2f5` | Fond global de l'app |
| `--surface` | `#ffffff` | Cards, panels, modals |
| `--sidebar-narrow` | `#f7f8fa` | Rail d'icônes |
| `--sidebar-wide` | `#ffffff` | Sidebar élargie |
| `--border` | `#e5e7eb` | Séparateurs, bordures de cards |

### Texte

| Token | Valeur | Usage |
|-------|--------|-------|
| `--text-primary` | `#111827` | Titres, valeurs |
| `--text-secondary` | `#6b7280` | Labels, sous-titres |
| `--text-muted` | `#9ca3af` | Section labels, placeholders |

### Sémantique

| Token | Valeur | Usage |
|-------|--------|-------|
| `--green` | `#16a34a` | Badge positif (texte) |
| `--green-bg` | `#dcfce7` | Badge positif (fond) |
| `--red` | `#dc2626` | Badge négatif (texte) |
| `--red-bg` | `#fee2e2` | Badge négatif (fond) |

### Data viz (graphiques)

```
Violet indigo  #6366f1   → Gross margin / série 1
Ambre          #f59e0b   → Revenue / série 2
Violet léger   #8b5cf6   → Living room / catégorie 1
Cyan           #06b6d4   → Kids / catégorie 2
Emeraude       #10b981   → Bedroom
Rose           #ec4899   → Bathroom / Romania
Rouge          #ef4444   → Dining room / Germany
Orange         #f97316   → Decor
Lime           #84cc16   → Lighting / Ukraine
Accent vert    #22c993   → Outdoor / Austria
```

---

## 2. Typographie

| Rôle | Famille | Poids | Taille |
|------|---------|-------|--------|
| Font principale | `DM Sans` | 300 / 400 / 500 / 600 / 700 | — |
| Monospace (chiffres) | `DM Mono` | 400 / 500 | 12px |
| Titre de page (h1) | DM Sans | 700 | 26px, letter-spacing: -0.4px |
| Titre de section | DM Sans | 700 | 16px |
| KPI valeur | DM Sans | 700 | 22px, letter-spacing: -0.5px |
| KPI label | DM Sans | 500 | 12px |
| Body / nav item | DM Sans | 500 | 13.5px |
| Section label sidebar | DM Sans | 700 | 10px, letter-spacing: 0.1em, uppercase |
| Légende graphique | DM Sans | 500 | 12px |
| Badge | DM Sans | 600 | 11px |
| Monospace data | DM Mono | — | 12px |

```css
/* Import Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
```

---

## 3. Espacement & Layout

```
Grille principale     : padding 28px 32px
Gap entre sections    : 22px
Gap entre cards KPI   : 14px
Gap bottom row        : 18px
Card padding          : 18px 20px (KPI) / 22px 24px (chart)
Sidebar icon rail     : width 64px
Sidebar wide          : width 200px
```

---

## 4. Border Radius

| Composant | Valeur |
|-----------|--------|
| `--radius` (cards) | `14px` |
| Boutons, badges | `100px` (pill) |
| Avatars | `50%` |
| Logo sidebar | `10px` |
| Icône rail | `10px` |
| Sidebar item hover | `0` (pleine largeur) |
| Barres de chart | `4px` |
| Toggle | `10px` |

---

## 5. Ombres

```css
--shadow: 0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);

/* Tooltip / dropdown */
box-shadow: 0 4px 20px rgba(0,0,0,.10);
```

---

## 6. Composants

### KPI Card
```
- Border: 1px solid var(--border)
- Radius: 14px
- Shadow: --shadow
- Hover: translateY(-2px) avec transition 0.2s
- Structure: label (icon + texte) → valeur → badge
```

### Badge
```
- Positif : bg #dcfce7, color #16a34a, "↑ X%"
- Négatif : bg #fee2e2, color #dc2626, "↓ X%"
- Padding: 2px 7px, border-radius: 100px
- Font: 11px, weight 600
```

### Sidebar Item
```
- Padding: 8px 16px
- Active: bg var(--accent-light), color var(--accent), weight 600
- Hover: bg var(--bg), color var(--text-primary)
- Transition: background 0.12s, color 0.12s
- Icon: 16x16px, gap: 10px
```

### Button (Time period)
```
- Border: 1px solid var(--border)
- Background: var(--surface)
- Border-radius: 10px
- Padding: 8px 14px
- Font: 13px, weight 500
- Shadow: --shadow
- Icône calendrier + chevron
```

### Add Data Card (dashed)
```
- Border: 1px dashed var(--border)
- Background: transparent
- Hover: border-color var(--accent), color var(--accent), bg var(--accent-light)
- Flex: 0 0 120px (taille fixe dans la row KPI)
```

### Avatar
```
- Taille: 36px (rail) / 32px (sidebar footer)
- Border-radius: 50%
- Gradient: linear-gradient(135deg, #6366f1, #a78bfa)
- Initiales en blanc, weight 700
```

### Toggle (Dark mode)
```
- Taille: 36px × 20px, radius 10px
- Background: var(--border)
- Knob: 14px, blanc, top/left: 3px
- Transition: transform 0.2s
```

---

## 7. Graphiques (Chart.js config)

### Bar chart
```js
{
  barPercentage: 0.45,
  borderRadius: 4,
  colors: ['#6366f1', '#f59e0b'],
  grid: { color: '#f3f4f6' },
  ticks: { color: '#9ca3af', fontSize: 11 },
  tooltip: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    titleColor: '#111827',
    bodyColor: '#6b7280'
  }
}
```

### Donut chart
```js
{
  cutout: '62%',
  borderWidth: 2,
  borderColor: '#ffffff',
  hoverOffset: 6
}
```

---

## 8. CSS Variables — Fichier de base

```css
:root {
  /* Surfaces */
  --bg: #f0f2f5;
  --surface: #ffffff;
  --sidebar-narrow: #f7f8fa;
  --sidebar-wide: #ffffff;

  /* Accent */
  --accent: #22c993;
  --accent-light: #e6faf3;

  /* Texte */
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;

  /* Bordures */
  --border: #e5e7eb;

  /* Sémantique */
  --success: #16a34a;
  --success-bg: #dcfce7;
  --danger: #dc2626;
  --danger-bg: #fee2e2;

  /* Mise en page */
  --radius: 14px;
  --shadow: 0 1px 4px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04);
}
```

---

## 9. Responsive

| Breakpoint | Comportement |
|------------|--------------|
| `< 900px` | Wide sidebar masquée |
| `< 900px` | Bottom row passe en 1 colonne |
| Rail d'icônes | Toujours visible |

---

## 10. Principes de design

- **Minimal & propre** — beaucoup de blanc, ombres très douces
- **Accent unique** — vert `#22c993` comme seule couleur signature
- **Densité contrôlée** — pas d'information inutile, hiérarchie claire
- **Micro-interactions légères** — hover translateY, transitions 0.12–0.2s
- **Data en monospace** — les pourcentages et chiffres critiques en DM Mono
- **Couleurs data distinctes** — 10 couleurs uniques, jamais répétées dans un même graphique
