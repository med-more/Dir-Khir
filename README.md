# Dir-Khir Platform - Guide de Configuration

Plateforme d'entraide citoyenne marocaine construite avec Next.js 15, Better-Auth, Drizzle ORM et PostgreSQL.

## 📋 Table des Matières

- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration de la Base de Données](#configuration-de-la-base-de-données)
- [Configuration de Better-Auth](#configuration-de-better-auth)
- [Variables d'Environnement](#variables-denvironnement)
- [Migrations de Base de Données](#migrations-de-base-de-données)
- [Démarrage du Projet](#démarrage-du-projet)
- [Structure du Projet](#structure-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Tester les Fonctionnalités](#tester-les-fonctionnalités)
- [Dépannage](#dépannage)

## 🔧 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** 18+ et npm
- **PostgreSQL** (local ou service cloud comme Neon.tech, Supabase, etc.)
- **Git**

## 📦 Installation

1. **Cloner le projet** (si ce n'est pas déjà fait) :
```bash
git clone <votre-repo>
cd dir-khir-platform
```

2. **Installer les dépendances** :
```bash
npm install
```

Les dépendances principales installées :
- `next` - Framework React
- `better-auth` - Système d'authentification
- `drizzle-orm` - ORM pour PostgreSQL
- `postgres` - Client PostgreSQL
- `zod` - Validation de schémas
- `react-hook-form` - Gestion de formulaires
- `@hookform/resolvers` - Résolveurs pour react-hook-form

## 🗄️ Configuration de la Base de Données

### Option 1 : Base de Données Locale

Si vous utilisez PostgreSQL en local :

1. Créez une base de données :
```sql
CREATE DATABASE dir_khir;
```

2. Notez vos informations de connexion :
- Host: `localhost`
- Port: `5432` (par défaut)
- Database: `dir_khir`
- User: `votre_utilisateur`
- Password: `votre_mot_de_passe`

### Option 2 : Service Cloud (Recommandé pour le développement)

#### Neon.tech (Gratuit)

1. Créez un compte sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet
3. Copiez la connection string (format : `postgresql://user:password@host/database`)

#### Supabase (Alternative)

1. Créez un compte sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans Settings > Database
4. Copiez la connection string

## 🔐 Configuration de Better-Auth

Better-Auth est déjà configuré dans `lib/auth/config.ts`. Il utilise :
- Email/Password pour l'authentification
- Sessions avec expiration de 7 jours
- Drizzle adapter pour la base de données

Les routes API sont configurées dans `app/api/auth/[...all]/route.ts`.

## 🌍 Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# Base de Données PostgreSQL
DATABASE_URL=postgresql://user:password@host:port/database

# Better Auth (Optionnel - pour la production)
BETTER_AUTH_SECRET=votre-secret-key-tres-long-et-aleatoire
BETTER_AUTH_URL=http://localhost:3000
```

### Générer BETTER_AUTH_SECRET

Pour générer une clé secrète sécurisée :

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**Important** : 
- Ne commitez JAMAIS le fichier `.env.local` dans Git
- Utilisez des secrets différents pour le développement et la production
- Pour le développement local, `BETTER_AUTH_SECRET` est optionnel

## 🗃️ Migrations de Base de Données

### 1. Générer les Migrations

Après avoir configuré `DATABASE_URL`, générez les migrations :

```bash
npm run db:generate
```

Cette commande va :
- Analyser votre schéma dans `lib/db/schema.ts`
- Créer les fichiers de migration dans le dossier `drizzle/`

### 2. Appliquer les Migrations

#### Option A : Push Direct (Recommandé pour le développement)

```bash
npm run db:push
```

Cette commande applique directement les changements à la base de données sans créer de fichiers de migration SQL.

#### Option B : Migrations SQL (Pour la production)

Si vous préférez utiliser des migrations SQL :

```bash
# Générer les migrations SQL
npm run db:generate

# Appliquer les migrations (nécessite une configuration supplémentaire)
npm run db:migrate
```

### 3. Vérifier la Base de Données

Ouvrez Drizzle Studio pour visualiser votre base de données :

```bash
npm run db:studio
```

Cela ouvre une interface web (généralement sur `http://localhost:4983`) où vous pouvez :
- Voir toutes les tables
- Voir les données
- Tester des requêtes

## 🚀 Démarrage du Projet

1. **Vérifiez que votre `.env.local` est configuré** avec `DATABASE_URL`

2. **Appliquez les migrations** :
```bash
npm run db:push
```

3. **Démarrez le serveur de développement** :
```bash
npm run dev
```

4. **Ouvrez votre navigateur** :
```
http://localhost:3000
```

## 📁 Structure du Projet

```
dir-khir-platform/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...all]/
│   │           └── route.ts          # Routes API Better-Auth
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx              # Page de connexion
│   │   └── register/
│   │       └── page.tsx               # Page d'inscription
│   ├── components/
│   │   ├── dashboard-content.tsx     # Contenu du dashboard
│   │   └── needs-list.tsx            # Liste des besoins
│   ├── dashboard/
│   │   └── page.tsx                  # Page dashboard
│   ├── post-need/
│   │   └── page.tsx                  # Formulaire de publication
│   └── page.tsx                       # Page d'accueil
├── lib/
│   ├── auth/
│   │   ├── config.ts                 # Configuration Better-Auth
│   │   └── actions.ts                 # Server Actions auth
│   ├── db/
│   │   ├── schema.ts                  # Schéma Drizzle (tables)
│   │   └── index.ts                   # Instance Drizzle
│   └── actions/
│       └── needs.ts                   # Server Actions pour les besoins
├── components/
│   └── ui/                            # Composants UI (Shadcn)
├── drizzle.config.ts                  # Configuration Drizzle
├── .env.local                         # Variables d'environnement (à créer)
└── package.json
```

## ✨ Fonctionnalités

### 1. Authentification

- **Inscription** : `/auth/register`
  - Formulaire avec validation
  - Création de compte avec email/password
  - Redirection vers le dashboard

- **Connexion** : `/auth/login`
  - Formulaire de connexion
  - Gestion des erreurs
  - Redirection vers le dashboard

- **Déconnexion** : Bouton dans le dashboard

### 2. Publication de Besoins

- **Route** : `/post-need`
- **Fonctionnalités** :
  - Formulaire multi-étapes avec validation Zod
  - Champs : titre, description, catégorie, ville, WhatsApp, urgence
  - Validation en temps réel
  - Publication via Server Action
  - Redirection vers le dashboard après publication

### 3. Page d'Accueil

- **Route** : `/`
- **Fonctionnalités** :
  - Affichage des besoins depuis la base de données
  - Filtres par ville et catégorie
  - Compteur de volontaires en temps réel
  - Bouton "Je participe" (nécessite connexion)
  - Bouton WhatsApp pour contacter

### 4. Dashboard Utilisateur

- **Route** : `/dashboard`
- **Fonctionnalités** :
  - Statistiques personnelles
  - **Onglet "Mes Demandes"** :
    - Liste des besoins publiés
    - Option "Marquer Résolu"
    - Bouton WhatsApp
  - **Onglet "Mes Engagements"** :
    - Liste des missions où l'utilisateur a participé
    - Bouton WhatsApp

## 🧪 Tester les Fonctionnalités

### 1. Tester l'Authentification

1. Allez sur `/auth/register`
2. Créez un compte avec :
   - Nom complet
   - Email valide
   - Mot de passe (min 8 caractères)
   - Ville
3. Vous serez redirigé vers `/dashboard`

### 2. Tester la Publication

1. Connectez-vous
2. Allez sur `/post-need`
3. Remplissez le formulaire :
   - **Étape 1** : Titre (min 10 caractères) et Catégorie
   - **Étape 2** : Description (min 20 caractères) et Niveau d'urgence
   - **Étape 3** : Ville et WhatsApp (format : +212 6XX XXX XXX ou 06XX XXX XXX)
   - **Étape 4** : Révision
4. Cliquez sur "Publier Votre Besoin"
5. Vérifiez que le besoin apparaît sur la page d'accueil

### 3. Tester la Participation

1. Allez sur la page d'accueil (`/`)
2. Cliquez sur "Je participe" sur un besoin
3. Vérifiez que le compteur de volontaires augmente
4. Vérifiez dans le dashboard > "Mes Engagements" que la mission apparaît

### 4. Tester les Filtres

1. Sur la page d'accueil, utilisez les filtres :
   - Par ville (Casablanca, Marrakech, etc.)
   - Par catégorie (Environnement, Éducation, etc.)
2. Vérifiez que la liste se met à jour

### 5. Tester le Dashboard

1. Connectez-vous
2. Allez sur `/dashboard`
3. Vérifiez les statistiques :
   - Besoins publiés
   - Missions rejointes
   - Bénévoles trouvés
   - Impact communautaire
4. Testez les onglets "Mes Demandes" et "Mes Engagements"
5. Testez "Marquer Résolu" sur un de vos besoins

## 🔍 Dépannage

### Erreur : "DATABASE_URL is not set"

**Solution** : Vérifiez que votre fichier `.env.local` existe et contient `DATABASE_URL`.

### Erreur : "Connection refused" ou "Cannot connect to database"

**Solutions** :
1. Vérifiez que PostgreSQL est démarré (si local)
2. Vérifiez que la connection string dans `.env.local` est correcte
3. Vérifiez les credentials (user, password)
4. Vérifiez que le firewall autorise la connexion

### Erreur : "Table does not exist"

**Solution** : Appliquez les migrations :
```bash
npm run db:push
```

### Erreur : "You must be connected" lors de la publication

**Solution** : 
1. Vérifiez que vous êtes connecté
2. Vérifiez que la session est valide (essayez de vous reconnecter)
3. Vérifiez les cookies de votre navigateur

### Les besoins n'apparaissent pas sur la page d'accueil

**Solutions** :
1. Vérifiez que vous avez publié des besoins
2. Vérifiez que les besoins ont le statut "open"
3. Ouvrez la console du navigateur pour voir les erreurs
4. Vérifiez que `getNeeds()` fonctionne dans `lib/actions/needs.ts`

### Le compteur de volontaires ne se met pas à jour

**Solutions** :
1. Vérifiez que vous êtes connecté
2. Vérifiez que vous n'avez pas déjà participé à ce besoin
3. Vérifiez que vous n'êtes pas le créateur du besoin
4. Ouvrez la console pour voir les erreurs

## 📝 Scripts Disponibles

```bash
# Développement
npm run dev              # Démarrer le serveur de développement

# Build
npm run build            # Construire pour la production
npm run start            # Démarrer le serveur de production

# Base de Données
npm run db:generate      # Générer les migrations
npm run db:push          # Appliquer les changements directement
npm run db:migrate       # Appliquer les migrations SQL
npm run db:studio        # Ouvrir Drizzle Studio

# Linting
npm run lint             # Vérifier le code
```

## 🔒 Sécurité

- ✅ Validation Zod sur tous les formulaires
- ✅ Authentification requise pour les actions sensibles
- ✅ Protection CSRF via Better-Auth
- ✅ Sessions sécurisées
- ✅ Validation des numéros WhatsApp
- ✅ Vérification des permissions (un utilisateur ne peut pas participer à son propre besoin)

## 📚 Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Better-Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Zod Documentation](https://zod.dev/)

## 🤝 Contribution

Pour contribuer au projet :

1. Créez une branche pour votre fonctionnalité
2. Faites vos modifications
3. Testez toutes les fonctionnalités
4. Créez une pull request

## 📄 Licence

Ce projet est sous licence [votre licence].

---

**Note** : Ce guide est destiné au développement. Pour la production, assurez-vous de :
- Utiliser des variables d'environnement sécurisées
- Configurer HTTPS
- Mettre en place un monitoring
- Faire des backups réguliers de la base de données
- Utiliser un service de base de données géré (Neon, Supabase, etc.)
