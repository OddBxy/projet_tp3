# Fruit Market Décentralisé (DApp)

Ce dépôt contient le projet final (TP3) du cours IFT-7100 : Concepts et applications de la chaîne de blocs. Il s'agit d'un marché de fruits décentralisé permettant l'achat et la gestion d'un catalogue via un système de contrats intelligents Upgradable.

**Auteur :** LANIER Théo

---

## Architecture Technique

Le projet repose sur une architecture de type "Proxy" permettant la mise à jour de la logique métier sans changer l'adresse du contrat ni perdre les données d'inventaire.

* **Smart Contracts :** Solidity, Hardhat
* **Sécurité & Standards :** OpenZeppelin (Transparent Proxy Pattern)
* **Réseau :** Ethereum Testnet (Sepolia)
* **Frontend :** Angular 17+ avec Wagmi et Viem pour l'interaction avec la blockchain.

---

## Structure du Projet

* `/tp3_smartContract` : Contient les contrats Solidity, les scripts de déploiement et les tests unitaires.
* `/tp3_frontEnd` : Contient l'application Angular (Frontend).

---

## Exécution et Installation

### 1. Prérequis
Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé ainsi qu'un portefeuille (ex: MetaMask) configuré sur le réseau Sepolia.

### 2. Tests
Pour lancer la suite de tests unitaires automatisés :

```Bash
cd tp3_smartContract
npx hardhat test
```

### 3. Application Web (Frontend)
Les contrats étant déjà déployés sur Sepolia, vous pouvez lancer l'interface immédiatement sans déploiement supplémentaire :
```bash
cd tp3_frontEnd
npm install
ng serve
```

## Exécution Locale

Si vous souhaitez tester l'intégralité du cycle de vie (déploiement + upgrade) localement :

### 1. Préparer le nœud local
Dans un premier terminal :
```bash
cd tp3_smartContract
npx hardhat node
```

### 2. Déployer les contrats (V1 puis V2)
Dans un second terminal :

```bash
# Déploiement initial (V1 + Proxy + ProxyAdmin)
npx hardhat ignition deploy ignition/modules/ProxyModule.ts --network localhost

# Mise à jour vers la V2 (Upgrade)
npx hardhat ignition deploy ignition/modules/UpgradeModule.ts --network localhost
```


### 3. Configuration du Frontend
Pour que l'application Angular pointe sur votre machine locale, modifiez les fichiers suivants :

tp3_frontEnd/src/app/wagmi.config.ts : Assurez-vous que la chaine hardhat est utilisée dans la configuration du client.

tp3_frontEnd/src/app/services/fruit-market-accessor.ts :

Modifiez chainAddress pour utiliser http://127.0.0.1:8545.

Mettez à jour contractAddress avec l'adresse du Proxy générée lors du déploiement local (affichée dans le terminal par Ignition).

### 4. Lancer le Frontend

```bash
cd tp3_frontEnd
ng serve --open
```

## Détails du Contrat (Sepolia)
L'adresse du Proxy est le point d'entrée pour l'application Frontend sur le réseau de test.

Adresse du Proxy : 0xd84DdFaC197149116536492C9e5A31e170c9F06d
Implémentation actuelle : FruitMarketV2

