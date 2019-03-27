<template>
  <div class="ui raised segment main-box">
    <h1>Converting from {{ from }} to {{ to }}</h1>
    <p><strong>Destination address/account:</strong> {{ destination }}</p>
    <div
      v-if="error"
      class="ui message error"
    >
      <div class="header">
        Something went wrong loading your deposit details...
      </div>
      <p>{{ error }}</p>
    </div>
    <div
      v-if="loading"
      class="ui active inverted dimmer"
    >
      <div class="ui text loader">
        Getting deposit information...
      </div>
    </div>
    <div v-if="convdata">
      <p><strong>Conversion Rate:</strong> {{ convdata.ex_rate }} {{ to }} per {{ from }}</p>
      <div v-if="convdata.account">
        <h3>Please send any amount of {{ from }} to the following account, using the displayed memo:</h3>
        <h4>Our Receiving Account:</h4>
        <div class="ui message">
          {{ convdata.account }}
        </div>
        <h4>Memo (message) that must be used:</h4>
        <div class="ui message">
          {{ convdata.memo }}
        </div>
      </div>
      <div v-if="convdata.address">
        <h3>Please send any amount of {{ from }} to the following address:</h3>
        <div class="ui message">
          {{ convdata.address }}
        </div>
      </div>
      <br><hr><br>
      <p>
        <strong>{{ from }}</strong> sent to the above crypto address, or account + memo, will be converted into 
        <strong>{{ to }}</strong> and sent to your address/account: <strong>{{ destination }}</strong>
      </p>
    </div>
  </div>
</template>
<script>
export default {
    name: 'Convert',
    data() {
        return {
            loading: true,
            convdata: null,
            error: null
        }
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
    },
    created() {
        this.$coinapi.convert(this.from, this.to, this.destination).then((data) => {
            this.convdata = data;
            this.loading = false;
        }).catch(err => {
            this.error = err;
            this.loading = false;
        })
    },

}
</script>