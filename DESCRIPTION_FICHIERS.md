# Description des fichiers du projet Chronos Blockchain

Document de référence listant **tous les fichiers créés** pour le module blockchain du projet **Chronos: Autonomous Campus Asset & Resource DAO**, avec le rôle de chacun.

---

## Vue d’ensemble de l’arborescence

```
chronos-blockchain/
├── contracts/
│   └── HelloChronos.sol
├── scripts/
│   └── deploy.js
├── test/
│   └── HelloChronos.test.js
├── ignition/
│   └── modules/
│       └── HelloChronos.js
├── hardhat.config.js
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
├── README.md
└── DESCRIPTION_FICHIERS.md   ← ce fichier
```

Dossiers générés automatiquement (non versionnés) :

| Dossier / fichier | Origine |
|-------------------|---------|
| `node_modules/` | Installé par `npm install` |
| `artifacts/` | Généré par `npx hardhat compile` |
| `cache/` | Cache du compilateur Solidity |
| `.env` | À créer manuellement à partir de `.env.example` |

---

## 1. Fichiers à la racine

### `package.json`

**Rôle :** manifeste npm du projet.

**Contenu principal :**
- Métadonnées du projet (`name`, `version`, `description`, `license`)
- Scripts npm pratiques (`compile`, `test`, `deploy:local`, `deploy:amoy`, etc.)
- Dépendances de production : `@openzeppelin/contracts`, `dotenv`
- Dépendances de développement : `hardhat`, `@nomicfoundation/hardhat-toolbox`, `ethers`

**Pourquoi il existe :** sans ce fichier, npm ne sait pas quelles librairies installer ni quels scripts lancer.

---

### `package-lock.json`

**Rôle :** verrouille les versions exactes de toutes les dépendances (directes et transitives).

**Pourquoi il existe :** garantit que tous les développeurs (et la CI) installent **exactement** les mêmes versions. Généré automatiquement par `npm install`.

---

### `hardhat.config.js`

**Rôle :** configuration centrale de Hardhat.

**Ce qu’il configure :**
- Compilateur Solidity **0.8.28** (optimizer activé, 200 runs)
- Chemins du projet (`contracts/`, `test/`, `artifacts/`, `cache/`)
- Réseaux :
  - `hardhat` — réseau local en mémoire (tests)
  - `localhost` — nœud local persistant (`npx hardhat node`)
  - `amoy` — Polygon Amoy Testnet (chainId **80002**)
- Vérification Polygonscan (`etherscan.apiKey`)
- Gas reporter (activé si `REPORT_GAS=true`)
- Timeout Mocha (120 s)

**Dépendances chargées :**
- `dotenv` — lit les secrets depuis `.env`
- `@nomicfoundation/hardhat-toolbox` — plugins (ethers, tests, Ignition, verify…)

---

### `.env.example`

**Rôle :** modèle des variables d’environnement (sans secrets réels).

**Variables documentées :**

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Clé privée du wallet de déploiement |
| `AMOY_RPC_URL` | URL RPC du testnet Polygon Amoy |
| `POLYGONSCAN_API_KEY` | Clé API pour vérifier les contrats sur Polygonscan |

**Usage :** copier vers `.env`, puis remplir les vraies valeurs. Le fichier `.env` ne doit **jamais** être commité.

---

### `.gitignore`

**Rôle :** indique à Git les fichiers/dossiers à ignorer.

**Ignore notamment :**
- `node_modules/`
- `artifacts/`, `cache/`, `coverage/`
- `ignition/deployments/`
- `.env` et variantes locales
- logs, fichiers IDE, builds

**Pourquoi il existe :** évite de versionner les secrets, les binaires générés et le bruit de build.

---

### `README.md`

**Rôle :** documentation principale du projet (en anglais).

**Contient :**
- Présentation du stack technique
- Structure du projet
- Prérequis
- Installation des dépendances
- Compilation, tests
- Déploiement local
- Déploiement sur Polygon Amoy
- Tableau des commandes utiles
- Prochaines étapes pour les contrats DAO Chronos

---

### `DESCRIPTION_FICHIERS.md`

**Rôle :** ce document — descriptions détaillées de chaque fichier créé (en français).

---

## 2. Dossier `contracts/`

### `contracts/HelloChronos.sol`

**Rôle :** smart contract Solidity minimal pour **valider l’environnement** (compile → test → deploy).

**Ce n’est pas** un contrat métier Chronos DAO ; c’est un contrat de vérification.

**Éléments principaux :**

