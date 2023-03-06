<script setup lang="ts">
import Drizzle from '../assets/Drizzle.vue';
import Thunderstorm from '../assets/Thunderstorm.vue';
import Shower from '../assets/Shower.vue';
import LightSnow from '../assets/LightSnow.vue';
import Snow from '../assets/Snow.vue';
import Sleet from '../assets/Sleet.vue';
import Sunny from '../assets/Sunny.vue';
import Few from '../assets/Few.vue';
import Scattered from '../assets/Scattered.vue';
import Overcast from '../assets/Overcast.vue';
import WeatherIcon from './WeatherIcon.vue';

const props = defineProps({
  date: Number,
  temperature: Object,
  pressure: Number,
  humidity: Number,
  wind: Object,
  weather: Number,
  first: String
})

const daysOfTheWeek = ["Sun", 'Mon', 'Tue', 'Wed', 'Thu', "Fri", "Sat"]

function findWindDirection(wind_deg: number){
  if (wind_deg>11.25 && wind_deg<33.75){
    return "NNE";
  }else if (wind_deg>33.75 && wind_deg<56.25){
    return "ENE";
  }else if (wind_deg>56.25 && wind_deg<78.75){
    return "E";
  }else if (wind_deg>78.75 && wind_deg<101.25){
    return "ESE";
  }else if (wind_deg>101.25 && wind_deg<123.75){
    return "ESE";
  }else if (wind_deg>123.75 && wind_deg<146.25){
    return "SE";
  }else if (wind_deg>146.25 && wind_deg<168.75){
    return "SSE";
  }else if (wind_deg>168.75 && wind_deg<191.25){
    return "S";
  }else if (wind_deg>191.25 && wind_deg<213.75){
    return "SSW";
  }else if (wind_deg>213.75 && wind_deg<236.25){
    return "SW";
  }else if (wind_deg>236.25 && wind_deg<258.75){
    return "WSW";
  }else if (wind_deg>258.75 && wind_deg<281.25){
    return "W";
  }else if (wind_deg>281.25 && wind_deg<303.75){
    return "WNW";
  }else if (wind_deg>303.75 && wind_deg<326.25){
    return "NW";
  }else if (wind_deg>326.25 && wind_deg<348.75){
    return "NNW";
  }else{
    return "N"; 
  }
}
</script>

<template>
  <div :class="{ 'f-item-container': date, 'first': first === 'first' || first === 'first-full', 'first-full': first === 'first-full'}">
    <p v-if="props.date && first === 'no'" class="day">{{ daysOfTheWeek[new Date(props.date * 1000).getDay()] }}</p>
    <p v-else-if="props.date && (first === 'first' || first === 'first-full')" class="day">Today</p>
    <div class="content">
      <WeatherIcon
        :weather="weather"
      />
      <div v-if="first === 'no' || first === 'first'" class="temp-container">
        <p v-if="props.temperature" class="temp">{{ Math.floor(props.temperature.day) }}º</p>
        <p v-if="props.temperature" class="temp-min">{{ Math.floor(props.temperature.min) }}º</p>
      </div>
      <div class="desc" v-show="first === 'first-full'">
        <p v-if="props.temperature">Morning temperature: <strong>{{ Math.floor(props.temperature.morn) }}º C</strong></p>
        <p v-if="props.temperature">Afternoon temperature: <strong>{{ Math.floor(props.temperature.day) }}º C</strong></p>
        <br>
        <p v-if="props.pressure">Pressure: <strong>{{ Math.floor(props.pressure) }} hPa</strong></p>
        <p v-if="props.humidity">Humidity: <strong>{{ Math.floor(props.humidity) }}%</strong></p>
        <p v-if="props.wind">Wind: <strong>{{ Math.floor(props.wind.speed * 3.6) }} km/h {{ findWindDirection(props.wind.direction) }}</strong></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.f-item-container{
  background-color: var(--secondaryColor);
  border-radius: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  height: 240px;
  justify-content: space-between;
  min-width: 95px;
}
.content{
  margin-top: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.day{
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}
.temp{
  font-size: 42px;
  font-weight: 700;
  margin: 0;
}
.temp-min{
  margin: -15px 0 0 0;
  font-size: 24px;
  color: var(--darkTextColorAlpha);
}

.f-item-container.first{
  background-color: var(--accentColor);
  color: #101014;
}
.f-item-container.first .temp-min{
  color: #10101491;
}
.f-item-container.first-full{
  min-width: 450px;
  padding: 30px;
  align-items: flex-start;
}
.f-item-container.first-full .content{
  height: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.f-item-container.first-full .desc{
  text-align: left;
}
.f-item-container.first-full .desc p{
  margin: 0;
}
.f-item-container.first-full .temp-min{
  color: rgba(12, 12, 12, 0.457);
}

@media screen and (max-width: 768px) {
  .f-item-container{
    flex-direction: row;
    padding: 10px 20px;
    height: calc(100% - 20px);
    border-radius: 20px;
  }
  .content{
    flex-direction: row;
    margin: 0;
    gap: 20px;
    width: unset;
  }
  .f-item-container svg{
    max-height: 40px;
  }
  .temp-container{
    display: flex;
    flex-direction: row;
    align-items: baseline;
    gap: 10px;
  }
  .temp{
    font-size: 24px;
  }
  .temp-min{
    font-size: 18px;
  }
}
</style>

<style>
.f-item-container:not(.first) svg{
  width: 70%;
  max-width: 200px;
  max-height: 100px;
}
.f-item-container.first-full svg{
  height: 100%;
  max-width: 180px;
}
@media screen and (max-width: 768px) {
  .f-item-container.first svg{
    height: 70px;
    max-height: 70px;
  }
  .f-item-container:not(.first) svg{
    height: 70px;
  }
}
</style>