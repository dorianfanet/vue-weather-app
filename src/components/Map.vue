<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { point, featureCollection } from '@turf/helpers'
import bbox from '@turf/bbox'
import clustersDbscan from '@turf/clusters-dbscan'
import Marker from './Marker.vue'
// @ts-ignore
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';

const mapTheme = ref(findTheme())

onMounted(() => {
 window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => mapTheme.value = findTheme());
})

onUnmounted(() => {
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', () => mapTheme.value = findTheme());
})

const props = defineProps({
  mapData: Object
})

const map = ref()

const clusteredData = ref()

watch(() => props.mapData, (newMapData) => {
  if(newMapData){
    let points = newMapData.otherLocations.map((pos: {longitude: number, latitude: number}) => {
      return point([pos.longitude, pos.latitude])
    })
  
    if(newMapData.currentLocation){
      console.log(points, [newMapData.currentLocation.lon, newMapData.currentLocation.lat])
      points.push(point([newMapData.currentLocation.lon, newMapData.currentLocation.lat]))
    }
  
  
    const clusterScan = clustersDbscan(featureCollection(points), 30)
  
    clusteredData.value = {
      noise: clusterScan.features.filter(e => e.properties.dbscan === 'noise'),
      clusters: []
    }
    const clustersNmbs = [...new Set(clusterScan.features.map(e => e.properties.cluster))]
    const filteredClustersNumbds = clustersNmbs.filter(e => e !== undefined)
  
    for(let i = 0; i < filteredClustersNumbds.length; i++){
      clusteredData.value = {
        ...clusteredData.value,
        clusters: [
          ...clusteredData.value.clusters,
          clusterScan.features.filter(e => e.properties.cluster === i).slice(0,1)[0]
        ]
      }
    }
  
    clusteredData.value.noise.map(async (e: {geometry: {coordinates: Array<Number>}}, i: number) => {
      clusteredData.value.noise[i].properties.weather = await getWeather(e.geometry.coordinates)
    })
  
    clusteredData.value.clusters.map(async (e: {geometry: {coordinates: Array<Number>}}, i: number) => {
      clusteredData.value.clusters[i].properties.weather = await getWeather(e.geometry.coordinates)
    })
  
    const newBbox = bbox(clusterScan)
  
    map.value.fitBounds(newBbox, {padding: 50})
  }
})

async function getWeather(coordinates: Array<Number>){
  const weather = fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates[1]}&lon=${coordinates[0]}&units=metric&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
  .then(response => response.json())
  .then(data => {
    console.log(data)

    return data
  })
  .catch(err => console.log(err))

  const resovedWeather = await weather

  return {
    temp: resovedWeather.current.temp,
    weather: resovedWeather.current.weather
  }
}

function findTheme(){
  console.log('change')
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'mapbox://styles/dorianfanet/clesfa2ur000p01ob0y77otqo'
  } else {
    return 'mapbox://styles/dorianfanet/clevgt5h8001c01nprbr4hgk5'
  }
}
</script>

<template>
  <MapboxMap
    style="height: calc(100% - 46px)"
    :map-style="mapTheme"
    access-token='pk.eyJ1IjoiZG9yaWFuZmFuZXQiLCJhIjoiY2xhMnV6eTlqMGluMDNxbWJjOG53YXoybSJ9.22QaZflXbYlMLrI3XS0BGg'
    :zoom="9"
    @mb-created="(mapboxInstance: object) => map = mapboxInstance"
  >
    <Transition name="fade">
      <div>
        <MapboxMarker
          v-if="props.mapData && props.mapData.loading === false && props.mapData.currentLocation"
          :lng-lat="[props.mapData.currentLocation.lon, props.mapData.currentLocation.lat]"
        >
          <Marker
            :temperature="props.mapData.currentLocation.weather.temp.day"
            :weather="props.mapData.currentLocation.weather.weather[0].id"
            :link="[props.mapData.currentLocation.lon, props.mapData.currentLocation.lat]"
            type="current"
          />
        </MapboxMarker>
        <MapboxMarker
          v-if="clusteredData && props.mapData && props.mapData.loading === false"
          v-for="city in clusteredData.noise"
          :lng-lat="city.geometry.coordinates"
        >
          <Marker
            v-if="city.properties.dbscan === 'noise' && city.properties.weather"
            :temperature="city.properties.weather.temp"
            :weather="city.properties.weather.weather[0].id"
            :link="city.geometry.coordinates"
          />
        </MapboxMarker>
        <MapboxMarker
          v-if="clusteredData && props.mapData && props.mapData.loading === false"
          v-for="city in clusteredData.clusters"
          :lng-lat="city.geometry.coordinates"
        >
          <Marker
            v-if="city.properties.weather"
            :temperature="city.properties.weather.temp"
            :weather="city.properties.weather.weather[0].id"
            :link="city.geometry.coordinates"
          />
        </MapboxMarker>
      </div>
    </Transition>
  </MapboxMap>
</template>

<style scoped>
#map{
  height: calc(100% - 46px);
  border-radius: 20px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>