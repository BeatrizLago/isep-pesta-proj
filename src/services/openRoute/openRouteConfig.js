import axios from 'axios';

const API_KEY = '5b3ce3597851110001cf6248c1ff3b230bb9411e987fb5b118cbf9f9'; 
const BASE_URL = 'https://api.openrouteservice.org';

export const openRouteService = axios.create({
  baseURL: BASE_URL,
 headers: {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Content-Type': 'application/json',
    'Authorization': API_KEY,
  },
});