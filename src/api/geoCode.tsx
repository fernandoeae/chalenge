export const getLatLngFromAddress = async (address: any) => {
  const apiKey = 'AIzaSyB1H4k3zZQzphtFktHlSrdYucdSLkiG5AI';
  const formattedAddress = encodeURIComponent(address);
  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${formattedAddress}&key=${apiKey}`);
  const data = await response.json();
  if (data.results && data.results.length > 0) {
    const { lat, lng } = data.results[0].geometry.location;
    return { latitude: lat, longitude: lng };
  } else {
    throw new Error('Endereço não encontrado');
  }
};
