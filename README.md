# shopping-app

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


# Démarches pour MongoDB Atlas
1. Aller sur le site "mongodb.com//atlas" (Voir ds le tuto #9 Node.js Crash Course Tutorial de The Net Ninja)
2. Se créer un compte
3. Créer un Project, un cluster, une database, une collection et un user
4. Alimenter les collections créées à l'étape précédente avec Mongo shell, ou bien si vous travaillez avec l'éditeur Visual Studio Code (comme beaucoup de gens :-)), téléchargez l'extension 'MongoDB for VS Code' (icone sur le bord gauche de l'éditeur pour accéder au marketplace), puis connectez-vous à votre cluster et executez le fichier 'Generation_db_shopping_collections.mongodb' dans le projet.

# Démarches pour MongoDB Atlas Search
https://developer.mongodb.com/how-to/build-movie-search-application/

Les requêtes qui vont interroger la bdd pour obtenir les intitulés de rayons, les produits et leurs caractéristiques  sont faites avec mongoDB.
## Moteur de recherche
La recherche sur les produits et marques est géré avec mongodb Atlas via l'interface.
La recherche comprend:
- Une autocompletion. Dès les premiers caractères saisis, des produits sont proposés pour aider l'utilisateur et lui éviter de devoir saisir le terme exact dans le moteur de recherche pour qu'il s'affiche,
- Le surlignage des termes recherchés (ou highlight), 
- Des résultats proposés avec une tolérence de variation de caractère (dont le nombre est à paramétrer, ici 1).
 Cela permet de trouver ce que l'on recherche malgré une erreur de frappe ou d'orthographe.

Expliquer à quoi sert un index et comment on fait l'index pour l'autocompletion

NOTE : Attention ! Les index seront supprimés lorsque vous alimentez la liste des articles via le fichier '.mongodb'
