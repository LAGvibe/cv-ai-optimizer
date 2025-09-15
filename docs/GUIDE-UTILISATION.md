# 📖 Guide d'utilisation CV Optimizer

## 🎯 Présentation

CV Optimizer est une application web moderne qui utilise l'intelligence artificielle pour optimiser votre CV en fonction d'une offre d'emploi spécifique. L'application analyse votre CV, le compare avec la description du poste, et vous propose des améliorations ciblées avec des annotations visuelles.

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+ installé
- Clé API OpenAI (pour l'IA d'analyse)
- Optionnel : Redis Upstash (pour la limitation de débit)

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd appli-cv-optimizer

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec votre clé OpenAI

# Lancer en développement
npm run dev
```

L'application sera accessible sur `http://localhost:3000`

## 📱 Interface utilisateur

### 1. Page d'accueil

#### Design moderne
- **Header professionnel** avec logo et nom de l'application
- **Hero section** avec value proposition claire
- **Call-to-action principal** : "Essayer gratuitement"
- **Section explicative** en 3 étapes simples

#### Navigation
- Clic sur **"Essayer gratuitement"** → Accès direct à l'application
- Design responsive pour mobile, tablette et desktop

### 2. Application principale (`/app`)

L'application fonctionne en **3 états distincts** sur une seule page :

#### État 1 : Saisie des données (Input)

**Zone de gauche - Upload du CV**
- **Drag & drop** : Glissez votre fichier directement dans la zone
- **Sélection manuelle** : Clic sur "Choisir un fichier"
- **Formats supportés** : PDF, DOCX, TXT
- **Feedback visuel** : La zone change de couleur pendant le drag & drop
- **Validation automatique** : Le texte est extrait immédiatement

**Zone de droite - Description du poste**
- **Textarea large** pour coller la description complète du poste
- **Placeholder informatif** pour guider l'utilisateur
- **Validation en temps réel** de la saisie

**Bouton d'action principal**
- **"Analyser mon CV"** : Activé uniquement quand les deux champs sont remplis
- **Design attractif** : Bouton bleu avec icône sparkles
- **État désactivé** : Message explicatif affiché

**Données d'exemple**
- **Bouton "Utiliser des données d'exemple"** 
- **Chargement instantané** d'un CV et d'une offre de démonstration
- **Idéal pour tester** l'application rapidement

#### État 2 : Chargement (Loading)

**Design professionnel**
- **Animation de spinner** moderne et fluide
- **Messages informatifs** : "Analyse en cours..."
- **Sous-titre explicatif** : "Notre IA compare votre CV avec l'offre d'emploi"
- **Fond cohérent** avec le reste de l'application

#### État 3 : Résultats (Results)

**Layout split-screen optimisé**

**Panel gauche - Visualisation du CV**
- **Simulation de PDF** avec le contenu extrait formaté
- **Annotations colorées** superposées sur le texte :
  - 🟢 **Vert** : Éléments à conserver/mettre en avant
  - 🟡 **Jaune** : Éléments à améliorer/modifier  
  - 🔴 **Rouge** : Éléments à supprimer/remplacer
  - 🔵 **Bleu** : Éléments manquants à ajouter

**Tooltips explicatifs**
- **Au survol** des annotations : explication détaillée
- **Positionnement intelligent** des tooltips
- **Contenu informatif** : pourquoi cette suggestion

**Légende des couleurs**
- **Guide visuel** en bas du panel
- **Correspondance** couleur → signification
- **Design cohérent** avec les annotations

**Panel droit - Suggestions détaillées**

**Section Compétences**
- **À ajouter** : Nouvelles compétences recommandées
- **À mettre en avant** : Compétences existantes à valoriser
- **À retirer** : Compétences peu pertinentes pour le poste

**Section Expériences**
- **Avant/Après** : Comparaison des formulations
- **Rationale** : Explication du changement proposé
- **Focus impact** : Mise en avant des résultats quantifiés

**Section Formulations**
- **Améliorations de texte** mot par mot
- **Justification** : Pourquoi le nouveau terme est meilleur
- **Orientation RH** : Adaptation au langage des recruteurs

**Bouton de reset**
- **"Nouvelle analyse"** en haut à gauche
- **Retour à l'état Input** pour analyser un autre CV
- **Conservation** de l'historique dans la session

## 🎮 Interactions utilisateur

### Drag & Drop
```
1. Sélectionner un fichier sur votre ordinateur
2. Le glisser sur la zone d'upload
3. La zone devient bleue pendant le survol
4. Relâcher pour lancer l'extraction
5. Feedback immédiat : "CV extrait avec succès"
```

### Validation en temps réel
```
- Fichier uploadé ✗ → Bouton "Analyser" désactivé
- Description vide ✗ → Message d'aide affiché
- Les deux remplis ✓ → Bouton activé et prêt
```

### Tooltips d'annotations
```
- Survoler une annotation colorée
- Tooltip apparaît avec animation douce
- Contient : icône + titre + explication
- Disparaît quand on sort de la zone
```

## 🔧 Fonctionnalités avancées

### Gestion d'erreurs
- **Toasts informatifs** pour chaque action
- **Messages d'erreur clairs** en cas de problème
- **Récupération gracieuse** après erreur
- **Validation côté client** avant envoi

