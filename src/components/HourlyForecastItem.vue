<script setup lang="ts">
import WeatherIcon from './WeatherIcon.vue';
import Temperature from '../assets/icons/Temperature.vue'
import WindDirection from '../assets/icons/WindDirection.vue'
import WindCalm from '../assets/icons/WindCalm.vue'

const props = defineProps({
  temperature: Number,
  weather: Number,
  date: Number,
  wind: Object,
  first: Boolean
})

</script>

<template>
<div class="hrl-container" :class="{ 'first': first }">
  <p v-if="date" class="day">{{ new Date(date * 1000).getHours() }}:00</p>
  <div class="content">
    <WeatherIcon
        :weather="weather"
      />
    <div class="weather-indications">
      <Temperature />
      <p v-if="temperature">{{ Math.floor(temperature) }}º</p>
    </div>
    <div class="weather-indications">
      <WindCalm 
        v-if="wind && wind.speed < 1.5"
      />
      <WindDirection 
        v-if="wind && wind.speed >= 1.5"
        :style="{transform: `rotate(${wind.direction}deg)`}"
      />
      <p v-if="wind">{{ Math.floor(wind.speed * 3.6) }} km/h</p>
    </div>
  </div>
</div>
</template>

<style scoped>
.hrl-container{
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 20px;
  background-color: var(--secondaryColor);
  border-radius: 20px;
  font-size: 18px;
  font-weight: 500;
}
.hrl-container.first{
  background-color: var(--accentColor);
  color: #101014;
}
.hrl-container.first .weather-indications svg{
  fill: var(--darkTextColor);
}
.hrl-container > p{
  font-weight: 600;
}
.content{
  display: grid;
  grid-template-columns: 50px 50px 120px;
  align-items: center;
  gap: 10px;
}
.data-container{
  display: flex;
  gap: 5px;
}
.weather-indications{
  display: flex;
  align-items: center;
}
.weather-indications svg{
  height: 20px;
  opacity: .5;
  fill: var(--brightTextColor);
}
</style>

<style>
.hrl-container svg{
  width: 40px;
  max-width: 40px;
  max-height: 40px;
}
@media screen and (max-width: 768px) {
  svg{
    max-height: 40px;
  }
}
</style>