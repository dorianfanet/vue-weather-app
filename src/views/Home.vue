<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import ForecastItem from '../components/ForecastItem.vue'
import Map from '../components/Map.vue'
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

interface MapDataType {
  currentLocation: {
    lat: number,
    lon: number,
    weather: {
      temp: {
        day: number
      },
      weather: [
        {
          id: number
        }
      ]
    }
  }
}

const forecast = ref<ForecastType>()

const mapData = ref<MapDataType>()

watch(() => route.params.id, (newId) => {

  const splittedId = (newId as string).split('_')
  forecast.value = undefined
  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${splittedId[0]}&lon=${splittedId[1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    forecast.value = data
    console.log(data)

    mapData.value = {
      currentLocation: {
        lat: data.lat,
        lon: data.lon,
        weather: {
          temp: {
            day: data.current.temp
          },
          weather: data.current.weather
        }
      }
    }
  })
})
</script>

<template>
  <Header />
  <main class="container">
    <section class="forecast">
      <h2 class="forecast-title">Next 7 days</h2>
      <ul v-if="forecast" class="forecast-container">
        <li v-for="day in forecast.daily" :key="day.dt">
          <ForecastItem 
            :date="day.dt"
            :temperature="day.temp"
            :weather="day.weather[0].id"
          />
        </li>
      </ul>
    </section>
    <section class="map">
      <h2 class="forecast-title">Weather map</h2>
      <Map
        v-if="mapData"
        :mapData="mapData"
      />
    </section>
  </main>
</template>

<style scoped>
main.container{
  display: grid;
  grid-template-rows: 40% 60%;
  margin-top: 60px;
  height: calc(100vh - 145px - 4rem);
  gap: 50px;
}
.forecast-title{
  text-align: left;
  margin: 0 0 10px 0;
}
.forecast-container{
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  padding: 0;
  gap: 15px;
  margin: 0;
  height: calc(100% - 46px);
}
.forecast-container li{
  list-style-type: none;
}
</style>