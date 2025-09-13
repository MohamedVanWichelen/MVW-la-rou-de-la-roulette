# 🎯 Decision Roulette

Une application web interactive de roue de décision élégante et moderne, parfaite pour prendre des décisions de manière amusante et équitable.

## ✨ Fonctionnalités

- **Roue interactive** : Roue colorée et fluide avec animations réalistes
- **Choix personnalisables** : Ajoutez entre 2 et 8 choix personnalisés
- **Probabilités égales** : Chaque segment a la même chance d'être sélectionné
- **Mode sombre/clair** : Basculez facilement entre les thèmes
- **Responsive** : S'adapte parfaitement aux mobiles et tablettes
- **Effets visuels** : Confettis animés lors de la victoire
- **Vibration** : Feedback tactile sur les appareils compatibles
- **Raccourcis clavier** : Cmd/Ctrl + Entrée pour mettre à jour la roue

## 🚀 Utilisation

1. **Ouvrez `index.html`** dans votre navigateur web
2. **Saisissez vos choix** dans la zone de texte, séparés par des virgules
3. **Cliquez sur "Mettre à jour la roue"** pour appliquer vos choix
4. **Cliquez sur "SPIN"** pour faire tourner la roue
5. **Découvrez le résultat** avec une animation de confettis !

### Exemples de choix
```
Pizza, Sushi, Tacos, Burger
Rouge, Bleu, Vert, Jaune
Cinéma, Restaurant, Promenade, Chez soi
```

## 🎨 Personnalisation

### Couleurs
Les couleurs sont définies dans les variables CSS :
```css
:root {
    --c-night: #0B0F19;     /* bleu nuit */
    --c-navy: #152238;      /* bleu marine */
    --c-steel: #38536C;     /* bleu acier */
    --c-bluegray: #6C82A0;  /* bleu gris */
    --c-cream: #EFEBD9;     /* crème clair */
}
```

### Palette de la roue
La palette des segments est définie dans `script.js` :
```javascript
const PALETTE = ["#0B0F19","#152238","#38536C","#6C82A0","#EFEBD9"];
```

## 📁 Structure du projet

```
Rou de la chance/
├── index.html          # Structure HTML principale
├── styles.css          # Styles CSS avec thème sombre/clair
├── script.js           # Logique JavaScript de la roue
└── README.md           # Documentation
```

## 🔧 Technologies utilisées

- **HTML5** : Structure sémantique avec accessibilité (ARIA)
- **CSS3** : Styles modernes avec variables CSS et animations
- **JavaScript ES6+** : Logique interactive et animations Canvas
- **Canvas API** : Rendu de la roue avec animations fluides

## 📱 Compatibilité

- ✅ Chrome/Edge (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Responsive design

## 🎮 Contrôles

| Action | Raccourci | Description |
|--------|-----------|-------------|
| Mettre à jour | Cmd/Ctrl + Entrée | Applique les choix à la roue |
| Tourner | Clic sur "SPIN" | Lance l'animation de rotation |
| Mode sombre | Clic sur "Mode" | Bascule le thème |

## 🔄 Animations

- **Rotation fluide** : Animation avec easing cubic-out pour un effet naturel
- **Durée variable** : Entre 4.2 et 5.2 secondes pour varier l'excitation
- **Tours multiples** : 4 à 6 tours complets avant l'arrêt
- **Confettis** : 26 particules colorées animées à la victoire

## 🎯 Algorithme de sélection

1. **Sélection uniforme** : Chaque segment a une probabilité égale
2. **Calcul précis** : L'angle final est calculé pour placer le segment gagnant sous la flèche
3. **Tours supplémentaires** : Ajout de tours complets pour l'effet dramatique

## 🌙 Mode sombre

Le mode sombre est automatiquement sauvegardé dans le localStorage et restauré lors du prochain chargement.

## 📝 Notes de développement

- **Performance** : Utilisation de `requestAnimationFrame` pour des animations fluides
- **Accessibilité** : Labels ARIA et navigation au clavier
- **Responsive** : Canvas adaptatif avec gestion du device pixel ratio
- **Stockage** : Préférences sauvegardées localement

## 🚀 Déploiement

Pour déployer l'application :
1. Uploadez tous les fichiers sur votre serveur web
2. Assurez-vous que `index.html` est accessible
3. C'est tout ! L'application fonctionne entièrement côté client

## 📄 Licence

Projet open source - libre d'utilisation et de modification.

---

**Amusez-vous bien avec vos décisions ! 🎉**
