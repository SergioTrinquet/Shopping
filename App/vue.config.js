const path = require("path");

module.exports = {
    // Config du proxy qui intercepte ttes les requetes coté Front-End commençant par '/api' pour les rediriger vers 'localhost:3080' qui est l'URL du serveur de dev Node.js (coté Back-end)
    // Source "https://medium.com/bb-tutorials-and-thoughts/how-to-develop-and-build-vue-js-app-with-nodejs-backend-typescript-version-2eeb0f10e87f" => "Vue CLI provides some inbuilt functionality and to tell the development server to proxy any unknown requests to your API server in development, we just need to add this file at the root where package.json resides and configures the appropriate API paths."
    // Soure complementaire "https://cli.vuejs.org/config/#devserver-proxy"
    devServer: {
        proxy: {
          '^/api': {
            target: 'http://localhost:3080',
            ws: true,
            changeOrigin: true,
            //pathRewrite: { '^/api': '' } // On réécrit le path de la requete envoyée coté Front pour retirer la partie '/api' qui n'existe pas dans les path du coté API 
          }
        }
    },

    // Désigne où doit être placé et comment doit se nommer le répertoire de l'appli buildée (exécutée donc avec cmd 'npm run buid')
    outputDir: path.resolve(__dirname, '../API/public'),
  }