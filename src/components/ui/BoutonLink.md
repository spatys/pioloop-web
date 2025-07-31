# BoutonLink Component

Un composant Link stylisé comme un bouton avec des variantes et tailles configurables.

## Utilisation

```tsx
import { BoutonLink } from '@/components/ui/BoutonLink';

// Utilisation basique
<BoutonLink href="/register" variant="default" size="md">
  Démarrer mon inscription
</BoutonLink>

// Avec variante outline
<BoutonLink href="/properties" variant="outline" size="lg">
  Découvrir les logements
</BoutonLink>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `href` | `string` | **requis** | L'URL de destination |
| `variant` | `'default' \| 'secondary' \| 'outline'` | `'default'` | Le style du bouton |
| `size` | `'xs' \| 'sm' \| 'default' \| 'md' \| 'lg' \| 'xl'` | `'default'` | La taille du bouton |
| `fullWidth` | `boolean` | `false` | Si le bouton doit prendre toute la largeur |
| `className` | `string` | `''` | Classes CSS supplémentaires |
| `children` | `React.ReactNode` | **requis** | Le contenu du bouton |

## Variantes

### Default
Bouton principal avec fond violet et texte blanc.

```tsx
<BoutonLink href="/register" variant="default">
  Démarrer mon inscription
</BoutonLink>
```

### Secondary
Bouton secondaire avec fond gris.

```tsx
<BoutonLink href="/about" variant="secondary">
  En savoir plus
</BoutonLink>
```

### Outline
Bouton avec bordure et fond transparent.

```tsx
<BoutonLink href="/properties" variant="outline">
  Découvrir les logements
</BoutonLink>
```

## Tailles

- `xs`: Très petit (h-7, px-2)
- `sm`: Petit (h-8, px-3)
- `default`: Taille normale (h-10, px-4)
- `md`: Moyen (h-11, px-5)
- `lg`: Grand (h-12, px-6)
- `xl`: Très grand (h-14, px-8)

## Exemples

```tsx
// Bouton principal large
<BoutonLink href="/register" variant="default" size="lg" fullWidth>
  Démarrer mon inscription
</BoutonLink>

// Bouton outline petit
<BoutonLink href="/login" variant="outline" size="sm">
  Se connecter
</BoutonLink>

// Bouton secondaire avec classes personnalisées
<BoutonLink 
  href="/contact" 
  variant="secondary" 
  size="md"
  className="custom-class"
>
  Nous contacter
</BoutonLink>
```

## Différences avec Button

- **BoutonLink** : Composant Link avec styling de bouton (pour la navigation)
- **Button** : Composant bouton standard (pour les actions)

Le BoutonLink est spécifiquement conçu pour la navigation entre les pages, tandis que Button est pour les actions comme soumettre un formulaire. 