export interface ForecastType {
  current: {
    weather: [
      {
        id: number
      }
    ]
  }
  daily: [
    {
      dt: number,
      temp: {
        day: number
      },
      pressure: number,
      humidity: number,
      wind_speed: number,
      wind_deg: number,
      weather: [
        {
          id: number
        }
      ]
    }
  ]
}

export interface MapDataType {
  loading: boolean
}

export interface AutocompletType {
  lat: Number,
  lon: Number,
  name: String,
  state: String,
  geometry: {
    coordinates: [number, number]
  },
  place_name: string
}