
// WMO Weather Codes mapping
// https://open-meteo.com/en/docs
const getWeatherIcon = (code: number): { icon: string; label: string; color: string } => {
  // Temiz / Güneşli
  if (code === 0) return { icon: 'bi-sun-fill', label: 'Güneşli', color: 'text-yellow-500' }
  // Az Bulutlu
  if (code === 1 || code === 2 || code === 3) return { icon: 'bi-cloud-sun-fill', label: 'Parçalı Bulutlu', color: 'text-yellow-400' }
  // Sisli
  if (code === 45 || code === 48) return { icon: 'bi-cloud-fog2-fill', label: 'Sisli', color: 'text-gray-400' }
  // Çiseleme
  if (code >= 51 && code <= 57) return { icon: 'bi-cloud-drizzle-fill', label: 'Çisenti', color: 'text-blue-300' }
  // Yağmurlu
  if (code >= 61 && code <= 67) return { icon: 'bi-cloud-rain-heavy-fill', label: 'Yağmurlu', color: 'text-blue-500' }
  // Kar
  if (code >= 71 && code <= 77) return { icon: 'bi-cloud-snow-fill', label: 'Karlı', color: 'text-white' }
  // Sağanak
  if (code >= 80 && code <= 82) return { icon: 'bi-cloud-rain-fill', label: 'Sağanak Yağışlı', color: 'text-blue-600' }
  // Kar Sağanağı
  if (code >= 85 && code <= 86) return { icon: 'bi-cloud-snow', label: 'Kar Sağanağı', color: 'text-gray-200' }
  // Fırtına
  if (code >= 95) return { icon: 'bi-cloud-lightning-rain-fill', label: 'Fırtınalı', color: 'text-purple-500' }
  
  return { icon: 'bi-cloud-fill', label: 'Bulutlu', color: 'text-gray-400' }
}

export interface WeatherData {
  temperature: number
  condition: string
  icon: string
  color: string
}

// OMÜ Kurupelit Kampüsü Koordinatları
const DEFAULT_LAT = 41.3689
const DEFAULT_LON = 36.2052

export async function getCurrentWeather(lat: number = DEFAULT_LAT, lon: number = DEFAULT_LON): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`,
      { next: { revalidate: 3600 } } // 1 saat cache
    )

    if (!response.ok) throw new Error('Hava durumu alınamadı')

    const data = await response.json()
    const current = data.current
    const weatherInfo = getWeatherIcon(current.weather_code)

    return {
      temperature: Math.round(current.temperature_2m),
      condition: weatherInfo.label,
      icon: weatherInfo.icon,
      color: weatherInfo.color
    }
  } catch (error) {
    console.error('Weather fetch error:', error)
    return null
  }
}
