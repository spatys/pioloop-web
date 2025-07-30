# Composant BoutonLink

Un composant Link réutilisable avec les styles de bouton pour l'application Pioloop.

## Utilisation

```tsx
import { BoutonLink } from '@/components/ui/BoutonLink';

// Bouton lien simple
<BoutonLink href="/propose-property">Je propose mon bien</BoutonLink>

// Bouton lien avec variante et taille
<BoutonLink href="/register" variant="default" size="lg">
  Démarrer mon inscription
</BoutonLink>
```

## Variantes disponibles

### `variant`
- **`default`** - Bouton principal purple (par défaut)
- **`secondary`** - Bouton gris secondaire
- **`outline`** - Bouton avec bordure

### `size`
- **`xs`** - Très petit (h-7 px-2 py-1 text-xs)
- **`sm`** - Petit (h-8 px-3 py-1.5 text-xs)
- **`default`** - Taille normale (h-10 px-4 py-2)
- **`md`** - Moyen (h-11 px-5 py-2.5)
- **`lg`** - Grand (h-12 px-6 py-3 text-base)
- **`xl`** - Très grand (h-14 px-8 py-4 text-lg)

### `fullWidth`
- **`true`** - Bouton prend toute la largeur disponible
- **`false`** - Largeur automatique (par défaut)

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `variant` | string | `'default'` | Style du bouton |
| `size` | string | `'default'` | Taille du bouton |
| `fullWidth` | boolean | `false` | Largeur complète |
| `href` | string | **requis** | Lien de navigation |
| `children` | ReactNode | - | Contenu du bouton |
| `className` | string | `''` | Classes CSS supplémentaires |

## Exemples d'utilisation

### Bouton lien principal (comme dans le header)
```tsx
<BoutonLink href="/propose-property" variant="default" size="md">
  Je propose mon bien
</BoutonLink>
```

### Bouton lien d'inscription (comme dans le Hero)
```tsx
<BoutonLink href="/register" variant="default" size="lg">
  Démarrer mon inscription
</BoutonLink>
```

### Bouton lien secondaire
```tsx
<BoutonLink href="/properties" variant="secondary">
  Voir les logements
</BoutonLink>
```

### Bouton lien outline
```tsx
<BoutonLink href="/contact" variant="outline" size="sm">
  Contact
</BoutonLink>
```

### Bouton lien plein largeur
```tsx
<BoutonLink href="/login" variant="default" fullWidth>
  Se connecter
</BoutonLink>
```

## Différence avec le composant Button

- **BoutonLink** : Composant Link avec styles de bouton (toujours un lien)
- **Button** : Composant button classique (peut être un lien ou un bouton)

## Styles CSS

Le composant utilise Tailwind CSS avec les couleurs suivantes :
- **Purple** : `purple-600` / `purple-700` (couleur principale - default)
- **Gray** : `gray-200` / `gray-300` / `gray-700` / `gray-900` (secondary et outline)

Tous les boutons ont des transitions fluides et des états de focus accessibles. 