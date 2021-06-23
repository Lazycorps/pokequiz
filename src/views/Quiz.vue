<template>
  <v-container class="ma-5" fluid>
    <v-row class="align-center" justify="center">
      <v-card class="mx-auto my-12">
        <v-row class="align-center" justify="center">
          <v-col>
            <v-card class="mx-auto my-12" elevation="0">
              <v-img
                :src="currentImg"
                style="height: 200px; max-width: 200px"
              />
              <v-card-title class="justify-center">{{
                currentType.frName
              }}</v-card-title>
            </v-card>
          </v-col>
          <v-col>
            <v-img
              src="http://localhost:8080/img/vs.png"
              height="100"
              contain
            />
          </v-col>
          <v-col>
            <v-card class="mx-auto my-12" elevation="0">
              <v-img :src="versusImg" style="height: 200px; max-width: 200px" />
              <v-card-title class="justify-center"
                ><div>{{ versusType.frName }}</div></v-card-title
              >
            </v-card>
          </v-col>
        </v-row>
        <v-card-actions class="justify-center">
          <v-btn
            color="black"
            class="ma-3 white--text"
            large
            @click="checkResponse('0')"
            >0</v-btn
          >
          <v-btn
            color="red"
            class="ma-3 white--text"
            large
            @click="checkResponse('/2')"
            >0.5x</v-btn
          >
          <v-btn
            color="grey"
            class="ma-3 white--text"
            large
            @click="checkResponse('x1')"
            >1x</v-btn
          >
          <v-btn
            color="green"
            class="ma-3 white--text"
            large
            @click="checkResponse('x2')"
            >2x</v-btn
          >
        </v-card-actions>
        <v-card-actions class="justify-center">
          <v-progress-linear
            color="blue"
            class="ma-2"
            :value="timeCountDown"
            :buffer-value="100"
            height="12"
            ><div style="color:black; font-weight: bolder;">
              <!-- {{ timeCountDown }} -->
            </div>
          </v-progress-linear>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-row class="align-center">
      <span class="dotGreen ma-2"
        ><div class="center">{{ goodResponse }}</div></span
      >
      <span class="dotRed ma-2"
        ><div class="center">{{ badResponse }}</div></span
      >
      <v-progress-linear
        color="blue"
        :value="((goodResponse + badResponse) / 20) * 100"
        :buffer-value="questionCount"
        class="ma-2"
      />
      <div style="color:black; font-weight: bolder;">
        {{ badResponse + goodResponse }} / {{ questionCount }}
      </div>
    </v-row>
    <v-row class="align-center">
      <div>
        {{ totalScore }}
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "@vue/composition-api";
import axios from "axios";
import { PokemonType, PokemonTypeDTO } from "../models/PokemonType";

export default defineComponent({
  setup() {
    const title = "Quiz !";
    const maxTimer = 5000;
    const currentType = ref(new PokemonType());
    const currentImg = ref("");
    const versusType = ref(new PokemonType());
    const versusImg = ref("");
    const response = ref("");
    const goodResponse = ref(0);
    const badResponse = ref(0);
    const questionCount = ref(20);
    const time = ref(0);
    const timeCountDown = ref(maxTimer);
    const totalScore = ref(0);

    onMounted(() => {
      generateQuestion();
    });

    function generateQuestion() {
      const random1 = Math.floor(Math.random() * 18) + 1;
      let random2 = Math.floor(Math.random() * 18) + 1;

      axios
        .get<PokemonTypeDTO>(`https://pokeapi.co/api/v2/type/${random1}`)
        .then((resp) => {
          currentType.value = new PokemonType(resp.data);
          currentImg.value = `http://localhost:8080/img/typeIcons/${resp.data.name}.png`;
        });

      axios
        .get<PokemonType>(`https://pokeapi.co/api/v2/type/${random2}`)
        .then((resp) => {
          versusType.value = new PokemonType(resp.data);
          versusImg.value = `http://localhost:8080/img/typeIcons/${resp.data.name}.png`;
        });

      start();
    }

    function checkResponse(value: string) {
      const elapsedTimes = getElapsedTime();
      if (elapsedTimes.getTime() < 500) totalScore.value += 10;
      else {
        totalScore.value += round((10 - elapsedTimes.getTime()) / 1000, 2);
      }

      stop();
      reset();
      if (
        (value == "0" &&
          currentType.value.damage_relations.no_damage_to.some(
            (t) => t.name == versusType.value.name
          )) ||
        (value == "/2" &&
          currentType.value.damage_relations.half_damage_to.some(
            (t) => t.name == versusType.value.name
          )) ||
        (value == "x2" &&
          currentType.value.damage_relations.double_damage_to.some(
            (t) => t.name == versusType.value.name
          )) ||
        (value == "x1" &&
          !currentType.value.damage_relations.no_damage_to.some(
            (t) => t.name == versusType.value.name
          ) &&
          !currentType.value.damage_relations.half_damage_to.some(
            (t) => t.name == versusType.value.name
          ) &&
          !currentType.value.damage_relations.double_damage_to.some(
            (t) => t.name == versusType.value.name
          ))
      ) {
        goodResponse.value++;
      } else {
        badResponse.value++;
      }
      generateQuestion();
    }

    function round(value: number, precision: number) {
      var multiplier = Math.pow(10, precision || 0);
      return Math.round(value * multiplier) / multiplier;
    }

    var timeBegan: any = null,
      timeStopped: any = null,
      stoppedDuration = 0,
      started: any = null,
      running = false;

    function start() {
      if (running) return;

      if (timeBegan === null) {
        reset();
        timeBegan = new Date();
      }

      if (timeStopped !== null) {
        stoppedDuration += new Date().getTime() - timeStopped;
      }

      started = setInterval(clockRunning, 50);
      running = true;
    }

    function stop() {
      running = false;
      timeStopped = new Date();
      clearInterval(started);
    }

    function reset() {
      running = false;
      clearInterval(started);
      stoppedDuration = 0;
      timeBegan = null;
      timeStopped = null;
      time.value = 5000;
    }

    function clockRunning() {
      const timeElapsed = getElapsedTime();
      timeCountDown.value = Math.round((maxTimer - timeElapsed.getTime()) / maxTimer * 100);
      time.value = timeElapsed.getUTCSeconds();
      if (timeCountDown.value <= 0) {
        stop();
      }
    }

    function getElapsedTime() {
      const currentTime = new Date();
      return new Date(currentTime.getTime() - timeBegan - stoppedDuration);
    }

    return {
      title,
      checkResponse,
      currentType,
      versusType,
      response,
      goodResponse,
      badResponse,
      currentImg,
      versusImg,
      questionCount,
      timeCountDown,
      time,
      totalScore,
    };
  },
});
</script>

<style lang="scss">
.dot {
  height: 50px;
  width: 50px;
  border-radius: 50%;
  position: relative;
  display: inline-block;
  text-align: center;
  list-style-position: inside;
  font-weight: bolder;
}

.dotGreen {
  @extend .dot;
  background-color: #4caf50;
  color: white;
}

.dotRed {
  @extend .dot;
  background-color: #f44336;
  color: white;
}

.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
