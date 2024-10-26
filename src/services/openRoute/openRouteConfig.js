import axios from 'axios';

const API_KEY = 'YOUR_INFO_HERE'; 
const BASE_URL = 'https://api.openrouteservice.org';

export const openRouteService = axios.create({
  baseURL: BASE_URL,
 headers: {
    'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8',
    'Content-Type': 'application/json',
    'Authorization': API_KEY,
  },
});
