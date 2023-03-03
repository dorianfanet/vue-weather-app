<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
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
  loading: boolean,
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
  mapData.value = {
    ...mapData.value,
    loading: true
  }

  const splittedId = (newId as string).split('_')
  forecast.value = undefined
  fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${splittedId[0]}&lon=${splittedId[1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    forecast.value = data
    console.log(data)

    mapData.value = {
      loading: false,
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

const widthRef = ref(8)

function checkSize(size){
  if(size >= 1500){
    widthRef.value = 8
  } else {
    const buffer = Math.abs(size - 1500)
    const rest = Math.floor(buffer / 180)
  
    console.log(8 - rest)
  
    widthRef.value = 8 - rest
  }
}


onMounted(() => {
  window.addEventListener('resize', () => checkSize(window.innerWidth))
})
onUnmounted(() => {
  window.removeEventListener('resize', () => checkSize(window.innerWidth))
})
</script>

<template>
  <Header />
  <main class="container">
    <section class="forecast">
      <h2 class="forecast-title">Next 7 days</h2>
      <Transition name="fade">
        <ul v-if="forecast" class="forecast-container">
          <li v-for="day in forecast.daily.slice(0,widthRef)" :key="day.dt">
            <ForecastItem 
              :date="day.dt"
              :temperature="day.temp"
              :weather="day.weather[0].id"
            />
          </li>
        </ul>
      </Transition>
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
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
  grid-template-columns: repeat(v-bind(widthRef), 1fr);
  padding: 0;
  gap: 15px;
  margin: 0;
  height: calc(100% - 46px);
}
.forecast-container li{
  list-style-type: none;
}
</style>