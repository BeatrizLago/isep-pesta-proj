import React, { useRef, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Linking } from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import LocationDetail from "../locationDetail/locationDetail";
import { Styles } from "./MapComponent.styles";
import * as Location from "expo-location";
import ActivityLoader from "../activityloader/ActivityLoader";
import axios from "axios";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    })();
  }, []);
  return location;
};

const usePointsOfInterest = (latitude, longitude) => {
  const [poi, setPoi] = useState([]);
  useEffect(() => {
    if (latitude && longitude) {
      const fetchPOI = async () => {
        try {
          const response = await axios.get(
              `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${longitude},${latitude},10000&limit=200&apiKey=${GEOAPIFY_API_KEY}`
          );
          setPoi(
              response.data.features.map((poi) => ({
                id: poi.properties.place_id,
                name: poi.properties.name || "Ponto de Interesse",
                latitude: poi.geometry.coordinates[1],
                longitude: poi.geometry.coordinates[0],
              }))
          );
        } catch (error) {
          console.error(error);
        }
      };
      fetchPOI();
    }
  }, [latitude, longitude]);
  return poi;
};

const Markers = ({ locations, pois, onMarkerPress, handleDirections }) => (
    <>
      {pois.map((poi) => (
          <Marker
              key={poi.id}
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
              title={poi.name}
              onPress={() => {
                onMarkerPress(poi);
                handleDirections({ latitude: poi.latitude, longitude: poi.longitude });
              }}
          />
      ))}
      {locations.map((loc) => (
          <Marker
              key={loc.id}
              coordinate={{
                latitude: parseFloat(loc.coordinates.latitude),
                longitude: parseFloat(loc.coordinates.longitude),
              }}
              title={loc.name}
              onPress={() => {
                onMarkerPress(loc);
                handleDirections({
                  latitude: parseFloat(loc.coordinates.latitude),
                  longitude: parseFloat(loc.coordinates.longitude),
                });
              }}
          />
      ))}
    </>
);

const MapComponent = ({ locations, t }) => {
  const mapRef = useRef(null);
  const location = useUserLocation();
  const pointsOfInterest = usePointsOfInterest(
      location?.coords.latitude,
      location?.coords.longitude
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const handleDirections = (destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`;
    Linking.openURL(url);
  };
  return (
      <View style={Styles.mapContainer}>
        {location ? (
            <MapView
                ref={mapRef}
                style={Styles.map}
                showsUserLocation={true}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
            >
              <Markers
                  locations={locations}
                  pois={pointsOfInterest}
                  onMarkerPress={setSelectedLocation}
                  handleDirections={handleDirections}
              />
              <UrlTile
                  urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
              />
            </MapView>
        ) : (
            <ActivityLoader />
        )}
        {selectedLocation && (
            <TouchableWithoutFeedback onPress={() => setSelectedLocation(null)}>
              <View style={Styles.locationDetailOverlay}>
                <LocationDetail
                    t={t}
                    location={{
                      ...selectedLocation,
                      address: selectedLocation.address || { street: "", city: "" },
                    }}
                    onClose={() => setSelectedLocation(null)}
                />
              </View>
            </TouchableWithoutFeedback>
        )}
      </View>
  );
};

export default MapComponent;
