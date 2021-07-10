<template>
  <v-container class="my-5" fluid>
    <v-row class="align-center" justify="center">
      <v-card class="my-5" elevation="2" outlined>
        <v-card-text>
          <v-row class="align-center">
            <span class="dotGreen ma-2"
              ><div class="center">{{ goodResponse }}</div></span
            >
            <span class="dotRed ma-2"
              ><div class="center">{{ badResponse }}</div></span
            >
            <v-progress-circular
              color="blue"
              :value="((goodResponse + badResponse) / 20) * 100"
              :buffer-value="questionCount"
              class="ma-2"
              size="60"
              width="6"
            >
              <div style="color:black; font-weight: bolder;">
                {{ badResponse + goodResponse }} / {{ questionCount }}
              </div>
            </v-progress-circular>
            <div style="color:black; font-weight: bolder;">
              <div>Score : {{ totalScore }}</div>
              <div>Best : {{ bestScore }}</div>
            </div>
          </v-row>
        </v-card-text>
      </v-card>
    </v-row>
    <v-row class="align-center" justify="center">
      <v-card class="mx-auto" elevation="2" outlined v-show="!finish">
        <v-card-text>
          <v-row class="align-center" justify="center">
            <v-col cols="5">
              <v-card elevation="0">
                <v-img
                  :src="currentImg"
                  style="max-height: 200px; max-width: 200px"
                />
                <v-card-title class="justify-center">{{
                  currentType.frName
                }}</v-card-title>
              </v-card>
            </v-col>
            <v-col cols="2">
              <v-img src="/img/vs.png" style="max-height: 100px" contain />
            </v-col>
            <v-col cols="5">
              <v-card elevation="0">
                <v-img
                  :src="versusImg"
                  style="max-height: 200px; max-width: 200px"
                />
                <v-card-title class="justify-center"
                  ><div>{{ versusType.frName }}</div></v-card-title
                >
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-center">
          <v-row>
            <v-col cols="6" md="3">
              <v-btn
                color="black"
                class="white--text"
                large
                block
                rounded
                elevation="0"
                @click="checkResponse('0')"
                >0</v-btn
              >
            </v-col>
            <v-col cols="6" md="3">
              <v-btn
                color="red"
                class="white--text"
                large
                block
                rounded
                @click="checkResponse('/2')"
                elevation="0"
                >0.5x</v-btn
              >
            </v-col>
            <v-col cols="6" md="3">
              <v-btn
                color="grey"
                class="white--text"
                large
                block
                rounded
                @click="checkResponse('x1')"
                elevation="0"
                >1x</v-btn
              >
            </v-col>
            <v-col cols="6" md="3">
              <v-btn
                color="green"
                class="white--text"
                large
                block
                rounded
                @click="checkResponse('x2')"
                elevation="0"
                >2x</v-btn
              >
            </v-col>
          </v-row>
        </v-card-actions>
        <v-card-actions class="justify-center">
          <v-progress-linear
            color="blue"
            class="ma-2"
            :indeterminate="!running"
            :value="timeCountDown"
            :buffer-value="100"
            height="12"
            striped
            rounded
            ><div style="color:black; font-weight: bolder;">
              <!-- {{ timeCountDown }} -->
            </div>
          </v-progress-linear>
        </v-card-actions>
      </v-card>
      <v-card class="mx-auto" elevation="0" outlined v-if="finish">
        <v-btn color="success" @click="startGame()">START</v-btn>
      </v-card>
      <!-- <v-card class="mx-auto" elevation="0" outlined>
        <v-list three-line>
          <template v-for="(item, index) in responses">
            <response-card :response="item" :key="index"/>
          </template>
        </v-list>
      </v-card> -->
    </v-row>
    <v-row class="align-center" justify="center" v-if="finish">
      <v-card class="mx-auto" elevation="0" outlined>
        <v-list class="">
          <template v-for="(item, index) in responses">
            <div :key="index">
              <response-card :response="item" />
              <v-divider></v-divider>
            </div>
          </template>
        </v-list>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from "@vue/composition-api";
import axios from "axios";
import { PokemonType, PokemonTypeDTO } from "../models/PokemonType";
import { TypeResponse } from "../models/TypeResponse";
import ResponseCard from "./ResponseCard.vue";

