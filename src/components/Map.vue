<script setup lang="ts">
// import 'mapbox-gl/dist/mapbox-gl.css'
import { onMounted } from 'vue';
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoiZG9yaWFuZmFuZXQiLCJhIjoiY2xhMnV6eTlqMGluMDNxbWJjOG53YXoybSJ9.22QaZflXbYlMLrI3XS0BGg'

onMounted(() => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-74.5, 40],
    zoom: 9,
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