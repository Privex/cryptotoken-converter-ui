import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
Vue.config.productionTip = false
import coin_api from './coin_api.js'
import Convert from './components/Convert.vue'
import SelectCoin from './components/SelectCoin.vue'
import ListDeposits from './components/ListDeposits.vue'
import Vuex from 'vuex'

Vue.use(VueRouter)
Vue.use(Vuex)

coin_api.api_node = 'http://127.0.0.1:8000';

const routes = [
    { path: '/', component: SelectCoin },
    { path: '/deposits', component: ListDeposits },
    { path: '/convert/:from/:to/:destination', component: Convert, name: 'convert' }
]
const router = new VueRouter({
    routes
});

const store = new Vuex.Store({
  state: {
    coins: [],
    pairs: [],
    deposits: [],
    deposit_count: 0
  },
  mutations: {
    replacePairs (state, pairs) {
      state.pairs = pairs;
    },
    replaceCoins (state, coins) {
      state.coins = coins;
    },
    replaceDeposits (state, {deposits, count}) {
      state.deposits = deposits;
      state.deposit_count = count;
    },
  },
  actions: {
    loadCoins({ commit }) {
      return coin_api.load_coins().then(d => {
        commit('replaceCoins', d)
      })
    },
    loadPairs({ commit }) {
      return coin_api.load_pairs().then(d => {
        commit('replacePairs', d)
      })
    },
    loadDeposits({ commit }, { limit = 100, offset = 0, query }) {
      return coin_api.load_deposits(limit, offset, query).then(d => {
        commit('replaceDeposits', {deposits: d.results, count: d.count});
      })
    }
  }
})

Object.defineProperty(Vue.prototype, '$coinapi', { value: coin_api });

new Vue({
  router,
  store,
  created() {
    this.$store.dispatch('loadCoins');
    this.$store.dispatch('loadPairs');
  },
  render: h => h(App),
}).$mount('#converter-app')

