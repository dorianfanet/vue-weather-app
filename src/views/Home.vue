<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import ForecastItem from '../components/ForecastItem.vue'
// import forecast from '../data.json'

const route = useRoute()

interface ForecastType {
  daily: [
    {
      dt: number,
      temp: {
        day: number
      },
      weather: [
        {
          id: number
        }
      ]
    }
  ]
}

const forecast = ref<ForecastType>()

watch(() => route.params.id, (newId) => {
  const splittedId = (newId as string).split('_')
  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${splittedId[0]}&lon=${splittedId[1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    forecast.value = data
    console.log(data)
  })
})
</script>

<template>
  <Header />
  <section class="forecast">
    <h2 class="forecast-title">Next 7 days</h2>
    <ul v-if="forecast" class="forecast-container">
      <li v-for="day in forecast.daily" :key="day.dt">
        <ForecastItem 
          :date="day.dt"
          :temperature="day.temp.day"
          :weather="day.weather[0].id"
        />
      </li>
    </ul>
  </section>
  {{ $route.params.id }}
</template>

<style scoped>
.forecast{
  margin-top: 60px;
}
.forecast-title{
  text-align: left;
}
.forecast-container{
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  padding: 0;
  gap: 15px;
}
.forecast-container li{
  list-style-type: none;
}
</style>