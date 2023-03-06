<script setup lang="ts">
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
  weather: Number
})
</script>

<template>
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
</template>