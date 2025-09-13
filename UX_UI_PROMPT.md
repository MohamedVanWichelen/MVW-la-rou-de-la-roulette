# 🎯 PROMPT UX/UI SENIOR - Roullette de Décision Universelle

## 📋 BRIEF CLIENT

**Objectif :** Créer une application web de roulette de décision accessible à tous les âges (8-80 ans) avec une interface iOS 26 moderne et des couleurs personnalisées.

**Mission :** Résoudre les dilemmes quotidiens avec une expérience utilisateur intuitive et engageante.

---

## 🎨 PALETTE DE COULEURS PERSONNALISÉE

```css
/* Couleurs primaires */
--primary-purple: #8B5CF6;      /* Violet principal */
--primary-blue: #3B82F6;        /* Bleu accent */
--primary-green: #10B981;       /* Vert succès */

/* Couleurs secondaires */
--secondary-pink: #EC4899;      /* Rose énergique */
--secondary-orange: #F59E0B;    /* Orange chaleureux */
--secondary-teal: #14B8A6;      /* Turquoise moderne */

/* Couleurs neutres iOS 26 */
--neutral-50: #FAFAFA;          /* Fond ultra-clair */
--neutral-100: #F5F5F5;         /* Fond clair */
--neutral-200: #E5E5E5;         /* Bordures claires */
--neutral-300: #D4D4D8;         /* Texte secondaire */
--neutral-400: #A3A3A3;         /* Texte tertiaire */
--neutral-500: #737373;         /* Texte principal */
--neutral-600: #525252;         /* Texte foncé */
--neutral-700: #404040;         /* Texte très foncé */
--neutral-800: #262626;         /* Fond sombre */
--neutral-900: #171717;         /* Fond ultra-sombre */

/* Couleurs système iOS 26 */
--system-success: #34C759;      /* Succès */
--system-warning: #FF9500;      /* Attention */
--system-error: #FF3B30;        /* Erreur */
--system-info: #007AFF;         /* Information */
```

---

## 🎯 PRINCIPES UX/UI FONDAMENTAUX

### 1. **ACCESSIBILITÉ UNIVERSELLE**
- **Contraste WCAG AAA** : Ratio minimum 7:1 pour tous les textes
- **Taille de police** : Minimum 16px sur mobile, 18px pour les seniors
- **Espacement tactile** : Zones cliquables minimum 44x44px
- **Navigation clavier** : Support complet Tab/Enter/Escape
- **Lecteur d'écran** : Labels ARIA complets et descriptifs
- **Mode daltonien** : Couleurs + icônes + formes pour différencier

### 2. **PSYCHOLOGIE DES COULEURS**
- **Violet** : Créativité, sagesse, décision réfléchie
- **Bleu** : Confiance, sérénité, choix logique
- **Vert** : Croissance, harmonie, décision positive
- **Rose** : Énergie, passion, choix audacieux
- **Orange** : Optimisme, enthousiasme, décision joyeuse
- **Turquoise** : Équilibre, clarté, décision équilibrée

### 3. **HIÉRARCHIE VISUELLE**
- **Titre principal** : 32px, poids 700, couleur --neutral-800
- **Sous-titre** : 20px, poids 600, couleur --neutral-600
- **Corps de texte** : 16px, poids 400, couleur --neutral-500
- **Texte secondaire** : 14px, poids 400, couleur --neutral-400

---

## 🏗️ ARCHITECTURE DE L'INTERFACE

### **LAYOUT PRINCIPAL**
```
┌─────────────────────────────────────┐
│           Header (Fixed)            │
│  🎯 Ma Roulette de Décision        │
├─────────────────────────────────────┤
│                                     │
│         Roue Interactive            │
│        (Zone centrale)              │
│                                     │
├─────────────────────────────────────┤
│        Zone de Saisie               │
│   [Texte] [Boutons Actions]         │
├─────────────────────────────────────┤
│         Résultat                    │
│      (Affichage dynamique)          │
└─────────────────────────────────────┘
```

### **COMPOSANTS PRINCIPAUX**

#### 1. **HEADER ADAPTATIF**
```html
<header class="header-main">
  <div class="header-content">
    <h1 class="app-title">
      <span class="icon">🎯</span>
      Ma Roulette de Décision
    </h1>
    <div class="header-actions">
      <button class="btn-icon" aria-label="Paramètres">
        <svg>⚙️</svg>
      </button>
      <button class="btn-icon" aria-label="Mode sombre">
        <svg>🌙</svg>
      </button>
    </div>
  </div>
</header>
```

