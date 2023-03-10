<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import ForecastItem from '../components/ForecastItem.vue'
import Map from '../components/Map.vue'
import { useFavicon } from '@vueuse/core'
import findIcon from '../composables/findIcon'
import { ForecastType, MapDataType } from '../types';
import HourlyForecastItem from '../components/HourlyForecastItem.vue';

const icon = useFavicon()

const route = useRoute()

const forecast = ref<ForecastType>()

const mapData = ref<MapDataType>({
  loading: false
})

onMounted(async () => {
  mapData.value.loading = true
  
  checkSize(window.innerWidth)

  mapData.value = await getMapData(route.params.id as string)

  if(forecast.value && forecast.value.current){
    icon.value = `./assets/${findIcon(forecast.value.current.weather[0].id)}.svg`
  }
})

watch(() => route.params.id, async (newId) => {
  mapData.value.loading = true
  
  mapData.value = await getMapData(newId as string)
  if(forecast.value && forecast.value.current){
    icon.value = `./assets/${findIcon(forecast.value.current.weather[0].id)}.svg`
  }
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
const innerWidth = ref(window.innerWidth)

function checkSize(size: number){
  if(size > 768){
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
  } else if(mobileFcstShowMore.value) {
    widthRef.value = 8
  } else {
    widthRef.value = 3
  }
  innerWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', () => checkSize(window.innerWidth))
})
onUnmounted(() => {
  window.removeEventListener('resize', () => checkSize(window.innerWidth))
})

const mobileFcstShowMore = ref(false)

function toggleMobileFcstShowMore(){
  if(mobileFcstShowMore.value === true){
    mobileFcstShowMore.value = false
    widthRef.value = 3
    console.log('true')
  } else {
    mobileFcstShowMore.value = true
    widthRef.value = 8
    console.log(widthRef)
  }
}
</script>

<template>
  <Header />
  <main class="container" :class="{ 'mobileFcstShowMore': mobileFcstShowMore }">
    <section class="forecast">
      <h2 class="section-title">Next {{ widthRef - 1 }} days</h2>
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
              :first="index === 0 ? innerWidth < 1101 ? 'first' : 'first-full' : 'no'"
            />
          </li>
        </ul>
      </Transition>
      <p class="show-more" @click="toggleMobileFcstShowMore()">{{ mobileFcstShowMore ? 'Show less...' : 'Show more...' }}</p>
    </section>
    <section class="next-hours">
      <h2 class="section-title">Next 24 hours</h2>
      <Transition name="fade">
        <ul v-if="forecast" class="next-hours-container">
          <li v-for="(hour, index) in forecast.hourly.slice(0, 24)" :key="hour.dt">
            <HourlyForecastItem 
              :date="hour.dt"
              :temperature="hour.temp"
              :wind="{speed: hour.wind_speed, direction: hour.wind_deg}"
              :weather="hour.weather[0].id"
              :first="index === 0 ? true : false"
            />
          </li>
        </ul>
      </Transition>
    </section>
    <section class="map">
      <h2 class="section-title">Weather map</h2>
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
  width: 100%;
  grid-template-rows: 346px calc(100% - 386px);
  grid-template-columns: minmax(350px, 500px) 1fr;
  margin-top: 60px;
  height: calc(100vh - 95px - 4rem);
  gap: 40px;
}
.forecast{
  width: 100%;
  grid-column: 1 / 3;
}
.section-title{
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
  height: 100%;
}
.show-more{
  display: none;
}

.next-hours-container{
  display: flex;
  flex-direction: column;
  overflow: scroll;
  height: calc(100% - 46px);
  margin: 0;
  gap: 15px;
}

@media screen and (max-width: 768px) {
  .forecast{
    grid-column: unset;
  }
  main.container{
    grid-template-rows: 362px repeat(2, 346px);
    grid-template-columns: 1fr;
    height: unset;
    transition: all 300ms ease;
  }
  main.container.mobileFcstShowMore{
    grid-template-rows: 911px repeat(2, 346px);
  }
  main.container.mobileFcstShowMore .forecast-container{
    height: 865px;
  }
  .forecast-container{
    grid-template-columns: unset;
    grid-template-rows: repeat(v-bind(widthRef), 1fr);
    height: 316px;
    transition: all 300ms ease;
  }
  .show-more{
    display: block;
    margin: 10px 0 0 0;
  }
}
</style>