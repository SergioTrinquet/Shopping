<template>
  <app-overlay :display="message !== null && closeEncart == false">
        <div class="encartErreur">
            <!-- {{ "closeEncart => " + closeEncart }} - {{ message !== null && closeEncart == false }} --> <!-- TEST -->
            <font-awesome-icon icon="times" id="close" @click="closeEncart = true" />
            <div class="header">
                <font-awesome-icon icon="exclamation-circle" />
                ERREUR
            </div>
           <div class="content">{{ message }}</div>
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
    background-color: #ff5858;
    color: #fff;
    border-radius: 5px;
    padding: 20px 30px;
    font-weight: bold;
}

.encartErreur .header {
    border-bottom: dotted 1px #fff;
    padding: 0 0 5px 0;
}
.encartErreur .content {
    margin: 10px 0 0 0;
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
</style>