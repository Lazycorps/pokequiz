<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Pokéquiz name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="150"
          src="https://fontmeme.com/permalink/210620/8251cb4f510c20821e42d8ea683727ae.png"
          width="150"
        />
      </div>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>
