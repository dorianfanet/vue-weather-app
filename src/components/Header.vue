<script setup lang="ts">
import { ref, watch } from 'vue';

const searchInput = ref('')
const autocomplete = ref([])

watch(searchInput, (newSearchInput) => {
  if(newSearchInput.length > 1){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${newSearchInput}&limit=5&appid=74f5453e091823ce11345a217669f3ff`)
    .then(response => response.json())
    .then(data => autocomplete.value = data)
  }
})
</script>

<template>
  <header class="header">
    <h1>Paris, France</h1>
    <div class="inputContainer">
      <input v-model="searchInput" type="text" placeholder="Search location" class="searchInput">
      <ul v-if="autocomplete.length > 0" class="autocomplete">
        <li v-for="result in autocomplete">
          <router-link :to='`${result.lat}_${result.lon}`' @click="autocomplete = []">{{ result.name }}, {{ result.state }}</router-link>
        </li>
      </ul>
    </div>
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

.inputContainer{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 40%;
}

.searchInput{
  width: calc(100% - 2em);
  height: 40px;
  background-color: var(--secondaryColor);
  border: 0;
  border-radius: 20px;
  font-family: 'Outfit';
  padding: 0 0 0 2em;
  color: white;
}

.autocomplete{
  position: absolute;
  width: 100%;
  top: 40px;
  background-color: var(--secondaryColor);
  border-radius: 10px;
  padding: 0;
  padding: .4em 0;
}

.autocomplete li{
  list-style-type: none;
  text-align: left;
  padding: .2em .5em;
}

.autocomplete a{
  color: white;
  display: block;
  padding: .4em;
  width: calc(100% - .8em);
  transition: all 200ms ease;
  border-radius: 5px;
}

.autocomplete a:hover{
  background-color: var(--thirdColor);
}

</style>