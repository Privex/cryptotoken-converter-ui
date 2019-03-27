<template>
  <div id="converter-app">
    <div class="ui pointing menu">
      <router-link
        to="/"
        class="item"
        active-class="active"
      >
        Home
      </router-link>
      <router-link
        to="/deposits"
        class="item"
        active-class="active"
      >
        Recent Deposits
      </router-link>
      <router-link
        to="/conversions"
        class="item"
        active-class="active"
      >
        Recent Conversions
      </router-link>
    </div>
    <router-view />
  </div>
</template>

<script>

import Pager from './components/Pager.vue';

export default {
  name: 'App',
  components: {
    // Pager
  }
}
</script>


