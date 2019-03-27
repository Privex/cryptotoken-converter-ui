<template>
  <div class="ui raised segment main-box">
    <h1>Recent Deposits</h1>
    <div
      v-if="loading"
      class="ui active inverted dimmer"
    >
      <div class="ui text loader">
        Loading deposits...
      </div>
    </div>
    <div v-if="deposits">
      <div class="ui right labeled fluid input">
        <input
          v-model="search"
          type="text"
          class="ui input"
          placeholder="Search Deposits"
        >

        <select
          id="searchby-deposit"
          v-model="search_by"
          class="dropdown"
        >
          <option value="address">
            Deposit Address
          </option>
          <option value="from_account">
            From Account
          </option>
          <option value="to_account">
            To Account
          </option>
          <option value="memo">
            Memo
          </option>
          <option value="txid">
            Transaction ID
          </option>
        </select>
      </div>
        
      <table class="ui compact table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Detected At</th>
            <th>Coin</th>
            <th>Amount</th>
            <th>Deposit Address / From Account</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="d of deposits"
            :key="d.id"
            :class="{ negative: (d.status == 'inv' || d.status == 'err'), positive: d.status == 'conv' }"
          >
            <td>{{ d.id }}</td>
            <td>{{ rel(d.created_at) }}</td>
            <td>{{ d.coin_symbol }}</td>
            <td>{{ parseFloat(d.amount).toFixed(8) }}</td>
            <td v-if="d.address">
              {{ d.address }}
            </td>
            <td v-if="d.from_account">
              {{ d.from_account }}
            </td>
            <td>{{ humanStatus(d.status) }}</td>
          </tr>
        </tbody>
      </table>
      
      <!-- <div class="ui buttons">
        <button
          class="ui labeled icon button"
          :class="{disabled: !has_prev}"
          @click="page -= 1"
        >
          <i class="left chevron icon" />
          Previous Page
        </button>
        <button class="ui button disabled">
          <i class="page icon" />
          <strong>Page {{ page }} of {{ page_count }}</strong>
        </button>
        <button
          class="ui right labeled icon button"
          :class="{disabled: !has_next}"
          @click="page += 1"
        >
          Next Page
          <i class="right chevron icon" />
        </button>
      </div> -->
      <Pager
        v-model="page"
        :page-count="page_count"
      />
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import _ from 'lodash';
import Pager from './Pager.vue';

const HUMAN_STATUS = {
    inv: 'Invalid Transaction Details',
    err: 'Error Processing Transaction',
    new: 'New (Awaiting conversion)',
    conv: 'Successfully Converted'
}
export default {
    name: 'ListDeposits',
    components: {
        Pager
    },
    data() {
        return {
            loading: true,
            page: 1,
            page_count: 1,
            page_size: 5,
            search: '',
            search_by: 'address',
        }
    },
    computed: {
        deposits() {
            return this.$store.state.deposits;
        },
        offset() {
            return (this.page - 1) * this.page_size
        },
        // has_next() {
        //     return this.page < this.page_count;
        // },
        // has_prev() {
        //     return this.page > 1;
        // }
    },
    watch: {
        page(val) {
            this.loading = true;
            this.loadDeposits();
        },
        search(val) {
            this.page = 1;
            this.debounce_deposits();
        },
        search_by(val) {
            this.page = 1;
            this.debounce_deposits();
        }
    },
    mounted() {
        this.loadDeposits();
        this.debounce_deposits = _.debounce(this.loadDeposits, 500);
        $('select.dropdown').dropdown();
    },
    methods: {
        humanStatus: (status) => (status in HUMAN_STATUS) ? HUMAN_STATUS[status] : "Unknown: " + status,
        rel: (timestamp) => moment(timestamp).fromNow(),
        loadDeposits() {
            var query = {}
            if (this.search != '') {
                query[this.search_by] = this.search;
            }
            this.$store.dispatch('loadDeposits', {limit: this.page_size, offset: this.offset, query }).then(d => {
                this.loading = false;
                var pc = Math.ceil(this.$store.state.deposit_count / this.page_size)
                this.page_count = pc > 1 ? pc : 1;
            });
        }
    },

}
</script>