#### 2. **ROUE INTERACTIVE**
```html
<div class="wheel-container">
  <div class="wheel-wrapper">
    <!-- Flèche fixe avec animation pulse -->
    <div class="pointer">
      <svg class="pointer-icon">🎯</svg>
    </div>
    <!-- Canvas de la roue -->
    <canvas id="decision-wheel" class="wheel-canvas"></canvas>
  </div>
</div>
```

#### 3. **ZONE DE SAISIE INTELLIGENTE**
```html
<div class="input-section">
  <div class="input-group">
    <label for="choices-input" class="input-label">
      Tes choix (séparés par des virgules)
    </label>
    <div class="input-wrapper">
      <textarea 
        id="choices-input" 
        class="choices-textarea"
        placeholder="Exemple: Pizza, Sushi, Tacos, Burger..."
        maxlength="500"
        rows="3"
      ></textarea>
      <div class="input-counter">
        <span class="char-count">0</span>/500
      </div>
    </div>
  </div>
  
  <!-- Boutons d'actions -->
  <div class="action-buttons">
    <button class="btn-secondary" id="suggest-btn">
      <span class="btn-icon">💡</span>
      Suggestions
    </button>
    <button class="btn-primary" id="spin-btn" disabled>
      <span class="btn-icon">🎲</span>
      Lancer la roue
    </button>
  </div>
</div>
```

#### 4. **AFFICHAGE RÉSULTAT**
```html
<div class="result-section" id="result-section" hidden>
  <div class="result-card">
    <div class="result-icon">🎉</div>
    <h2 class="result-title">Décision prise !</h2>
    <div class="result-choice" id="result-choice"></div>
    <button class="btn-ghost" id="new-decision-btn">
      Prendre une nouvelle décision
    </button>
  </div>
</div>
```

---

## 🎨 STYLE GUIDE iOS 26

### **TYPOGRAPHIE**
```css
/* Police principale */
font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 
             'Helvetica Neue', Arial, system-ui, sans-serif;

/* Poids et espacement */
font-weight: 400; /* Normal */
line-height: 1.47059; /* Ratio Apple */
letter-spacing: -0.022em; /* Kerning Apple */
```

### **RAYONS DE BORDURE**
```css
--radius-xs: 6px;    /* Petits éléments */
--radius-sm: 8px;    /* Boutons */
--radius-md: 12px;   /* Cards */
--radius-lg: 16px;   /* Containers */
--radius-xl: 24px;   /* Modales */
--radius-full: 999px; /* Boutons ronds */
```

### **OMBRES iOS 26**
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06);
--shadow-md: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
--shadow-xl: 0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04);
```

---

## 🎯 FONCTIONNALITÉS UX AVANCÉES

### **1. SUGGESTIONS INTELLIGENTES**
```javascript
const SUGGESTION_CATEGORIES = {
  food: ["Pizza", "Sushi", "Tacos", "Burger", "Pasta", "Salade"],
  activities: ["Cinéma", "Restaurant", "Promenade", "Sport", "Lecture", "Gaming"],
  colors: ["Rouge", "Bleu", "Vert", "Jaune", "Violet", "Orange"],
  travel: ["Paris", "Londres", "Tokyo", "New York", "Rome", "Barcelone"],
  work: ["Projet A", "Projet B", "Formation", "Réunion", "Pause", "Fin de journée"]
};
```

### **2. ANIMATIONS MICRO-INTERACTIONS**
```css
/* Animation de la roue */
@keyframes wheelSpin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(var(--final-rotation)); }
}

