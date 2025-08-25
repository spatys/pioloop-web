# Images Pioloop

Ce dossier contient les images statiques du site Pioloop.

## Structure recommandée :

- `/logos/` - Logos et marques
- `/icons/` - Icônes SVG et PNG
- `/illustrations/` - Illustrations et images décoratives
- `/hero/` - Images de la section hero
- `/properties/` - Images des propriétés
- `/avatars/` - Photos de profil utilisateurs

## Formats supportés :

- PNG (pour les images avec transparence)
- JPG/JPEG (pour les photos)
- SVG (pour les icônes et illustrations vectorielles)
- WebP (pour l'optimisation)

## Utilisation dans Next.js :

```jsx
import Image from "next/image";

<Image src="/images/logo.png" alt="Logo Pioloop" width={200} height={100} />;
```
