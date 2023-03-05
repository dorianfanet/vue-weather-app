export default function findIcon(weatherId: number){
  if(weatherId){
    if(weatherId >= 200 && weatherId <= 299){
      return 'thunderstorm'
    } else if(weatherId >= 300 && weatherId <= 399){
      return 'drizzle'
    } else if(weatherId >= 500 && weatherId <= 599){
      return 'shower'
    } else if(weatherId === 600 || weatherId === 612 || weatherId === 620){
      return 'light-snow'
    } else if(weatherId === 611 || weatherId === 615 || weatherId === 616){
      return 'sleet'
    } else if(weatherId && weatherId >= 600 && weatherId <= 699){
      return 'snow'
    } else if(weatherId === 801){
      return 'few'
    } else if(weatherId === 802){
      return 'scattered'
    } else if(weatherId === 803 || weatherId === 804){
      return 'overcast'
    } else {
      return 'sunny'
    }
  } else {
    return 'sunny'
  }
}