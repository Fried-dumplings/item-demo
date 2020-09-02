import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: JSON.parse(sessionStorage.getItem("token")) ? JSON.parse(sessionStorage.getItem("token")) : "",
        user: JSON.parse(sessionStorage.getItem("user")) ? JSON.parse(sessionStorage.getItem("user")) : {}
    },

    mutations: {
        remove(state) {
            console.log(222);
            state.token = '';
            state.user = {};
        },

        addUser(state, payload) {
            state.token = JSON.parse(sessionStorage.getItem("token"));
            state.user = JSON.parse(sessionStorage.getItem("user"));
        },



        handleDelete(stare, payload) {

            console.log(22);
            // console.log(stare, payload);
        }





    }


})