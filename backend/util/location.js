async function getCoordsForAddress(address) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json`
  );

  const data = await response.json();

  if (!data || data.status === "ZERO_RESULTS") {
    throw new Error("Could not find location for the specified address.");
  }

  const coordinates = data[0];
  return coordinates;
}

export default getCoordsForAddress;
