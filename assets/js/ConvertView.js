const ConvertView = Vue.component('convert-view', {
    template: '#convert-view-template',
    data() {
        return {
            loading: true,
            convdata: null,
            error: null
        }
    },
    created() {
        coin_api.convert(this.from, this.to, this.destination).then((data) => {
            this.convdata = data;
            this.loading = false;
        }).catch(err => {
            this.error = err;
            this.loading = false;
        })
    },
    computed: {
        from () {
            return this.$route.params.from;
        },
        to () {
            return this.$route.params.to;
        },
        destination() {
            return this.$route.params.destination;
        }
    }
});
