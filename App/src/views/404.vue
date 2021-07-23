<template>
    <div class="encart404">
        <div class="badPath">
            <font-awesome-icon icon="exclamation-circle" class="icon" />Oups! La page que vous voulez afficher<br />n'existe pas.
        </div>
        <a href="/" class="secondary hover">Retour à la page d'accueil</a>
    </div>
</template>

<style scoped>
.encart404 {
    background-color: rgb(241, 241, 241);
    border-radius: 3px;
    padding: 30px;
    margin: 200px auto 0 auto;
    text-align: center;
    width: 40%;
    max-width: 700px; 
}
.badPath {
    font-size: 20px;
    line-height: 25px;
    margin: 0 0 25px 0;
}
.encart404 a {
    display: inline-block;
    border-radius: 5px;
    padding: 5px 20px;
    font-size: 14px;
    color: #fff;
    font-weight: bold;
    text-decoration: none;
    transition: 0.2s all ease-in-out;
}
.icon {
    margin: 0 10px 0 0;
}
</style>