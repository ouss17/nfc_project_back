# Prérequis

- Tablette **NFC** avec connexion et alimentation continue
- Compte Stripe dev
- Trépied
- Forfait mobile internet || routeur

# Tablette

#### Résolution

*Résolution **1920 x 1200 pixels** → Viewport logique environ **960 x 600 pixels** ou similaire.*

```css

@media (min-width: 600px) and (max-width: 960px) { /* Styles pour tablettes */ }

```

# Langages

## Front

*React Native*

## Back

1. Nodejs/express
2. php
3. django

## Base de données

**SQL**
***
#### Tables/Collection

- Users (id, username, email, password, nom, prenom, role)
- Projects (id, title, description)
- Section (id, title, content, imgs, idProject)
- Paiements Historic (id, amount, nom, prenom, email)
- Available Prices (id, amount, isavailable)


# Section Projet

- Autant de section que voulu
- Autant d'image que voulu en diapo


# Liens

[Lien backend](https://github.com/ouss17/nfc_project_back)