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

#### User Story

- Page de veille qui s'active au bout de 5 d'inactivité

- Click sur la page de veille => accueil

---

##### Accueil

- logo

- date ar/fr

- heure

- 2 boutons =

    - Faire un don

    - découvrir Projet

##### Dons

- bouton retour

- Sélection des montants

    - **Montants en bdd & visible + Autre montant**

Autre page pour passer la carte de paiement + champs

Page de validation de la banque

## Back

1. Nodejs/express

2. php

3. django

---

### Routes/Endpoints

#### Users

- GET

```js
//GET USER INFO
"http://localhost:3003/users/getMe" 
```

- GET

```js
//LOGOUT
"http://localhost:3003/users/logout" 
```

- POST

```js
//ADD USER
"http://localhost:3003/users/signup" 
```

- POST

```js
//LOG IN
"http://localhost:3003/users/signin" 
```

- PUT

```js
//UPDATE USER BY ID
"http://localhost:3003/users/updateUser/:userId" 
```

- PUT

```js
//UPDATE USER PASSWORD
"http://localhost:3003/users/updatePassword/:userId" 
```

- PUT

```js
//UPDATE USER ROLE
"http://localhost:3003/users/updateRole/:userId" 
```

- DELETE

```js
//DELETE USER BY ID
"http://localhost:3003/users/deleteUser/:userId" 
```

#### Historic

- GET

```js
//GET ALL HISTORIC
"http://localhost:3003/historic" 
```

- GET

```js
//GET ALL HISTORIC BY USER FIRTSNAME AND LASTNAME
"http://localhost:3003/historic/user/:firstname/:lastname" 
```

- GET

```js
//GET ONE HISTORIC BY ID
"http://localhost:3003/historic/:idHistoric" 
```

- POST

```js
//ADD ONE HISTORIC
"http://localhost:3003/historic" 
```

#### Price

- GET

```js
//GET ALL PRICES
"http://localhost:3003/prices" 
```

- GET

```js
//GET AVAILABLE PRICES
"http://localhost:3003/prices/available" 
```

- POST

```js
//ADD PRICE
"http://localhost:3003/prices" 
```

- PUT

```js
//UPDATE HISTORIC
"http://localhost:3003/prices/update/:priceId" 
```

- DELETE

```js
//DELETE PRICE
"http://localhost:3003/prices/delete/:priceId" 
```


## Base de données

**SQL**

***

#### Tables/Collection

- Users (id, username, email, password, nom, prenom, role)

- Projects (id, title, description)

- Section (id, title, content, imgs, idProject)

- Paiements Historic (id, amount, nom, prenom, email, creationDatetime)

- Available Prices (id, amount, isavailable)

# Section Projet

- Autant de section que voulu

- Autant d'image que voulu en diapo

# Liens

[Lien backend](https://github.com/ouss17/nfc_project_back)

[Lien frontend](https://github.com/am2408/nfc_project_front)


# Review 1

- Ajout des tables
    - Config
    - Mosquee

- Page Home => directement interface Dons + petite section quelque part pour voir les projets

- Voir possibilité de ne pas mettre firstname & lastname mais essayer de garder un élément pour find débiteur

- Virer champs de carte et garder que le nfc et mettre un petit bouton "Je n'ai pas le sans contact"

- Mode jumua (non mvp)

- Possiblement enlever écran de veille

- Responsive sur Grands écrans surtout mais aussi sur tél