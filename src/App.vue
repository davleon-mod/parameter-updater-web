<script setup>
import { computed } from 'vue'
import { useSpeckleStore } from '@/stores/index' // Adjust the path as necessary

const store = useSpeckleStore()
// const isAuthenticated = ref(false)

const isAuthenticated = computed(() => {
  return store.isAuthenticated
})




</script>

<template>

  <v-app>

    <v-app-bar app color="primary">


      <div v-if="isAuthenticated">
        <p>
        <h3>SF-Parameter-Updater</h3>
        </p> Welcome
        <b>{{ store.user.name }}</b>

        ! You are connected to
        <b>
          {{ store.serverInfo.company }}'s
          <em>{{ store.serverInfo.name }}</em>
        </b>
      </div>



      <v-spacer></v-spacer>


      <v-btn outlined v-if="!isAuthenticated" @click="store.redirectToAuth">
        <span>Login with Speckle</span>
      </v-btn>
      <v-btn outlined v-else @click="store.logout">
        Log out
      </v-btn>
    </v-app-bar>


    <v-main>
      <router-view />
    </v-main>
  </v-app>



</template>

<style scoped></style>