export default defineComponent({
  components: { ResponseCard },
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
    const activeProgress = ref(false);
    const running = ref(false);
    const finish = ref(true);
    const bestScore = ref(0);
    const responses = ref<TypeResponse[]>([]);
    let nbrOfSameResponse = 0;
    let sameResponseMax = 4;

    function startGame() {
      goodResponse.value = 0;
      badResponse.value = 0;
      totalScore.value = 0;
      finish.value = false;
      responses.value = [];
      generateQuestion();
    }

    function generateQuestion() {
      const random1 = Math.floor(Math.random() * 18) + 1;
      let random2 = Math.floor(Math.random() * 18) + 1;

      Promise.all([
        axios.get<PokemonTypeDTO>(`https://pokeapi.co/api/v2/type/${random1}`),
        axios.get<PokemonType>(`https://pokeapi.co/api/v2/type/${random2}`),
      ]).then((resp) => {
        const nextType = new PokemonType(resp[0].data);
        const nextVersusType = new PokemonType(resp[1].data);
        if (currentType.value?.id) {
          const response = getGoodResponse(nextType, nextVersusType);
          const previousResponse = getGoodResponse(
            currentType.value,
            versusType.value
          );

          if (response === previousResponse) nbrOfSameResponse++;
          else nbrOfSameResponse = 0;
        }

        if (nbrOfSameResponse >= sameResponseMax) {
          sameResponseMax = Math.floor(Math.random() * 5) + 2;
          console.log(`same response allow ${sameResponseMax}`);
          generateQuestion();
        } else {
          currentType.value = nextType;
          currentImg.value = `/img/typeIcons/${resp[0].data.name}.png`;
          versusType.value = nextVersusType;
          versusImg.value = `/img/typeIcons/${resp[1].data.name}.png`;
          start();
        }
      });
    }

    function checkResponse(value: string) {
      stop();
      const elapsedTime = getElapsedTime();
      const typeResponse = new TypeResponse();
      typeResponse.currentType = currentType.value;
      typeResponse.currentTypeImg = currentImg.value;
      typeResponse.versusType = versusType.value;
      typeResponse.versusTypeImg = versusImg.value;
      typeResponse.goodResponse = getGoodResponse(
        typeResponse.currentType,
        typeResponse.versusType
      );
      typeResponse.response = value;
      typeResponse.elapsedTime = elapsedTime;
      if (value === typeResponse.goodResponse) {
        const timeMin = 2000;
        const timeMax = 5000;
        if (elapsedTime < timeMin) {
          typeResponse.score = 5;
          totalScore.value += typeResponse.score;
        } else if (elapsedTime < timeMax) {
          typeResponse.score = +(5 - (elapsedTime - timeMin) / 1000).toFixed(2);
          totalScore.value += typeResponse.score;
        }
        goodResponse.value++;
      } else {
        badResponse.value++;
      }
      responses.value.push(typeResponse);
      resetTimer();
      if (badResponse.value + goodResponse.value === questionCount.value) {
        finish.value = true;

        if (totalScore.value > bestScore.value)
          bestScore.value = totalScore.value;
      } else generateQuestion();
    }

    function getGoodResponse(type: PokemonType, versus: PokemonType): string {
      if (type.damage_relations.no_damage_to.some((t) => t.name == versus.name))
        return "0";
      if (
        type.damage_relations.half_damage_to.some((t) => t.name == versus.name)
      )
        return "/2";
      if (
        type.damage_relations.double_damage_to.some(
          (t) => t.name == versus.name
        )
      )
        return "x2";
      return "x1";
    }

    let timeBegan: Date | null = null;
    let started: any = null;

    function start() {
      if (timeBegan === null) {
        resetTimer();
        timeBegan = new Date();
      }

      started = setInterval(clockRunning, 50);
      running.value = true;
    }

    function stop() {
      running.value = false;
      clearInterval(started);
    }

    function resetTimer() {
      running.value = false;
      clearInterval(started);
      timeBegan = null;
      time.value = 0;
      timeCountDown.value = 5000;
    }

    function clockRunning() {
      const timeElapsed = getElapsedTime();
      timeCountDown.value = Math.round(
        ((maxTimer - timeElapsed) / maxTimer) * 100
      );
      time.value = timeElapsed * 1000;
      if (timeCountDown.value <= 0) {
        stop();
      }
    }

    function getElapsedTime() {
      const currentTime = new Date();
      if (!timeBegan) return 0;
      else return currentTime.getTime() - timeBegan.getTime();
    }

    return {
      title,
      startGame,
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
      activeProgress,
      running,
      finish,
      bestScore,
      responses
    };
  },
});
</script>

<style lang="scss">
.dot {
  height: 60px;
  width: 60px;
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
