<script setup lang="ts">
// import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, watch, h } from 'vue';
import { lineString, point, featureCollection } from '@turf/helpers'
import bbox from '@turf/bbox'
import clustersDbscan from '@turf/clusters-dbscan'
import mapboxgl from 'mapbox-gl'
import Marker from './Marker.vue'
import { MapboxMap, MapboxMarker } from '@studiometa/vue-mapbox-gl';

// const geojson = {
//   type: 'FeatureCollection',
//   features: [
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-77.032, 38.913]
//       },
//       properties: {
//         title: 'Mapbox',
//         description: 'Washington, D.C.'
//       }
//     },
//     {
//       type: 'Feature',
//       geometry: {
//         type: 'Point',
//         coordinates: [-122.414, 37.776]
//       },
//       properties: {
//         title: 'Mapbox',
//         description: 'San Francisco, California'
//       }
//     }
//   ]
// };

const props = defineProps({
  mapData: Object
})



// const map = ref()

// const actMarker = ref(null)

// onMounted(() => {
//   map.value = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/dorianfanet/clesfa2ur000p01ob0y77otqo',
//     center: [-74.5, 40],
//     zoom: 9,
//   })

//   // for (const feature of geojson.features) {
//   // // create a HTML element for each feature
//   //   const el = document.createElement('div');
//   //   el.className = 'marker';

//   //   // make a marker for each feature and add to the map
//   //   new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map.value);
//   // }
// })
const map = ref()

const clusteredData = ref()

watch(() => clusteredData, (newClusteredData) => {
  console.log(newClusteredData)
})

watch(() => props.mapData, (newMapData) => {
  console.log(newMapData)

  // const el = document.createElement('div');
  // el.className = 'marker';
  // const marker = new mapboxgl.Marker(el)
  //   .setLngLat([newMapData.currentLocation.lon, newMapData.currentLocation.lat])
  //   .addTo(map.value)
  
  // map.value.flyTo({
  //   center: [newMapData.currentLocation.lon, newMapData.currentLocation.lat]
  // })

  let points = newMapData.otherLocations.map((pos) => {
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

  clusteredData.value.noise.map(async (e, i) => {
    clusteredData.value.noise[i].properties.weather = await getWeather(e.geometry.coordinates)
    // return e.properties.weather = await getWeather(e.geometry.coordinates)
  })

  clusteredData.value.clusters.map(async (e, i) => {
    clusteredData.value.clusters[i].properties.weather = await getWeather(e.geometry.coordinates)
    // return e.properties.weather = await getWeather(e.geometry.coordinates)
  })


  console.log(clusteredData.value)

  // const line = lineString(points)
  const newBbox = bbox(clusterScan)


  map.value.fitBounds(newBbox, {padding: 50})
})

async function getWeather(coordinates){
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

</script>

<template>
  <MapboxMap
    style="height: calc(100% - 46px)"
    map-style="mapbox://styles/dorianfanet/clesfa2ur000p01ob0y77otqo"
    access-token='pk.eyJ1IjoiZG9yaWFuZmFuZXQiLCJhIjoiY2xhMnV6eTlqMGluMDNxbWJjOG53YXoybSJ9.22QaZflXbYlMLrI3XS0BGg'
    :center="[0, 0]"
    :zoom="9"
    @mb-created="(mapboxInstance) => map = mapboxInstance"
  >
    <!-- <Transition name="fade">
      <MapboxMarker
        v-if="props.mapData && props.mapData.loading === false"
        :lng-lat="[props.mapData.currentLocation.lon, props.mapData.currentLocation.lat]"
      >
        <Marker
          :temperature="props.mapData.currentLocation.weather.temp"
          :weather="props.mapData.currentLocation.weather.weather[0].id"
        />
      </MapboxMarker>
    </Transition> -->
    <Transition name="fade">
      <div>
        <MapboxMarker
          v-if="props.mapData && props.mapData.loading === false && props.mapData.currentLocation"
          :lng-lat="[mapData.currentLocation.lon, mapData.currentLocation.lat]"
        >
          <Marker
            :temperature="mapData.currentLocation.weather.temp.day"
            :weather="mapData.currentLocation.weather.weather[0].id"
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