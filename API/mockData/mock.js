module.exports = {
        rayons: [
            { _id: 1, intitule: "fruits et légumes" },
            { _id: 2, intitule: "viandes et poissons" },
            { _id: 3, intitule: "pains et pâtisseries" },
            { _id: 4, intitule: "frais" },
            { _id: 5, intitule: "surgelés" },
            { _id: 6, intitule: "épicerie salée" },
            { _id: 7, intitule: "épicerie sucrée" },
            { _id: 8, intitule: "boissons" },
            { _id: 9, intitule: "bébé" },
            { _id: 10, intitule: "entretien et nettoyage" },
            { _id: 11, intitule: "animalerie" }
        ],

        filtres: [
            {
                libelle: "nutriscore", 
                valeurs: [{id: 1, lettre: "A"}, {id: 2, lettre: "B"}, {id: 3, lettre: "C"}, {id: 4, lettre: "D"}, {id: 5, lettre: "E"}]
            },
            {
                libelle: "label qualité",
                valeurs: [{id: 1, label: "Bio"}, {id: 2, label: "Origine France"}]
            }
        ],

        produits: [
            {
                _id: "1_f&l",
                intitule: "bananes",
                descriptif: "Lot de 1kg",
                marque: "-",
                /* conditionnement: "1kg", */
                prix_unite: "3.80",
                unite: "kg",
                prix: "3.80",
                origine: "France",
                nom_image: "bananes_1kg",
                rayon: { id: 1, intitule: "fruits et légumes" },
                nutriscore: { id: 1, lettre: "A" },
                label_qualite: {},
                promotion: "-30%"
            },
            {
                _id: "2_f&l",
                intitule: "oranges",
                descriptif: "Filet de 2kg",
                marque: "-",
                /* conditionnement: "2kg", */
                prix_unite: "4.50",
                unite: "kg",
                prix: "9",
                origine: "Espagne",
                nom_image: "oranges_2kg",
                rayon: { id: 1, intitule: "fruits et légumes" },
                nutriscore: { id: 1, lettre: "A" },
                label_qualite: {},
                promotion: "-10%"
            },
            {
                _id: "3_f&l",
                intitule: "champignons",
                descriptif: "Lot de 300g",
                marque: "-",
                /* conditionnement: "2kg", */
                prix_unite: "17",
                unite: "kg",
                prix: "5.20",
                origine: "Italie",
                nom_image: "champignons_300g",
                rayon: { id: 1, intitule: "fruits et légumes" },
                nutriscore: { id: 1, lettre: "A" },
                label_qualite: {},
                promotion: null
            },


            {
                _id: "1_v&p",
                intitule: "Coq'ailes",
                descriptif: "Manchons de poulet nature - 500g",
                marque: "MAITRE COQ",
                /* conditionnement: "2kg", */
                prix_unite: "9.10",
                unite: "kg",
                prix: "4.55",
                origine: "France",
                nom_image: "MAITRE-COQ_manchons-de-poulet-nature",
                rayon: { id: 2, intitule: "viandes et poissons" },
                nutriscore: { id: 3, lettre: "C" },
                label_qualite: {},
                promotion: null
            },
            {
                _id: "2_v&p",
                intitule: "Viande hachée pur boeuf 5%",
                descriptif: "la barquette de 350g",
                marque: "MG CARREFOUR BIO",
                prix_unite: "18.71",
                unite: "kg",
                prix: "6.55",
                origine: "France",
                nom_image: "XXXXXX",
                rayon: { id: 2, intitule: "viandes et poissons" },
                nutriscore: { id: 1, lettre: "A" },
                label_qualite: {},
                promotion: "-10%"
            },
        ],

        // A faire ultérieurement qd la partie sélection de produits/panier/filtres fonctionnera
        utilisateur: {
            nom: "",
            prenom: "",
            adresse: {
                ville: "",
                CP: "",
                adresse:""
            },
            email: ""
        }


    }