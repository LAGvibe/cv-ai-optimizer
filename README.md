# CV Assist

> **MVP - Day 2** - Assistant IA pour l'analyse de CV

## 📖 Description

Application web moderne développée avec Next.js 15, TypeScript et Tailwind CSS. Interface propre et intuitive pour la gestion de CV avec architecture extensible.

## ✨ Fonctionnalités actuelles

- **Landing page** moderne avec design responsive
- **Upload de fichiers** PDF, DOCX, TXT avec extraction de texte
- **Analyse IA** avec OpenAI GPT pour l'optimisation de CV
- **Suggestions détaillées** avec priorités et types d'amélioration
- **Interface intuitive** avec loading states et gestion d'erreurs
- **Architecture** Next.js App Router avec TypeScript
- **UI/UX** soignée avec Tailwind CSS et Lucide icons

## 🎯 Demo rapide

1. Aller sur la page d'accueil → Cliquer **"Voir la démo"**
2. Uploader un CV (PDF, DOCX, ou TXT)
3. Ajouter une description de poste
4. Lancer l'analyse IA
5. Consulter les suggestions détaillées

## 🛠 Installation

```bash
# Cloner le projet
git clone https://github.com/votre-username/cv-assist.git
cd cv-assist

# Installer les dépendances
npm install

# Configurer l'API OpenAI
cp .env.example .env.local
# Éditer .env.local et ajouter votre clé API OpenAI

# Lancer l'application
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur.

### 🔑 Configuration API

1. Obtenez une clé API sur [OpenAI Platform](https://platform.openai.com/api-keys)
2. Créez un fichier `.env.local` avec :
   ```
   OPENAI_API_KEY=sk-votre-cle-ici
   ```

## 📱 Stack technique

- **Framework** : Next.js 15 (App Router)
- **Language** : TypeScript
- **Styling** : Tailwind CSS
- **UI Components** : shadcn/ui
- **Icons** : Lucide React
- **Notifications** : Sonner
- **IA** : OpenAI GPT-3.5-turbo
- **PDF Processing** : pdf-parse
- **DOCX Processing** : mammoth

## 🎨 Architecture

- **Landing page** (`/`) : Présentation moderne avec call-to-action
- **Application** (`/app`) : Interface d'upload, analyse et résultats
- **API Routes** (`/api`) : Extraction de texte et analyse IA
- **Paramètres** (`/settings`) : Informations sur l'application

## 🎭 Objectifs du projet

**Démonstration technique :**
- Maîtrise de Next.js 15 et TypeScript
- Intégration d'APIs externes (OpenAI)
- Traitement de fichiers (PDF, DOCX)
- Architecture moderne avec App Router
- Composants réutilisables et patterns modernes
- UI/UX professionnelle et responsive

**Fonctionnalités implémentées :**
- Extraction de texte depuis différents formats
- Analyse IA avec suggestions détaillées
- Gestion d'erreurs robuste
- Interface intuitive et moderne

---

💡 **MVP fonctionnel démontrant des compétences en développement web moderne et intégration IA.**