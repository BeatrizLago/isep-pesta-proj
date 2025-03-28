import axios from 'axios';

const GEOAPIFY_API_URL = 'https://api.geoapify.com/v2/places';

export const fetchPointsOfInterest = async (latitude, longitude, radius = 1500, apiKey) => {
    try {
        const response = await axios.get(GEOAPIFY_API_URL, {
            params: {
                categories: 'tourism',
                filter: `circle:${longitude},${latitude},${radius}`,
                apiKey: apiKey,
            },
        });
        return response.data.results;
    } catch (error) {
        console.error('Error fetching points of interest:', error);
        return [];
    }
};
