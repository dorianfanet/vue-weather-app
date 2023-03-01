<script setup lang="ts">

</script>

<template>
  <header class="header">
    <h1>Paris, France</h1>
    <input type="text" placeholder="Search location">
  </header>
</template>

<style>
.header{
  display: flex;
  position: relative;
  align-items: center;
}

.header h1{
  color: white;
  margin: 0;
  font-size: 28px;
}

.header input{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 40px;
  width: 40%;
  background-color: var(--secondaryColor);
  border: 0;
  border-radius: 20px;
  font-family: 'Outfit';
  padding: 0 0 0 2em;
}

</style>