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
