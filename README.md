# 🚀 CV Optimizer

> **Projet portfolio** - Optimisation de CV par IA pour correspondre à une offre d'emploi

## 📖 Concept

Application web qui analyse votre CV et une offre d'emploi pour proposer des améliorations personnalisées. L'IA compare les deux documents et suggère des modifications avec des annotations visuelles.

## ✨ Fonctionnalités

- **Upload de CV** (PDF, DOCX, TXT) avec extraction automatique du texte
- **Analyse IA** powered by OpenAI pour comparer CV et offre
- **Annotations visuelles** avec code couleur sur le CV :
  - 🟢 À conserver - 🟡 À améliorer - 🔴 À supprimer - 🔵 À ajouter
- **Suggestions détaillées** par sections (compétences, expériences, formulations)
- **Interface moderne** single-page avec workflow fluide

## 🎯 Demo rapide

1. Aller sur la page d'accueil → Cliquer **"Essayer gratuitement"**
2. Cliquer **"Utiliser des données d'exemple"** (pour tester rapidement)
3. Cliquer **"Analyser mon CV"** → Voir les résultats avec annotations

## 🛠 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/cv-optimizer.git
cd cv-optimizer

# Installer les dépendances
npm install

# Configuration
cp .env.example .env.local
# Ajouter votre clé OpenAI dans .env.local

# Lancer l'application
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

## 🔧 Configuration

Créer un fichier `.env.local` avec :
```bash
OPENAI_API_KEY=sk-votre-cle-openai
OPENAI_MODEL=gpt-4o-mini
```

## 📱 Stack technique

- **Frontend** : Next.js 15, TypeScript, Tailwind CSS
- **UI** : shadcn/ui components, Lucide icons
- **IA** : OpenAI API pour l'analyse
- **Parsing** : pdf-parse, mammoth pour extraction de texte
- **Validation** : Zod schemas

## 🎨 Architecture

- **Landing page** (`/`) : Présentation moderne avec call-to-action
- **Application principale** (`/app`) : Single-page avec 3 états :
  - **Input** : Upload CV + description poste
  - **Loading** : Analyse en cours
  - **Results** : CV annoté + suggestions détaillées

## 🎭 Pourquoi ce projet ?

**Pour les développeurs :**
- Démontre la maîtrise de Next.js, TypeScript, et patterns modernes
- Architecture SPA avec gestion d'état React
- Intégration API (OpenAI) avec gestion d'erreurs
- UI/UX soignée avec composants réutilisables

**Pour les RH :**
- Outil concret et utile pour l'optimisation de CV
- Interface intuitive et professionnelle
- Démonstration de capacités techniques appliquées

---

💡 **Projet réalisé pour démontrer des compétences en développement web moderne et en intégration d'IA.**