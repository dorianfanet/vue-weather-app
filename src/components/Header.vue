<script setup lang="ts">
import { ref, watch } from 'vue';

interface AutocompletType {
    lat: Number,
    lon: Number,
    name: String,
    state: String
  }

const searchInput = ref('')
const autocomplete = ref<AutocompletType[]>([])
const location = ref('')

watch(searchInput, (newSearchInput) => {
  if(newSearchInput.length > 1){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${newSearchInput}&limit=5&appid=${import.meta.env.VITE_WEATHER_API_KEY}`)
    .then(response => response.json())
    .then(data => autocomplete.value = data)
  }
})

function handleLinkClick(loc: string){
  autocomplete.value = []
  searchInput.value = ''
  location.value = loc
}
</script>

<template>
  <header class="header">
    <h1>{{ location }}</h1>
    <div class="inputContainer">
      <input v-model="searchInput" type="text" placeholder="Search location" class="searchInput">
      <ul v-if="autocomplete.length > 0" class="autocomplete">
        <li v-for="result in autocomplete">
          <router-link :to='`${result.lat}_${result.lon}`' @click="() => handleLinkClick(`${result.name}, ${result.state}`)">{{ result.name }}, {{ result.state }}</router-link>
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
  height: 35px;
}

.header h1{
  color: var(--brightTextColor);
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
  padding: 0 0 0 1.5em;
  color: var(--brightTextColor);
  font-size: 18px;
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
  color: var(--brightTextColor);
  display: block;
  padding: .4em;
  width: calc(100% - .8em);
  transition: all 200ms ease;
  border-radius: 5px;
}

.autocomplete a:hover{
  background-color: var(--thirdColor);
}

@media screen and (max-width: 1024px) {
  .header{
    flex-direction: column;
  }
  .inputContainer{
    top: 45px;
  }
}

</style>