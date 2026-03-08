export async function get_country_url(country: string): Promise<string> {
    const geocode_url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(country)}&type=country&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`;
    const response = await fetch(geocode_url);
    const json = await response.json();

    const place_id = json.features[0].properties.place_id;
    const boundary_url = `https://api.geoapify.com/v1/boundaries/consists-of?id=${place_id}&geometry=geometry_1000&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`;
    const boundary_response = await fetch(boundary_url);
    const boundary_json = await boundary_response.json();

    const randomFeature = boundary_json.features[Math.floor(Math.random() * boundary_json.features.length)];
    const geometry = randomFeature.geometry;

    const coords = geometry.type === 'MultiPolygon' 
        ? geometry.coordinates[0][0] 
        : geometry.coordinates[0];
    const random_index = Math.floor(Math.random() * coords.length);
    const lon_and_lat = coords[random_index];
    
    const lon = lon_and_lat[0];
    const lat = lon_and_lat[1];
    return `https://maps.geoapify.com/v1/staticmap?format=png&style=toner&width=600&height=400&center=lonlat:${lon},${lat}&zoom=10&scaleFactor=2&apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`;
}