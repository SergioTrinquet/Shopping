<template>
    <app-overlay 
        :display="displayMarginDepartments" 
        @click.native="closeMarge"
        class="addTransition"
    >
        <div id="marge">
            <div 
                class="rayon"
                v-for="department in departments" 
                :key="department.id"
                @click="displayProducts(department.id)"
            >
                <span class="primary-txt">{{ department.intitule | uppercase }}</span>
                <font-awesome-icon icon="chevron-right" class="secondary-txt" />
            </div>
        </div>
    </app-overlay>
</template>

<script>
import uppercase from '@/filters/uppercase'

export default {
    name: 'DepartmentsMargin',

    filters: { uppercase },

    computed: {
        displayMarginDepartments() {
            return this.$store.state.display_margin_departments;
        },
        departments() {
            return this.$store.state.departments;
        }
    },

    methods: {
        displayProducts(id) {
            this.$store.dispatch('fetchProductsDepartment', id);
        },

        // Pour fermer la marge listant rayons qd click en dehors de celle-ci
        closeMarge(e) {
            if(e.target.className.includes('addTransition')) {
                this.$store.commit("SET_DISPLAY_MARGIN_DEPARTMENTS", false);
            }
        }
    }
}
</script>

<style scoped>
    /* Surcharge possible sur class '.overlay' présente dans composant enfant 'app-overlay', alors que pas utilisée ici !! */
    /* .overlay { */
    .addTransition {
        transition: background-color 0.5s ease-in-out;
    }

    #marge {
        position: fixed;
        z-index: 2;
        margin: 0;
        left: 0;
        width: 300px;
        margin-left: -300px;
        height: calc(100% - 60px);
        background-color: #f5f5f5;
        transition: margin-left 0.3s ease-in-out;
        box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2);
    }
    /* Sélecteur utilisant class qui sont décarées ds composant enfant */
    .overlay.display #marge {
        margin-left: 0;
    }

    .rayon {
        padding: 10px;
        border-top: dotted 1px #747474;
        text-align: left;
        position: relative;
        cursor: pointer;
    }
    .rayon:first-child {
        border-top-width: 0;
    }

    .rayon svg {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translate(50%, -50%);
        transition: transform 0.2s ease-in-out;
    }
    .rayon:hover svg {
        transform: translate(100%, -50%);
    }

    .rayon > span:before {
        content: "";
        background: rgba(0, 0, 0, 0.1);
        background: rgba(130,201,30, 0.2);
        width: 0%;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        transition: width 0.3s ease-in-out;
    }
    .rayon:hover > span:before {
        width: 100%;
    }
</style>