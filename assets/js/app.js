const routes = [
    { path: '/', component: SelectCoin },
    { path: '/convert/:from/:to/:destination', component: ConvertView, name: 'convert' }
]
const router = new VueRouter({
    routes
});

var app = new Vue({
    router,
    el: '#converter-app',
});