/* Animation des boutons */
.btn-primary {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform: translateY(0);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}
```

### **3. FEEDBACK VISUEL ET SONORE**
- **Vibration** : Pattern différent selon l'âge (subtile pour seniors)
- **Sons** : Fréquences adaptées (plus graves pour seniors)
- **Couleurs** : Feedback visuel immédiat sur chaque action
- **Animations** : Durée adaptée (plus lente pour seniors)

---

## 📱 RESPONSIVE DESIGN

### **BREAKPOINTS**
```css
/* Mobile First */
@media (min-width: 320px) { /* iPhone SE */ }
@media (min-width: 375px) { /* iPhone 12/13 */ }
@media (min-width: 414px) { /* iPhone Plus */ }
@media (min-width: 768px) { /* iPad */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1440px) { /* Large Desktop */ }
```

### **ADAPTATIONS PAR ÂGE**

#### **JEUNES (8-25 ans)**
- Animations rapides et colorées
- Interactions tactiles intuitives
- Gamification (sons, effets)
- Interface compacte

#### **ADULTES (26-60 ans)**
- Équilibre entre esthétique et fonctionnalité
- Navigation efficace
- Feedback professionnel
- Interface équilibrée

#### **SENIORS (60+ ans)**
- Textes plus grands (18px minimum)
- Boutons plus espacés (60x60px)
- Animations plus lentes
- Contraste élevé
- Instructions claires

---

## 🎨 COMPOSANTS BOUTONS iOS 26

### **BOUTON PRIMAIRE**
```css
.btn-primary {
  background: linear-gradient(135deg, var(--primary-purple), var(--primary-blue));
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: var(--shadow-md);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 8px;
}
```

### **BOUTON SECONDAIRE**
```css
.btn-secondary {
  background: var(--neutral-100);
  color: var(--neutral-700);
  border: 1px solid var(--neutral-200);
  border-radius: var(--radius-full);
  padding: 16px 32px;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s ease;
  min-height: 44px;
}
```

### **BOUTON ICÔNE**
```css
.btn-icon {
  background: transparent;
  border: none;
  border-radius: var(--radius-full);
  padding: 12px;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
```

---

## 🎯 ÉTATS ET INTERACTIONS

### **ÉTATS DES BOUTONS**
- **Default** : Couleur de base, ombre légère
- **Hover** : Élévation +2px, ombre renforcée
- **Active** : Retour à la position initiale
- **Disabled** : Opacité 50%, curseur interdit
- **Loading** : Spinner, texte "Chargement..."

### **ÉTATS DE LA ROUE**
- **Idle** : Statique, prête à tourner
- **Spinning** : Rotation avec momentum
- **Decelerating** : Ralentissement progressif
- **Stopped** : Arrêt avec résultat affiché

---

## 🧠 LOGIQUE MÉTIER UX

### **VALIDATION DES CHOIX**
```javascript
function validateChoices(input) {
  const choices = input.split(',').map(c => c.trim()).filter(Boolean);
  
  // Règles de validation
  if (choices.length < 2) return { valid: false, message: "Au moins 2 choix nécessaires" };
  if (choices.length > 8) return { valid: false, message: "Maximum 8 choix autorisés" };
  if (choices.some(c => c.length > 50)) return { valid: false, message: "Choix trop long (max 50 caractères)" };
  
  return { valid: true, choices };
}
```

### **ALGORITHME DE ROTATION**
```javascript
function calculateSpin(targetIndex, currentRotation) {
  const segments = getSegments();
  const arc = (Math.PI * 2) / segments.length;
  const pointerAngle = -Math.PI / 2;
  const targetAngle = targetIndex * arc + arc / 2;
  
  // Tours supplémentaires pour l'excitation
  const extraTurns = 3 + Math.random() * 2; // 3-5 tours
  
  // Angle final calculé
  const finalAngle = (pointerAngle - targetAngle) + (extraTurns * Math.PI * 2);
  
  return {
    startAngle: currentRotation,
    endAngle: currentRotation + finalAngle,
    duration: 4000 + Math.random() * 2000 // 4-6 secondes
  };
}
```

---

## 📊 MÉTRIQUES UX À MESURER

### **PERFORMANCE**
- Temps de chargement initial < 2s
- Fluidité des animations (60fps)
- Taille du bundle < 500KB

### **ACCESSIBILITÉ**
- Score Lighthouse > 95
- Temps de navigation au clavier < 30s
- Compatibilité lecteurs d'écran 100%

### **ENGAGEMENT**
- Taux de completion des décisions > 90%
- Temps moyen par session > 2 minutes
- Taux de retour utilisateur > 30%

---

## 🚀 PLAN DE DÉVELOPPEMENT

### **PHASE 1 : FONDATIONS**
1. Structure HTML sémantique
2. Système de design CSS
3. Logique JavaScript de base
4. Tests d'accessibilité

### **PHASE 2 : INTERACTIONS**
1. Animation de la roue
2. Système de suggestions
3. Feedback sonore et visuel
4. Optimisation mobile

### **PHASE 3 : POLISH**
1. Micro-interactions
2. Optimisations performance
3. Tests multi-âges
4. Déploiement et monitoring

---

## 💡 INNOVATIONS UX UNIQUES

### **1. MODE ADAPTATIF**
- Détection automatique de l'âge via les préférences système
- Interface qui s'adapte en temps réel
- Paramètres sauvegardés localement

### **2. HISTORIQUE INTELLIGENT**
- Sauvegarde des décisions précédentes
- Suggestions basées sur l'historique
- Export des décisions importantes

### **3. PARTAGE SOCIAL**
- Génération d'images des résultats
- Partage sur réseaux sociaux
- Mode collaboratif pour décisions de groupe

---

**Ce prompt garantit une expérience utilisateur exceptionnelle, accessible à tous les âges, avec l'esthétique moderne d'iOS 26 et une palette de couleurs personnalisée vibrante et engageante.**
