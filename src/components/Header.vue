<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

const props = defineProps({
  coordinates: String
})

const location = ref('')

onMounted(async () => {
  updateLocationName(route.params.id as string)
})

watch(() => route.params.id, (newId) => {
  updateLocationName(newId as string)
})

function updateLocationName(newId: string){
  const splittedId = (newId as string).split('_')
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${splittedId[1]},${splittedId[0]}.json?limit=1&access_token=pk.eyJ1IjoiZG9yaWFuZmFuZXQiLCJhIjoiY2xhMnV6eTlqMGluMDNxbWJjOG53YXoybSJ9.22QaZflXbYlMLrI3XS0BGg`)
  .then(response => response.json())
  .then(response => {
    const loc = `${response.features[0].context.find((e: {id: string, text: string}) => e.id.includes('place')).text}, ${response.features[0].context.find((e: {id: string, text: string}) => e.id.includes('country')).text}`
    location.value = loc
    document.title = loc
  })
}

interface AutocompletType {
    lat: Number,
    lon: Number,
    name: String,
    state: String
  }

const searchInput = ref('')
const autocomplete = ref<AutocompletType[]>([])

watch(searchInput, (newSearchInput) => {
  if(newSearchInput.length > 1){
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${newSearchInput}.json?access_token=pk.eyJ1IjoiZG9yaWFuZmFuZXQiLCJhIjoiY2xhMnV6eTlqMGluMDNxbWJjOG53YXoybSJ9.22QaZflXbYlMLrI3XS0BGg`)
    .then(response => response.json())
    .then(data => autocomplete.value = data.features)
  } else {
    autocomplete.value = []
  }
})

function handleLinkClick(loc: string){
  autocomplete.value = []
  searchInput.value = ''
}

function handleInputSubmit(){
  router.push(`${autocomplete.value[0].geometry.coordinates[1]}_${autocomplete.value[0].geometry.coordinates[0]}`)
  autocomplete.value = []
  searchInput.value = ''
}
</script>

<template>
  <header class="header">
    <h1>{{ location }}</h1>
    <div class="inputContainer">
      <form action="" @submit="handleInputSubmit">
        <input v-model="searchInput" type="text" placeholder="Search location" class="searchInput">
        <button class="submit-btn" type="submit"></button>
      </form>
      <ul v-if="autocomplete.length > 0" class="autocomplete">
        <li v-for="result in autocomplete">
          <router-link :to='`${result.geometry.coordinates[1]}_${result.geometry.coordinates[0]}`' @click="handleLinkClick">{{ result.place_name }}</router-link>
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

.submit-btn{
  display: none;
}

@media screen and (max-width: 1024px) {
  .header{
    flex-direction: column;
  }
  .inputContainer{
    top: 45px;
    width: 70%;
  }
}

@media screen and (max-width: 768px) {
  .inputContainer{
    width: 100%;
  }
}

</style>