<template>
    <app-overlay 
        :display="message !== null && closeEncart == false" 
        :onTop="true"
    >
        <div class="encartErreur">
            <!-- {{ "closeEncart => " + closeEncart }} - {{ message !== null && closeEncart == false }} --> <!-- TEST -->
            <font-awesome-icon icon="times" id="close" @click="closeEncart = true" />
            <div class="header">
                <font-awesome-icon icon="exclamation-circle" />
                ERREUR
            </div>
            <div class="content" v-if="!isObject">{{ message }}</div>
            <div class="content" v-else>
                <div class="status">{{ message.statusText }} (Code {{ message.status }})</div>
                <div class="titre">{{ message.data.titre }}</div>
                <div class="message">{{ message.data.message }}</div>
                <div>
                    <div class="stackTitle">Détails</div>
                    <div class="stack">{{ message.data.stack }}</div>
                </div>
            </div>
        </div>
    </app-overlay>
</template>

<script>
export default {
    name: 'EncartMsgErreur',

    props: {
        message: {
            required: true
        }
    },

    data() {
        return {
            closeEncart: false
        }
    },

    computed: {
        // Si 'message' est un objet, signifie que erreur coté Node.js, et on change l'interface car plusieurs champs à afficher au lieu d'un seul
        isObject() {
            return (typeof this.message === "object" ? true : false);
        }
    }
}
</script>

<style scoped>
.encartErreur {
    position: absolute;
    z-index: 1001;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    box-sizing: border-box;
    max-height: 80vh;
    background-color: #ff5858;
    color: #fff;
    border-radius: 5px;
    padding: 20px 30px;
    font-weight: bold;
}
.overlay:not(.display) .encartErreur {
    display: none;
}

.encartErreur .header {
    border-bottom: dotted 1px #fff;
    padding: 0 0 5px 0;
}
.encartErreur .content {
    margin: 10px 0 0 0;
    overflow-y: auto;
    max-height: calc(80vh - 80px); /* Voir si pas meilleure façon de faire */
}

#close {
    position: absolute;
    top: 18px;
    right: 18px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
}
#close:hover {
    transform: rotate(180deg);
}

.status {
    font-style: italic;
    font-size: 15px;
}
.stackTitle {
    text-decoration: underline dotted 1px #fff;
    line-height: 16px;
    margin-top: 10px;
}
.stack {
    font-style: italic;
    font-size: 14px;
    line-height: 17px;
}
</style>