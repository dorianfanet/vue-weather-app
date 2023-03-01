<script setup lang="ts">
import { ref } from 'vue';
import Header from './components/Header.vue';
import forecast from './data.json'

const childMsg = ref('')
</script>

<template>
  <Header />
  <section class="forecast-container">
    <ul>
      <li v-for="day in forecast.daily" :key="day.dt + 1">

      </li>
    </ul>
  </section>
</template>

<style scoped>



</style>
