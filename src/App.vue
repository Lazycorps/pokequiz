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
          class="shrink mt-1"
          contain
          min-width="150"
          src="https://fontmeme.com/permalink/210620/8251cb4f510c20821e42d8ea683727ae.png"
          width="150"
        />
      </div>
      <v-spacer></v-spacer>
      {{username}}
      <v-btn text color="white" class="mr-2" v-if="!username" @click="login">
        <b>Sign-in</b>
      </v-btn>
      <v-menu bottom offset-y v-if="username">
        <template v-slot:activator="{ on }">
          <v-badge
            :value.sync="updateAvailable"
            color="green"
            icon="mdi-arrow-up-thick"
            overlap
            offset-y="18"
            offset-x="18"
          >
            <v-btn icon color="white" v-on="on" class="pa-0 ma-0">
              <v-avatar color="grey darken-2" size="36" class="pa-0 ma-0">
                <v-icon size="36" color="grey lighten-1">mdi-account-circle</v-icon>
              </v-avatar>
            </v-btn>
          </v-badge>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title><v-icon class="mr-2">mdi-logout</v-icon> Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { onAuthUIStateChange } from '@aws-amplify/ui-components'

@Component({
  name: 'App'
})
export default class App extends Vue {
  get username() {
    return UserModule.username;
  }
  get updateAvailable(){
    return false;
  }
  unsubscribeAuth: any = null;

  mounted() {
    this.unsubscribeAuth = onAuthUIStateChange((authState, authData) => {
      UserModule.init();
    })
    UserModule.init();
  }

  private login() {
    this.$router.push('/login');
  }

  private logout() {
    UserModule.logout();
  }
  destroyed(){
    this.unsubscribeAuth();
  }
};
</script>
