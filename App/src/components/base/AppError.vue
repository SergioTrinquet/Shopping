<template>
    <app-overlay 
        :display="message !== null" 
        :onTop="true"
    >
        <div class="encartErreur">
            <font-awesome-icon 
                icon="times" 
                id="close" 
                @click="closeEncart" 
            />
            <div class="header">
                <font-awesome-icon icon="exclamation-circle" />
                ERREUR
            </div>
            <div class="content" v-if="!isObject">{{ message }}</div>
            <div class="content" v-else>
                <div class="status">{{ message.statusText }} (Code {{ message.status }})</div>

                <div v-if="typeof message.data =='string'">{{ message.data }}</div>
                <div v-if="typeof message.data =='object'">
                    <div class="titre">{{ message.data.titre }}</div>
                    <div class="details">
                        <div class="message">{{ message.data.message }}</div>
                        <div v-if="'stack' in message.data">
                            <div class="stackTitle" @click="displayStack = !displayStack">
                                <font-awesome-icon :icon="displayStack ? 'minus-circle' : 'plus-circle'" /> Plus de détails ici
                            </div>
                            <div class="stack" :class="{'display':displayStack}">{{ message.data.stack }}</div>
                        </div>
                    </div>
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
            //type: String || Object,
            required: true
        }
    },

    data() {
        return {
            displayStack: false
        }
    },

    computed: {
        // Si 'message' est un objet, signifie que erreur coté Node.js, et on change l'interface car plusieurs champs à afficher au lieu d'un seul
        isObject() {
            return (typeof this.message === "object" ? true : false);
        }
    },

    methods: {
        closeEncart() {
            this.$store.commit('SET_MESSAGE_ERROR', null);
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
    min-width: 200px;
    background-color: #ff5858;
    color: #fff;
    border-radius: 5px;
    padding: 20px 30px;
    font-weight: bold;
    box-shadow: 0 0 30px rgba(0,0,0,0.3);
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
    font-size: 14px;
    font-weight: normal;
}
.titre {
    line-height: 16px;
}
.stackTitle {
    text-decoration: underline dotted 1px #fff;
    cursor: pointer;
    font-size: 14px;
}
.stackTitle svg {
    margin-right: 3px;
    font-size: 12px;
}
.details {
    padding: 10px 15px;
    background-color: rgba(255,255,255,0.12);
    border-radius: 3px;
    margin: 15px 10px 10px 10px;
    box-shadow: inset 4px 0px 0 0px #fff;
    font-style: italic;
}
.message {
    font-size: 15px;
}
.stack {
    font-style: italic;
    font-size: 14px;
    line-height: 17px;
    margin: 0 10px 0 0;
    display: none;
}
.stack.display {
    display: block;
}
</style>