### Responsive design
- **Mobile first** : Interface adaptée aux petits écrans
- **Tablet** : Layout optimisé pour tablettes
- **Desktop** : Pleine utilisation de l'espace split-screen

### Performance
- **Chargement rapide** : Code optimisé et bundling intelligent
- **Animations fluides** : Transitions CSS optimisées
- **Extraction instantanée** : Traitement côté serveur efficace

## 🎯 Cas d'usage types

### Démonstration rapide (1 minute)
```
1. Accueil → "Essayer gratuitement" (5 sec)
2. App → "Utiliser données d'exemple" (5 sec) 
3. Analyser → Voir loading → Résultats (30 sec)
4. Survoler annotations → Lire suggestions (20 sec)
```

### Utilisation réelle
```
1. Préparer CV (PDF/DOCX/TXT) + offre d'emploi
2. Accéder à l'application 
3. Upload du CV → Extraction automatique
4. Copier-coller la description du poste complet
5. Lancer l'analyse → Attendre résultats (30-60 sec)
6. Examiner annotations colorées
7. Lire suggestions détaillées par section
8. Appliquer améliorations sur CV original
```

### Test de différentes offres
```
1. Garder le même CV
2. "Nouvelle analyse" → Retour état Input
3. Changer uniquement la description de poste
4. Comparer les différentes suggestions obtenues
5. Identifier patterns selon types de postes
```

## 🚨 Limitations et bonnes pratiques

### Limitations techniques
- **Rate limiting** : 5 analyses par semaine par IP
- **Formats supportés** : PDF, DOCX, TXT uniquement
- **Taille maximale** : Vérifier les limites de votre serveur
- **Qualité extraction** : Dépend de la qualité du PDF source

### Bonnes pratiques d'utilisation

**Préparation du CV**
- Utiliser un CV **bien formaté** (structure claire)
- Éviter les PDFs **image** (non extractibles)
- Privilégier les formats **texte natif** (DOCX > PDF)

**Description du poste**
- Copier la **description complète** de l'offre
- Inclure **compétences techniques** et **soft skills**
- Ajouter le **contexte entreprise** si disponible
- Plus c'est détaillé, **meilleures sont les suggestions**

**Interprétation des résultats**
- Les annotations sont **indicatives** et approximatives
- Adapter les suggestions au **contexte spécifique**
- Garder son **authenticité** dans les modifications
- Utiliser comme **point de départ** pour réflexion

## 🎨 Personnalisation

### Variables d'environnement
```bash
# IA et modèle
OPENAI_API_KEY=sk-xxx        # Clé API obligatoire
OPENAI_MODEL=gpt-4o-mini     # Modèle utilisé

# Rate limiting (optionnel)
UPSTASH_REDIS_URL=redis://...
UPSTASH_REDIS_TOKEN=...

# Branding
NEXT_PUBLIC_APP_NAME=CV Optimizer
```

### Modification des couleurs d'annotations
```typescript
// Dans src/components/ResultsView.tsx
const getAnnotationColor = (type: Annotation["type"]) => {
  switch (type) {
    case "keep": return "bg-green-400/60 border-green-500";    // Modifier ici
    case "improve": return "bg-yellow-400/60 border-yellow-500";
    case "remove": return "bg-red-400/60 border-red-500";
    case "add": return "bg-blue-400/60 border-blue-500";
  }
};
```

## 📊 Monitoring et debugging

### Logs utiles
```bash
# Côté client (Console navigateur)
- Toast messages : succès/erreurs d'upload
- État de l'application : input/loading/results
- Erreurs d'extraction de fichiers

# Côté serveur (Terminal)
- Appels API LLM : /api/llm/suggest
- Extraction fichiers : /api/parse/pdf, /api/parse/docx  
- Erreurs rate limiting : 429 responses
```

### Debugging fréquent
```
Problème : Upload ne fonctionne pas
→ Vérifier format fichier (PDF/DOCX/TXT seulement)
→ Vérifier taille fichier
→ Regarder Network tab pour erreurs API

Problème : Analyse échoue  
→ Vérifier OPENAI_API_KEY dans .env.local
→ Vérifier rate limit (5/semaine/IP)
→ Regarder les logs serveur

Problème : Annotations ne s'affichent pas
→ Recharger la page 
→ Vérifier que l'analyse s'est bien terminée
→ Regarder console pour erreurs JavaScript
```

## 🎓 Guide pour recruteurs/démo

### Présentation efficace (2 minutes)
```
1. "Voici une application que j'ai développée pour optimiser les CV"
2. Montrer landing → "Design moderne, inspiration SaaS"
3. Clic "Essayer" → "Single-page application"  
4. "Utiliser données d'exemple" → "Démo instantanée"
5. Analyser → "État de chargement professionnel"
6. Résultats → "Annotations visuelles + suggestions IA"
7. Survol tooltips → "UX soignée avec explications"
8. "Reset" → "Workflow fluide et intuitif"
```

### Points techniques à mettre en avant
- **Architecture moderne** : SPA avec gestion d'état React
- **Design system cohérent** : Tailwind + shadcn/ui
- **UX réfléchie** : Drag & drop, états de chargement, tooltips
- **Intégration IA** : OpenAI avec gestion d'erreurs
- **Code quality** : TypeScript, validation, tests build
- **Performance** : Build optimisé, responsive design

Cette application démontre une **maîtrise complète** du développement front-end moderne et des patterns UX professionnels !