| Élément | Description |
|---------|-------------|
| `greeting` | Message stocké on-chain (privé) |
| `deployer` | Adresse du déployeur (`immutable`) |
| `GreetingUpdated` | Événement émis lors d’un changement de message |
| `constructor` | Initialise le greeting ; refuse une chaîne vide |
| `greet()` | Lit le message actuel |
| `setGreeting()` | Met à jour le message (réservé au déployeur) |

**Version Solidity :** `^0.8.28`  
**Licence :** MIT

---

## 3. Dossier `scripts/`

### `scripts/deploy.js`

**Rôle :** script de déploiement **impératif** avec ethers.js + Hardhat.

**Comportement :**
1. Récupère le compte déployeur et le réseau
2. Affiche l’adresse et le solde
3. Déploie `HelloChronos` avec le message `"Hello, Chronos!"`
4. Affiche l’adresse du contrat et le greeting on-chain
5. Sur Amoy, affiche la commande `hardhat verify` à lancer

**Commandes typiques :**
```bash
npx hardhat run scripts/deploy.js
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy.js --network amoy
```

---

## 4. Dossier `test/`

### `test/HelloChronos.test.js`

**Rôle :** suite de tests unitaires Mocha + Chai pour `HelloChronos`.

**Utilise :**
- `ethers` (Hardhat) pour déployer et appeler le contrat
- `loadFixture` pour isoler rapidement chaque test
- Matchers Chai (`expect`, `revertedWith`, `emit`)

**Scénarios couverts :**

| Groupe | Tests |
|--------|--------|
| **Deployment** | Greeting initial correct · Adresse deployer enregistrée · Revert si greeting vide |
| **setGreeting** | Mise à jour par le deployer · Émission de l’événement · Revert si non-deployer · Revert si greeting vide |

**Lancer les tests :**
```bash
npx hardhat test
# ou
npm test
```

---

## 5. Dossier `ignition/`

### `ignition/modules/HelloChronos.js`

**Rôle :** module **Hardhat Ignition** pour un déploiement déclaratif et reproductible.

**Différence avec `scripts/deploy.js` :**
- `deploy.js` = script manuel (idéal pour un premier essai)
- Ignition = déploiement déclaratif, idempotent, mieux adapté quand plusieurs contrats et dépendances apparaîtront

**Contenu :**
- Module nommé `HelloChronosModule`
- Paramètre `initialGreeting` (défaut : `"Hello, Chronos!"`)
- Déploiement du contrat `HelloChronos`

**Commandes typiques :**
```bash
npx hardhat ignition deploy ignition/modules/HelloChronos.js --network localhost
npx hardhat ignition deploy ignition/modules/HelloChronos.js --network amoy
```

---

## 6. Fichiers / dossiers générés (non créés à la main)

Ces éléments apparaissent après installation ou compilation ; ils ne font pas partie du code source à éditer.

| Chemin | Description |
|--------|-------------|
| `node_modules/` | Toutes les librairies npm installées |
| `artifacts/` | ABI, bytecode et métadonnées des contrats compilés |
| `cache/` | Cache Soft Hardhat / solc pour accélérer les recompilations |
| `.env` | Secrets locaux (créé par toi à partir de `.env.example`) |

---

## 7. Récapitulatif rapide

| Fichier | Type | À modifier souvent ? |
|---------|------|----------------------|
| `contracts/HelloChronos.sol` | Smart contract | Non (sera remplacé par les contrats DAO) |
| `scripts/deploy.js` | Script JS | Oui, pour chaque nouveau contrat |
| `test/HelloChronos.test.js` | Tests | Oui, en parallèle des contrats |
| `ignition/modules/HelloChronos.js` | Module Ignition | Oui, pour les déploiements complexes |
| `hardhat.config.js` | Config | Rarement (réseaux, solc, plugins) |
| `package.json` | Manifeste | Quand on ajoute des deps / scripts |
| `.env.example` | Template secrets | Si de nouvelles variables apparaissent |
| `.gitignore` | Git | Rarement |
| `README.md` | Docs | À mettre à jour avec le projet |
| `DESCRIPTION_FICHIERS.md` | Docs (FR) | Quand la structure évolue |

---

## Prochaine étape prévue

Une fois l’environnement validé avec `HelloChronos`, les prochains fichiers à créer seront les **vrais contrats Chronos DAO** (registre d’assets, gouvernance, allocation de ressources, etc.) dans `contracts/`, avec leurs tests et modules Ignition associés.
