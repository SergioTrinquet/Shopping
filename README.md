# Site de courses en ligne

## Documentation utilisateur

Le but de cette application était de tenter de reproduire un site de  course en ligne. Après avoir regardé ce qui existe, je me suis inspiré de certains d'entre eux pour ce qui est des fonctionnalités (moteur de recherche, classification des articles par rayons, présentation des produits,...).

_Page d'accueil_
![page d'accueil](\App\src\assets\imgs\README_screenshots\pg_accueil.png)

### Trouver un article
Il existe plusieurs moyens de trouver des articles pour constituer son panier :

- En recherchant par rayon (icone en haut à droite de l'écran): Une marge à gauche de l'écran apparait présentant une liste de rayons (cf. img ci-dessous).  
Lorsque l'on clique sur l'un d'entre eux, les produits correspondants apparaissent.


![page d'accueil](\App\src\assets\imgs\README_screenshots\marge_rayons.png)


- En utilisant la recherche principale, dans le bandeau en haut de l'écran.  
Un autocomplete apparait pour proposer des articles en fonction de la saisie de l'utilisateur (cf.img ci-dessous). La liste de l'autocomplete est mise à jour à chaque frappe dans le champ de recherche.  
L'utilisateur peut cliquer sur un des articles proposés, ou bien valider sa saisie dans le champ de recherche (bt entrée ou clic sur icone Loupe).

_Liste de proposition d'articles lors de la recherche_
![Autocomplete](\App\src\assets\imgs\README_screenshots\autocomplete.png)

### Les filtres
De nombreux produits peuvent correspondre à la recherche.  
Des filtres sont donc présents dans la marge pour trouver plus rapidement l'article recherché (cf. img ci-dessous).  

_Marge filtres et liste des produits_
![Autocomplete](\App\src\assets\imgs\README_screenshots\liste_produits.png)

Vous pouvez filtrer :
- Les articles en promotion,
- Les articles made in France,
- Par marque, 
- Par nutriscore, 
- Par label qualité  

Ces filtres sont cumulables bien entendu.  
A noter que vous pouvez filtrer sur les marques avec un champ de saise pour trouver facilement celle(s) qui vous intéresse

### Panier

Vous ajoutez vos articles en saisissant la quantité désirée (icone panier en bas à droite d'un encart article).  
L'état de votre panier est consultable à tout moment en cliquant sur l'icone en haut à droite de l'écran en dessous de laquelle est visible la somme correspondant à ce panier.  

_Liste de produits filtrés et panier_
![Autocomplete](\App\src\assets\imgs\README_screenshots\liste_produits_filtrees.png)


Vos articles sélectionnés sont alors visibles dans la marge qui s'ouvre à droite de l'écran (cf. img ci-dessous).  

_Marge panier_
![Autocomplete](\App\src\assets\imgs\README_screenshots\marge_panier.png)


A partir de là, vous pouvez y changer les quantités commandées, supprimer un article (en mettant la quantité à zéro, ou en cliquant sur l'icone poubelle en haut à droite du produit), ou enfin valider votre commande, ce qui videra votre panier et vous redirigera vers la page d'accueil.

### Promotions

Le calcul du prix du panier tient compte bien sur des promotions sur les articles (s'il y en a).
Ces promos sont de 2 types:
- Un pourcentage sur le prix,
- Une réduction pour X articles commandés.


### Améliorations possibles

Par manque de temps, je n'ai pas pu développertout ce que je voulais mettre en place. Il serait par exemple souhaitable de:
- Rendre l'application responsive, pour que l'affichage s'adapte aux petits écrans
- Mettre en place un système d'authentification avec login/mot de passe. Cela permettrait à l'utilisateur:
  - d'enregistrer (dans mongoDB) ses courses et ainsi d'avoir son historique en page d'accueil,
  - de mettre en place une fonctionnalité de création de panier(s) type(s) en cochant les produits qui serai(en)t dans ce(s) panier(s) 

## Documentation technique

### Technologies utilisées
Vue.js + Node.js + mongoDB


### Démarches pour MongoDB Atlas

Les données de l'application propres aux rayons et aux articles sont stockées avec mongoDB Atlas qui est la version Cloud de ce système de gestion de bases de données NoSQL.  
Mais avant de pouvoir l'exploiter, il va falloir faire quelques installations.  
Je vous invite à regarder l'excellent tutoriel de The Net Ninja (tuto #9 Node.js Crash Course Tutorial) pour vous aider dans cette tache ([lien tuto]()) : 

1. Aller sur le site "mongodb.com//atlas",
2. Se créer un compte
3. Créer :
- un Project, 
- un cluster, 
- une database avec comme nom 'db_shopping', 
- des collections aux noms de 'departments' et 'products',
- un user
4. Alimenter les collections créées à l'étape précédente avec Mongo shell, ou bien si vous travaillez avec l'éditeur Visual Studio Code (comme beaucoup de gens :-)), téléchargez l'extension 'MongoDB for VS Code' (icone sur le bord gauche de l'éditeur pour accéder au marketplace), puis connectez-vous à votre cluster et executez le fichier 'Generation_db_shopping_collections.mongodb' dans le projet.  
L'exécution de ce fichier va alimenter les collections 'departments' et 'products' que vous aurez créées au préalable.


**PS :Ne pas oublier de dire qu'il faut créer un fichier 'identifiants_mongoDB.js' dans le répertoire 'API/config' du style pour pouvoir accéder à sa collection dans mongoDB Atlas**
```
module.exports = {
    "username": "XXXXX",
    "password": "XXXXX",
    "db": "XXXXX"
}
```


### Démarches pour MongoDB Atlas Search
Pour permettre au champ de recherche articles (en haut de page) de fonctionner, il faut d'abord créer des indexs dans mongoDB Atlas.
https://developer.mongodb.com/how-to/build-movie-search-application/

_interface mongoDB Atlas: page de création des indexs_
![Autocomplete](\App\src\assets\imgs\README_screenshots\mongodb_index.png)


## Moteur de recherche
La recherche sur les produits et marques est géré avec mongodb Atlas via l'interface.
La recherche comprend:
- Une autocompletion. Dès les premiers caractères saisis, des produits sont proposés pour aider l'utilisateur et lui éviter de devoir saisir le terme exact dans le moteur de recherche pour qu'il s'affiche,
- Le surlignage des termes recherchés (ou highlight), 
- Des résultats proposés avec une tolérence de variation de caractère (dont le nombre est à paramétrer, ici 1).
 Cela permet de trouver ce que l'on recherche malgré une erreur de frappe ou d'orthographe.

Expliquer à quoi sert un index et comment on fait l'index pour l'autocompletion

Index 'products_autocomplete' pour l'API alimentant l'autocompletion :

```
{
  "mappings": { 
    "dynamic": false,
    "fields": {
      "intitule": [
        {
          "type": "string"
        },
        {
          "foldDiacritics": false,
          "maxGrams": 10,
          "minGrams": 4,
          "type": "autocomplete"
        }
      ],
      "marque": [
        {
          "type": "string"
        },
        {
          "foldDiacritics": false,
          "maxGrams": 10,
          "minGrams": 4,
          "type": "autocomplete"
        }
      ]
    }
  }
}
```

Index 'products' utilisé dans les requetes suite à la validation sur le moteur de recherche de produits/marque:
- Pour rechercher des produits 
- Pour récupérer les filtres sur ces produits

Cet index doit être créé sur la collection 'products'

```
{
  "mappings": {
    "dynamic": true
  }
}
```

NOTE : Attention ! Les index seront supprimés lorsque vous alimentez la liste des articles via le fichier '.mongodb'





  ## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

