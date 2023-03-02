<script setup lang="ts">
import Header from '../components/Header.vue';
import forecast from '../data.json'
</script>

<template>
  <Header />
  <section class="forecast">
    <h2 class="forecast-title">Next 7 days</h2>
    <ul class="forecast-container">
      <li v-for="day in forecast.daily" :key="day.dt + 1">

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
}
</style>