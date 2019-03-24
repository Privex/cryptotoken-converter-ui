const SelectCoin = Vue.component('select-coin', {
    template: '#select-coin-template',
    props: [],
    data: function() {
        return {
            pairs: [],
            coins: [],
            select_form: {
                destination: '',
                from_coin: 'nocoinselected',
                to_coin: 'nocoinselected',
            }
        }
    },
    computed: {
        from_coins: function() {
            var vm = this;
            var form = this.select_form;
            console.log('from_coins - generating from_symbols');
            var from_symbols = this.pairs.map(f => f.from_coin_symbol);
            var unique_symbols = [];
            // ensure valid from_coin_symbol's are only listed once
            console.log('from_coins - filtering to unique');
            for(var symid in from_symbols) {
                var sym = from_symbols[symid];
                console.log('checking if unique:', sym)
                if(unique_symbols.indexOf(sym) === -1) unique_symbols.push(sym);
            }
            // return a list of coin objects
            return unique_symbols.map((symb) => {
                var c = vm.get_coin(symb);
                if(c !== null) {
                    return c;
                }
            });
        },
        to_coins: function() {
            // var form = this.form;
            var vm = this;
            var form = this.select_form;
            if (form.from_coin === 'nocoinselected') {
                return [];
            }
            // Find coin pairs that start from the currently selected "From Coin"
            var p = this.pairs.filter((v) => { return v.from_coin_symbol == form.from_coin })
            // Get just the symbols into a list
            var end_symbols = p.map(pair => pair.to_coin_symbol);
            // Return a list of coin objects
            return end_symbols.map((symb) => {
                var c = vm.get_coin(symb);
                if(c !== null) {
                    return c;
                }
            });
        }
    },
    beforeMount: async function() {
        this.coins = await coin_api.load_coins();
        this.pairs = await coin_api.load_pairs();
    },
    mounted: function () {
        $('select.dropdown').dropdown();
        $('#to-coin-list').dropdown('restore defaults');
        $('#from-coin-list').dropdown('restore defaults');
        this.$watch('select_form.from_coin', function(newCoin, oldCoin) {
            $('#to-coin-list').dropdown('restore defaults');
            if (newCoin != oldCoin) {
                var tc = this.to_coins;

                if (tc.length > 0) {
                    console.log('watch.form - setting "to coin" dropdown to:', tc[0]['symbol']);
                    Vue.set(this.select_form, 'to_coin', tc[0]['symbol']);
                    // this.to_coin = tc[0]['symbol']
                } else {
                    console.log('watch.form - setting "to coin" dropdown to nocoinselected');
                    Vue.set(this.select_form, 'to_coin', 'nocoinselected');
                }
            }
            this.$emit('input', this.select_form)
        });
        $('#from-coin-list').dropdown('refresh');
        $('#to-coin-list').dropdown('refresh');
    },
    methods: {
        get_coin_name: function(symbol) {
            var c = this.get_coin(symbol);
            if (c === null) {
                return '(No TO COIN selected)'
            }
            return c.display_name
        },

        get_coin: function(symbol) {
            // console.log('get_coin', symbol)
            var cl = this.coins.filter((v) => { return v.symbol == symbol; })
            if (cl.length < 1) {
                console.log('get_coin - coin not found:', symbol)
                return null;
            }
            // console.log('found coin:', cl[0]);
            return cl[0];
        },
        convert: function() {
            var f = this.select_form;
            this.$router.push({ name: 'convert', params: {from: f.from_coin, to: f.to_coin, destination: f.destination}})
        }
    }
});