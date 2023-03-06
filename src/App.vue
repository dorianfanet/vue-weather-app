<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

onMounted(() => {
  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
    router.push(`/${position.coords.latitude}_${position.coords.longitude}`)
  }, (err) => console.log(err))
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');
</style>