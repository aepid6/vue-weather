const EARTH_RADIUS_KM = 6371

const toRadians = (degrees) => degrees * (Math.PI / 180)

export const calculateDistance = (currentLocation, city) => {
  if (!Number.isFinite(currentLocation?.lat) || !Number.isFinite(currentLocation?.lon) || !Number.isFinite(city?.lat) || !Number.isFinite(city?.lon)) return Infinity

  const latitudeDifference = toRadians(city.lat - currentLocation.lat)
  const longitudeDifference = toRadians(city.lon - currentLocation.lon)
  const currentLatitude = toRadians(currentLocation.lat)
  const cityLatitude = toRadians(city.lat)
  const haversine = Math.sin(latitudeDifference / 2) ** 2 + Math.cos(currentLatitude) * Math.cos(cityLatitude) * Math.sin(longitudeDifference / 2) ** 2

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine))
}
