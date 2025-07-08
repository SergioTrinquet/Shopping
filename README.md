# Site de courses en ligne

## Documentation utilisateur

Le but de cette application était de tenter de reproduire un site classique de course en ligne. Après avoir regardé ce qui existe, je me suis inspiré de certains d'entre eux pour ce qui est des fonctionnalités (moteur de recherche, classification des articles par rayons, présentation des produits,...).  

**[Cliquez ici](https://shoppingapp-backend-6wfv.onrender.com/) pour voir l'application en ligne.**

_Page d'accueil_
![page d'accueil](App/src/assets/imgs/README_screenshots/pg_accueil.png)

### Trouver un article
Il existe plusieurs moyens de trouver des articles pour constituer son panier :

- En recherchant par rayon (icone en haut à droite de l'écran): Une marge à gauche de l'écran apparait présentant une liste de rayons (cf. img ci-dessous).  
Lorsque l'on clique sur l'un d'entre eux, les produits correspondants apparaissent.


![page d'accueil](App/src/assets/imgs/README_screenshots/marge_rayons.png)


- En utilisant la recherche principale, dans le bandeau en haut de l'écran.  
Un autocomplete apparait pour proposer des articles en fonction de la saisie de l'utilisateur (cf.img ci-dessous). La liste de l'autocomplete est mise à jour à chaque frappe dans le champ de recherche.  
L'utilisateur peut cliquer sur un des articles proposés, ou bien valider sa saisie dans le champ de recherche.

_Liste de proposition d'articles lors de la recherche_
![Autocomplete](App/src/assets/imgs/README_screenshots/autocomplete.png)

### Les filtres
De nombreux produits peuvent correspondre à la recherche.  
Des filtres sont donc présents dans la marge pour trouver plus rapidement l'article recherché (cf. img ci-dessous).  

_Marge filtres et liste des produits_
![Autocomplete](App/src/assets/imgs/README_screenshots/liste_produits.png)

Vous pouvez filtrer :
- Les articles en promotion,
- Les articles made in France,
- Par marque, 
- Par nutriscore, 
- Par label qualité  

Ces filtres sont cumulables bien entendu.  
A noter que vous pouvez filtrer sur les marques avec un champ de saisie pour trouver facilement celle(s) qui vous intéresse

### Panier

Vous ajoutez vos articles en saisissant la quantité désirée (icone panier en bas à droite d'un encart article).  
L'état de votre panier est consultable à tout moment en cliquant sur l'icone en haut à droite de l'écran. Le montant du panier est affiché en dessous de l'icône.  

_Liste de produits filtrés et panier_
![Autocomplete](App/src/assets/imgs/README_screenshots/liste_produits_filtrees.png)


Vos articles sélectionnés sont alors visibles dans la marge qui s'ouvre à droite de l'écran (cf. img ci-dessous).  

_Marge panier_
![Autocomplete](App/src/assets/imgs/README_screenshots/marge_panier.png)


Vous pouvez y changer les quantités commandées, supprimer un article (en mettant la quantité à zéro, ou en cliquant sur l'icone poubelle en haut à droite du produit), ou enfin valider votre commande, ce qui videra votre panier et vous redirigera vers la page d'accueil.

### Promotions

Le calcul du prix du panier tient compte des promotions sur les articles (s'il y en a).  
Ces promos sont de 2 types:
- Un pourcentage sur le prix,
- Une réduction pour X articles commandés.


### Améliorations possibles

Par manque de temps, je n'ai pas pu développer tout ce que je voulais mettre en place. Il serait par exemple souhaitable d'ajouter un système d'authentification avec login/mot de passe. Cela permettrait à l'utilisateur:
  - d'enregistrer (dans mongoDB) ses courses et ainsi d'avoir son historique en page d'accueil,
  - de mettre en place une fonctionnalité de création de panier(s) type(s) en cochant les produits qui serai(en)t dans ce(s) panier(s) 

## Documentation technique

### Technologies utilisées
Vue.js + Node.js + mongoDB


### Démarches pour MongoDB Atlas

#### Inscription et connexion

Les données des rayons et des articles sont stockées avec mongoDB Atlas qui est la version Cloud de ce système de gestion de bases de données NoSQL.  
Mais avant de pouvoir l'utiliser, il va falloir faire quelques installations.  
Je vous invite à regarder l'excellent tutoriel de The Net Ninja (tuto #9 Node.js Crash Course Tutorial) pour vous aider dans cette tache ([lien tuto]()) : 

1. Aller sur le site [https://www.mongodb.com/fr-fr/cloud/atlas](https://www.mongodb.com/fr-fr/cloud/atlas),
2. Se créer un compte
3. Créer :
  - Un cluster, 
  - Une database avec comme nom '_db_shopping_', 
  - Des collections aux noms de '_departments_' et '_products_',
  - Un user (laisser les options 'read and write to any database' lors de cette étape),
4. Alimenter les collections créées à l'étape précédente avec Mongo shell, ou bien si vous travaillez avec l'éditeur Visual Studio Code (comme beaucoup de gens :-)), téléchargez l'extension '_MongoDB for VS Code_' (une icone apparaitra alors sur le bord gauche de l'éditeur pour accéder au marketplace), puis connectez-vous à votre cluster et executez le fichier '_Generation_db_shopping_collections.mongodb_' dans le projet.  
L'exécution de ce fichier va alimenter les collections '_departments_' et '_products_'  
5. Dans le menu '_Cluster_', lorsque l'on clique sur le bouton '_connect_', une fenêtre apparait. En choisissant l'option '_Connect your application_', vous verrez alors la chaine de connexion qui va permettre de dialoguer avec la base de données.  
Cette chaine est déjà présente dans le projet (fichier '_/API/index.js_') mais si vous avez créé votre propre base de données et que vous voulez la connecter à l'application, il faudra la remplacer par la votre, en prenant soin de ne pas mettre les login, mot de passe et nom de la base de donnée en dur.  
Ces paramètres sont dans des variables : Nous les avons externalisées dans un fichier _'.env'_ (modèle ci-dessous) qu'il vous faudra créer à la racine du projet.

_Fichier '.env': Remplacez la valeur des variables par celles que vous avez saisies lors de la création de votre bdd_
```
MONGODB_URL_CONNEXION_USERNAME = "XXXXX"
MONGODB_URL_CONNEXION_PASSWORD = "XXXXX"
MONGODB_URL_CONNEXION_DB = "XXXXX"
MONGODB_URL_CONNEXION_CLUSTERNAME = "XXXXX"
```


#### Moteur de recherche
Un champ de recherche sur les produits et marques se trouve dans le header de l'application.
Il fonctionne grace à des indexs que l'on doit créer avec Mongodb Atlas Search ([Voir le tuto ici](https://developer.mongodb.com/how-to/build-movie-search-application/)).  
Grace à son index, le champ de recherche comprend:
- <ins>Une autocompletion</ins>. Dès les premiers caractères saisis, des produits sont proposés pour aider l'utilisateur et lui éviter de devoir saisir le terme exact dans le moteur de recherche pour qu'il s'affiche,
- Des résultats proposés avec <ins>une tolérence de variation de caractère</ins> (dont le nombre est à paramétrer, ici 1).  
 Cela permet de trouver ce que l'on recherche malgré une erreur de frappe ou d'orthographe,
- <ins>Le surlignage</ins> (highlight) des termes au plus proche de ce que l'utilisateur a recherchés.


Concrètement, un index permet de mettre en place des fonctionnalités avancées de recherche.  
Pour créer ces indexs dans l'interface mongoDB Atlas, placez-vous dans votre cluster et cliquez sur le menu horizontal '_Search_'.

_interface mongoDB Atlas: page de création des indexs_
![Autocomplete](App/src/assets/imgs/README_screenshots/mongodb_index.png)

En cliquant sur le bouton 'Create Index', copiez/collez le code ci-dessous en prenant soin de le nommer '_products_autocomplete_'.   

_Index 'products_autocomplete' pour l'API alimentant l'autocompletion :_

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

Faites de même pour l'index '_products_'. Il sera utilisé dans les requêtes appelées suite à la validation sur le moteur de recherche de produits/marque:
- Pour rechercher des produits 
- Pour récupérer les filtres sur ces produits

Cet index doit être créé sur la collection '_products_'

```
{
  "mappings": {
    "dynamic": true
  }
}
```

_NOTE : Attention ! Les index seront supprimés lorsque vous alimentez la liste des articles via le fichier '_Generation_db_shopping_collections.mongodb_'_



## Pour que le projet tourne localement (phase de dev.)
### Installation du projet
Pour faire tourner le projet localement, allez à la racine du projet et lancez la commande:
```
npm run build
```
Cette commande execute le script suivant:
```
npm install && npm install --prefix App && npm run build --prefix App
```
Elle va installer les packages du back (code dans _'API'_) à la racine, et ceux du front dans le répertoire _'App'_. Elle va aussi builder la partie front en générant le répertoire _'public'_ dans _'API'_ (ceci est paramétré dans le fichier [vue.config.js](https://cli.vuejs.org/config/)).  

_NOTE: '--prefix App' signifie 'exécute la commande écrite précédamment dans le répertoire App'_

_NOTE: On aurait aussi pu générer le répertoire de build 'public' dans 'App', et dans 'API/index.js' pour le mode 'production', modifier les path des fichiers static et de la méthode GET pour qu'ils pointent dans ce répertoire 'App/public'_

### Compilation et hot-reloads
Allez à la racine du projet.  
Pour démarrer la partie back-end (répertoire API), lancez:
```
npm run dev
```
...Et pour la partie front-end (répertoire App), dans un autre terminal, lancez:
```
npm run dev:frontend
```
_NOTE: Il faut 2 terminaux dfférents pour démarrer le back et le front._


## Mise en production du projet
Les étapes de mise en prod. diffèrent selon l'hébergeur.  
Ici, j'ai choisi d'héberger l'application sur 'Render' car il peut héberger des web services (ce que Vercel ne peut pas par ex.). Cela est nécessaire pour faire tourner la partie back-end de notre projet.  
Le projet est structuré avec les package.json/package-lock.json et donc le répertoire node_modules, le fichier .env, pour la partie back-end, à la racine du projet.  
Je me suis inspiré de ce tutoriel vidéo (https://www.youtube.com/watch?v=5x5c487s1UQ&t=609s) mais il y a d'autres façons d'organiser son projet MERN.  

Voici comment j'ai procédé:
1. On s'inscrit sur [Render.com](https://dashboard.render.com/),
2. On y créé un Web service,  
3. On sélectionne son projet sur Github dans la partie _'Git Provider'_,  
4. On rempli le formulaire en sélectionnant notamment comme language 'node', la branche du projet sur Github que l'on veut déployer, la build command (ici _'npm run build'_) et la start command (_'npm run start'_).  
Enfin on ajoute les variables d'environnements qui se trouvent dans le fichier _'.env'_ à la racine du projet, et qui servent à la connexion de la bdd mongoDB.  


**Explication sur la liaison entre le back et le front en mode Production**:  
Du coté back-end du projet, dans le fichier de démarrage/d'initialisation _'index.js'_, on a ajouté du code interprété seulement en mode production. Il déclare en assets les fichiers du repertoire Front buildé (répertoire _'public'_) que l'on va générer plus bas, et affiche le fichier _'/public/index.html'_ pour toute requete.  
```
if(process.env.NODE_ENV === 'production') {
  // La partie front faite avec Vue.js est buildée dans le rep. 'public' qui est déclaré comme static
  app.use(express.static(__dirname + '/public/'));
  // Pour ttes requetes 'get', affichage de la page 'index.html' du code front buildé dans rep. 'public'
  app.get(/.*/, (req, res) => res.sendFile(__dirname + '/public/index.html'))
}
```

