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
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps({
  temperature: Number,
  weather: Number,
  type: String,
  link: Array
})

</script>

<template>
  <router-link :to="`/${link && link[1]}_${link && link[0]}`" :class="{ marker: weather, current: type === 'current' }">
    <WeatherIcon
      :weather="weather"
    />
    <p v-if="props.temperature" class="temp">{{ Math.floor(props.temperature) }}º</p>
  </router-link>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');

.marker{
  background-color: var(--mainColor);
  padding: 1em;
  color: var(--brightTextColor);
  border-radius: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 10px;
  transition: all 200ms ease;
  font-family: Outfit;
}
.marker:hover{
  transform: scale(1.1);
}
.current{
  background-color: var(--accentColor);
  color: var(--darkTextColor);
}
.marker svg{
  height: 24px;
}
.marker p{
  font-size: 18px;
  margin: 0;
}
</style>