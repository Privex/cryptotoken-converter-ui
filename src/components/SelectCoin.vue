<template>
  <div class="ui raised segment main-box">
    <div class="ui form">
      <h1>CryptoToken Converter</h1>
      <p>This service allows you to quickly convert between two different cryptocurrencies or tokens.</p>
      <p>
        To use it, simply select the coin you want to convert from, and the coin you want to convert it into.
        After selecting a "from coin", the "to coin" list will refresh and show the coins you can convert 
        into, based on your "from coin" selection.
      </p>
      <p>
        Once you've selected both a "from" and "to" coin, you'll be able to enter a destination address or 
        account (where do we send your converted coins to?).
      </p>
      <p>
        If your destination coin ("to coin") uses crypto addresses (e.g. Bitcoin), enter a crypto address. 
        If your destination coin uses account names (e.g. SteemEngine tokens), enter an account name.
      </p>
      <h3>Select two coins to convert between</h3>
      <h4>After selecting a "from coin", the "to coin" options will update.</h4>
      <div class="field">
        <label>From Coin</label>
        <select
          id="from-coin-list"
          v-model="select_form.from_coin"
          class="dropdown"
        >
          <option
            :key="'nocoinselected'"
            :value="'nocoinselected'"
          >
            --- Please Select a Coin ---
          </option>
          <option
            v-for="coin of from_coins"
            :key="'from_' + coin.symbol"
            :value="coin.symbol"
          >
            {{ coin.display_name }} ({{ coin.symbol }})
          </option>
        </select>
      </div>
      <div class="field">
        <label>To Coin</label>
        <select
          id="to-coin-list"
          v-model="select_form.to_coin"
          class="dropdown"
        >
          <option
            :key="'nocoinselected'"
            :value="'nocoinselected'"
          >
            --- Please Select a Coin ---
          </option>
          <option
            v-for="coin of to_coins"
            :key="'to_' + coin.symbol"
            :value="coin.symbol"
          >
            {{ coin.display_name }} ({{ coin.symbol }})
          </option>
        </select>
      </div>
      <div
        v-if="select_form.to_coin != 'nocoinselected'"
        class="field"
      >
        <label>Where should we send your <strong>{{ get_coin_name(select_form.to_coin) }}</strong>?</label>
        <input
          v-model="select_form.destination"
          type="text"
          placeholder="Destination address (or account name if the network uses accounts, such as SteemEngine)"
        >
      </div>
      <button
        v-if="select_form.to_coin != 'nocoinselected'"
        class="ui button green"
        @click="convert"
      >
        Start conversion from {{ select_form.from_coin }} to {{ select_form.to_coin }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'SelectCoin',
    props: [],
    data: function() {
        return {
            // pairs: [],
            // coins: [],
            select_form: {
                destination: '',
                from_coin: 'nocoinselected',
                to_coin: 'nocoinselected',
            }
        }
    },
    computed: {
        coins() { return this.$store.state.coins; },
        pairs() { return this.$store.state.pairs; },
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
        // this.coins = await this.$coinapi.load_coins();
        // this.pairs = await this.$coinapi.load_pairs();
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
                    this.$set(this.select_form, 'to_coin', tc[0]['symbol']);
                    // this.to_coin = tc[0]['symbol']
                } else {
                    console.log('watch.form - setting "to coin" dropdown to nocoinselected');
                    this.$set(this.select_form, 'to_coin', 'nocoinselected');
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
    },
    template: '#select-coin-template'
}
</script>