<script setup lang="ts">
import { ref, watch } from 'vue';
import Drizzle from '../assets/Drizzle.vue';
import Thunderstorm from '../assets/Thunderstorm.vue';
import Shower from '../assets/Shower.vue';
import LightSnow from '../assets/LightSnow.vue';
import Snow from '../assets/Snow.vue';
import Sleet from '../assets/Sleet.vue';
import Sunny from '../assets/Sunny.vue';
import Few from '../assets/Few.vue';
import Scattered from '../assets/Scattered.vue';
import Overcast from '../assets/Overcast.vue';

const props = defineProps({
  date: Number,
  temperature: Number,
  weather: Number
})

console.log(props.date, props.temperature)

const daysOfTheWeek = ["Sun", 'Mon', 'Tue', 'Wed', 'Thu', "Fri", "Sat"]
</script>

<template>
  <div class="f-item-container">
    <p v-if="props.date" class="day">{{ daysOfTheWeek[new Date(props.date * 1000).getDay()] }}</p>
    <Thunderstorm v-if="weather && weather >= 200 && weather <= 299" />
    <Drizzle v-if="weather && weather >= 300 && weather <= 399"/>
    <Shower v-if="weather && weather >= 500 && weather <= 599"/>
    <LightSnow v-if="weather === 600 || weather === 612 || weather === 620"/>
    <Sleet v-else-if="weather === 611 || weather === 615 || weather === 616"/>
    <Snow v-else-if="weather && weather >= 600 && weather <= 699"/>
    <Sunny v-if="weather === 800"/>
    <Few v-if="weather === 801"/>
    <Scattered v-if="weather === 802"/>
    <Overcast v-if="weather === 803 || weather === 804 "/>
    <p v-if="props.temperature" class="temp">{{ Math.floor(props.temperature) }}º</p>
  </div>
</template>

<style>
.f-item-container{
  background-color: var(--secondaryColor);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  height: 210px;
  justify-content: space-between;
}
.f-item-container svg{
  width: 70%;
  max-width: 100px;
}
.day{
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
.temp{
  font-size: 42px;
  font-weight: 700;
  margin: 0;
}
</style>