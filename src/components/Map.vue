<script setup lang="ts">
// import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted, ref, watch, h } from 'vue';
import mapboxgl from 'mapbox-gl'
import Marker from './Marker.vue'

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

console.log(props.mapData)

mapboxgl.accessToken = 'pk.eyJ1IjoiZG9yaWFuZmFuZXQiLCJhIjoiY2xhMnV6eTlqMGluMDNxbWJjOG53YXoybSJ9.22QaZflXbYlMLrI3XS0BGg'

const map = ref()

const actMarker = ref(null)

onMounted(() => {
  map.value = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/dorianfanet/clesfa2ur000p01ob0y77otqo',
    center: [-74.5, 40],
    zoom: 9,
  })

  // for (const feature of geojson.features) {
  // // create a HTML element for each feature
  //   const el = document.createElement('div');
  //   el.className = 'marker';

  //   // make a marker for each feature and add to the map
  //   new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates).addTo(map.value);
  // }
})

watch(() => props.mapData, (newMapData) => {
  const el = document.createElement('div');
  el.className = 'marker';
  const marker = new mapboxgl.Marker(el)
    .setLngLat([newMapData.currentLocation.lon, newMapData.currentLocation.lat])
    .addTo(map.value)
  
  map.value.flyTo({
    center: [newMapData.currentLocation.lon, newMapData.currentLocation.lat]
  })
})
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map{
  height: calc(100% - 46px);
  border-radius: 20px;
}
</style>