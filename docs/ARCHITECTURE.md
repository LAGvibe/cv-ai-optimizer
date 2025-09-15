# 🏗️ Architecture CV Optimizer

## Vue d'ensemble

L'application CV Optimizer a été complètement redesignée pour offrir une expérience utilisateur moderne et professionnelle, passant d'une architecture multi-pages dispersée à une **application single-page (SPA)** cohérente.

## 🎯 Objectifs de la refonte

### Problèmes de l'ancienne architecture
- **Navigation fragmentée** : 7 pages séparées (/cv, /job, /compare, /suggest, /pdf, /letter, /settings)
- **Perte de contexte** : données non persistantes entre les pages
- **UX dégradée** : workflow complexe et peu intuitif
- **Pas professionnel** : ne ressemble pas aux outils SaaS modernes

### Nouvelle approche
- **Single-page application** avec transitions fluides
- **Workflow linéaire** : Input → Loading → Results
- **UX moderne** : inspiration des meilleurs outils SaaS (Figma, Linear, Notion)
- **Portfolio professionnel** : impressionnant pour les recruteurs

## 🏛️ Architecture technique

### Structure des fichiers
```
src/
├── app/
│   ├── page.tsx                 # Landing page moderne
│   ├── app/page.tsx            # Application principale (SPA)
│   ├── layout.tsx              # Layout global
│   └── api/                    # API routes inchangées
│       ├── parse/
│       └── llm/
├── components/
│   ├── ui/                     # Composants shadcn/ui
│   └── ResultsView.tsx         # Vue des résultats extraite
└── lib/                        # Utilitaires (inchangé)
```

### Composants principaux

#### 1. **Landing Page (`/`)**
- **Design moderne** : gradients, icônes Lucide React
- **Header professionnel** avec branding
- **Hero section** avec value proposition claire
- **Call-to-action** évident : "Essayer gratuitement"
- **Section "Comment ça marche"** en 3 étapes

#### 2. **Application principale (`/app`)**
- **Gestion d'état local** avec hooks React
- **3 états distincts** :
  - `input` : Formulaire d'upload et saisie
  - `loading` : Écran de chargement animé
  - `results` : Affichage des résultats avec annotations

#### 3. **Composant ResultsView**
- **Layout split-screen** : PDF viewer + sidebar suggestions
- **Système d'annotations** avec tooltips au hover
- **Légende des couleurs** pour les annotations
- **Suggestions structurées** par catégories

## 🎨 Design System

### Palette de couleurs
- **Primaire** : Bleu (#2563eb) et Indigo (#4f46e5)
- **Annotations** :
  - 🟢 Vert : À conserver/mettre en avant
  - 🟡 Jaune : À améliorer/modifier
  - 🔴 Rouge : À supprimer/remplacer
  - 🔵 Bleu : À ajouter (manquant)

### Composants UI
- **shadcn/ui** : système de composants moderne
- **Lucide React** : icônes cohérentes
- **Tailwind CSS** : styling utilitaire
- **Gradients** : backgrounds professionnels

## 🔄 Flux utilisateur

### Workflow principal
1. **Arrivée** sur la landing page professionnelle
2. **Clic** sur "Essayer gratuitement" → `/app`
3. **Upload** du CV (drag & drop ou sélection)
4. **Saisie** de la description de poste
5. **Validation** : bouton activé seulement si les deux champs sont remplis
6. **Analyse** : écran de chargement avec animation
7. **Résultats** : PDF annoté + suggestions détaillées
8. **Tooltips** : explications au survol des annotations
9. **Nouvelle analyse** : reset pour recommencer

### États et transitions
```
Input State
├── Validation des fichiers (PDF/DOCX/TXT)
├── Extraction du texte automatique
├── Bouton "Données d'exemple" pour la démo
└── Validation des champs requis

Loading State
├── Animation de chargement
├── Messages de progression
└── Gestion des erreurs (429, 500, etc.)

Results State
├── PDF viewer avec overlay d'annotations
├── Sidebar avec suggestions structurées
├── Tooltips explicatifs
└── Bouton "Nouvelle analyse"
```

## 🚀 Fonctionnalités clés

### Upload intelligent
- **Drag & drop** avec feedback visuel
- **Validation de fichiers** (PDF, DOCX, TXT)
- **Extraction automatique** du texte
- **Gestion d'erreurs** avec toasts

### Annotations PDF
- **Overlay HTML** sur le contenu PDF simulé
- **4 types d'annotations** avec couleurs distinctes
- **Tooltips au hover** avec explications détaillées
- **Positionnement approximatif** mais réaliste

### Suggestions structurées
- **Compétences** : à ajouter, mettre en avant, retirer
- **Expériences** : avant/après avec rationale
- **Formulations** : améliorations de texte
- **Résumé global** de l'analyse

### Données d'exemple
- **Bouton "Utiliser des données d'exemple"**
- **CV et offre pré-remplis** pour la démo
- **Workflow complet testable** sans upload

## 🔧 Aspects techniques

### Gestion d'état
```typescript
type AppState = "input" | "loading" | "results";

// État principal de l'application
const [state, setState] = useState<AppState>("input");
const [file, setFile] = useState<File | null>(null);
const [jobDescription, setJobDescription] = useState("");
const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
const [annotations, setAnnotations] = useState<Annotation[]>([]);
```

### Types TypeScript
```typescript
type AnalysisResult = {
  summary?: string;
  skills: { add: string[]; emphasize: string[]; remove: string[] };
  experiences: { sectionTitle: string; before: string[]; after: string[]; rationale?: string }[];
  wordingFixes: { before: string; after: string; reason?: string }[];
};

type Annotation = {
  id: string;
  type: "keep" | "improve" | "remove" | "add";
  text: string;
  explanation: string;
  top: number;
  left: number;
  width: number;
  height: number;
};
```

### Gestion des erreurs
- **Toast notifications** pour les retours utilisateur
- **Validation côté client** avant envoi
- **Gestion des erreurs API** (429, 500, etc.)
- **Fallbacks gracieux** en cas d'échec

## 📱 Responsive Design

### Breakpoints
- **Mobile** : Layout en colonne unique
- **Tablet** : Grilles adaptatives
- **Desktop** : Split-screen pour les résultats

### Accessibilité
- **Focus visible** sur tous les éléments interactifs
- **Labels appropriés** pour les champs de formulaire
- **Couleurs contrastées** respectant WCAG
- **Navigation au clavier** fonctionnelle

## 🎭 Comparaison avant/après

### Ancienne architecture (❌)
- 7 pages séparées
- Navigation complexe
- Données perdues entre pages
- UX fragmentée
- Design basique avec cards simples

### Nouvelle architecture (✅)
- 1 page avec 3 états
- Workflow linéaire et intuitif
- État persistant dans l'application
- UX fluide et moderne
- Design professionnel SaaS

## 🔮 Évolutions futures possibles

### Court terme
- **Animations CSS** plus poussées
- **Meilleur positionnement** des annotations PDF
- **Export PDF** avec annotations

### Moyen terme
- **Authentification** utilisateur
- **Sauvegarde** des analyses
- **Historique** des optimisations
- **Templates** de CV multiples

### Long terme
- **Édition inline** du CV
- **Collaboration** en temps réel
- **IA avancée** pour génération automatique
- **Intégrations** avec ATS et plateformes RH
