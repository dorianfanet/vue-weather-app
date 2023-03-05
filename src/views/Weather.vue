<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import ForecastItem from '../components/ForecastItem.vue'
import Map from '../components/Map.vue'
import { useFavicon } from '@vueuse/core'
import findIcon from '../composables/findIcon'

const icon = useFavicon()

const route = useRoute()

interface ForecastType {
  daily: [
    {
      dt: number,
      temp: {
        day: number
      },
      pressure: number,
      humidity: number,
      wind_speed: number,
      wind_deg: number,
      weather: [
        {
          id: number
        }
      ]
    }
  ]
}

interface MapDataType {
  loading: boolean
}

const forecast = ref<ForecastType>()

const mapData = ref<MapDataType>({
  loading: false
})

onMounted(async () => {
  mapData.value.loading = true
  
  checkSize(window.innerWidth)

  mapData.value = await getMapData(route.params.id as string)

  icon.value = `./assets/${findIcon(forecast.value.current.weather[0].id)}.svg`
})

watch(() => route.params.id, async (newId) => {
  mapData.value.loading = true
  
  mapData.value = await getMapData(newId as string)
  icon.value = `./assets/${findIcon(forecast.value.current.weather[0].id)}.svg`
})

async function getMapData(newId: string){
  const splittedId = (newId).split('_')
  forecast.value = undefined
  const currentLocation = fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${splittedId[0]}&lon=${splittedId[1]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    forecast.value = data

    return data
  })
  .catch(err => console.log(err))

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '7119993a2dmshf7ee14d31d30ca5p1c7c45jsn662b348749e6',
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
    }
  };

  const otherLocations = fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${splittedId[0]}${splittedId[1].charAt(0) === '-' ? '' : '+'}${splittedId[1]}/nearbyCities?radius=100&limit=10&sort=-population&asciiMode=false&types=CITY`, options)
    .then(response => response.json())
    .then(response => {
      console.log(response)
      console.log(`https://wft-geo-db.p.rapidapi.com/v1/geo/locations/${splittedId[0]}${splittedId[1].charAt(0) === '-' ? '' : '+'}${splittedId[1]}/nearbyCities?radius=100&limit=10&sort=-population&asciiMode=false&types=CITY`)
      return response
    })
    .catch(err => console.error(err));

  const resolvedCurrentLocation = await currentLocation
  const resovedOtherLocations = await otherLocations
  
  const fullMapData = {
    loading: false,
    currentLocation: {
        lat: resolvedCurrentLocation.lat,
        lon: resolvedCurrentLocation.lon,
        weather: {
          temp: {
            day: resolvedCurrentLocation.current.temp
          },
          weather: resolvedCurrentLocation.current.weather
        }
      },
    otherLocations: resovedOtherLocations.data
  }

  return fullMapData
}

const widthRef = ref(8)

function checkSize(size: number){
  if(size >= 1500){
    widthRef.value = 8
  } else {
    const buffer = Math.abs(size - 1500)
    const rest = Math.floor(buffer / 100)
    
    const result = 8 - rest
    if(result < 4){
      widthRef.value = 3
    } else {
      widthRef.value = 8 - rest
    }
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
          <li v-for="(day, index) in forecast.daily.slice(0,widthRef)" :key="day.dt">
            <ForecastItem 
              :date="day.dt"
              :temperature="day.temp"
              :pressure="day.pressure"
              :humidity="day.humidity"
              :wind="{speed: day.wind_speed, direction: day.wind_deg}"
              :weather="day.weather[0].id"
              :first="index === 0 ? widthRef < 5 ? 'first' : 'first-full' : 'no'"
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
  grid-template-rows: 346px 1fr;
  margin-top: 60px;
  height: calc(100vh - 95px - 4rem);
  gap: 40px;
}
.forecast{
  width: 100%;
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
  height: 100%;
}

@media screen and (max-width: 768px) {
  .forecast-container{
    grid-template-columns: unset;
    grid-template-rows: repeat(v-bind(widthRef), 1fr);
  }
}
</style>