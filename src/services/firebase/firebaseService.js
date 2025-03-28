import { FIREBASE_DB } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export const savePointsOfInterest = async (pointsOfInterest) => {
    try {
        const poiCollection = collection(FIREBASE_DB, 'pointsOfInterest');
        pointsOfInterest.forEach(async (poi) => {
            await addDoc(poiCollection, {
                name: poi.display_name,
                latitude: parseFloat(poi.lat),
                longitude: parseFloat(poi.lon),
            });
        });
    } catch (error) {
        console.error('Error saving points of interest:', error);
    }
};