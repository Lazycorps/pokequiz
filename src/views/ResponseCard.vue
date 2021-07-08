<template>
  <v-card
    elevation="0"
    tile
    :color="response.response === response.goodResponse ? 'green' : '#EF5350'"
  >
    <v-card-text>
      <v-row class="align-center" justify="center">
        <v-col class="d-flex justify-start align-center">
          <v-img
            :src="response.currentTypeImg"
            style="max-height: 50px; max-width: 50px"
          />
          <v-img src="/img/vs.png" max-width="30px" class="mx-3" contain />
          <v-img
            :src="response.versusTypeImg"
            style="max-height: 50px; max-width: 50px"
          />
        </v-col>
        <v-col cols="auto">
          <div>Your response : {{ response.response }}</div>
          <div>Good response : {{ response.goodResponse }}</div>
        </v-col>
        <v-col cols="auto">
          <div>Score : {{ response.score }}</div>
          <div>Time: {{ response.elapsedTime / 1000 }}</div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { TypeResponse } from "@/models/TypeResponse";
import { ref, onMounted, defineComponent } from "@vue/composition-api";

export default defineComponent({
  props: {
    response: { type: TypeResponse, required: true },
  },
  setup() {
    return {};
  },
});
</script>

<style scoped></style>
