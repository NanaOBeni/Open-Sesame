import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styling.css'
import * as dotenv from "dotenv";

dotenv.config();

createRoot(document.getElementById('root')!).render(<App />)

function get_country_url(country: string): string {
    function get_place_id(): string {
        const geocode_url = `https://api.geoapify.com/v1/geocode/search?=${encodeURIComponent(country)}&type=country&apiKey=${process.env.GEOAPIFY_KEY}`;

        const response = await fetch(geocode_url);
        const json = await response.json();

        return json.results[0].place_id;
    }

    const place_id = get_place_id();

    const boundary_url = `https://api.geoapify.com/v1/boundaries/consists-of?id=${place_id}&geometry=geometry_1000&apiKey=${process.env.GEOAPIFY_KEY}`;

    const boundary_response = await fetch(boundary_url);
    const boundary_json = await boundary_response.json();

    // Get random lat and lon from json. Then ret the final url.

    const len = boundary_json.features[0].geometry.coordinates[0].length;
    const random_index = Math.random() * len;
    const lon_and_lat = boundary_json.features[0].geometry.coordinates[random_index];
    const lon = lon_and_lat[0];
    const lat = lon_and_lat[1];

    return `https://maps.geoapify.com/v1/staticmap?format=png&style=toner&width=600&height=400&center=lonlat:${lon},${lat}&zoom=20&scaleFactor=2&apiKey=YOUR_API_KEY`;
}
