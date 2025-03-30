import React, { useRef, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import MapView, { Marker, UrlTile, Polyline } from "react-native-maps";
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

const getDirectionsFromAPI = async (startLat, startLng, endLat, endLng) => {
  try {
    const response = await axios.get(
        `https://api.geoapify.com/v1/routing?waypoints=${startLat},${startLng}|${endLat},${endLng}&mode=drive&apiKey=${GEOAPIFY_API_KEY}`
    );

    if (response.data && response.data.features.length > 0) {
      // Extract coordinates from the response
      const coordinates = response.data.features[0].geometry.coordinates.map(
          coord => ({
            latitude: coord[1],
            longitude: coord[0]
          })
      );
      return coordinates;
    }
    return [];
  } catch (error) {
    console.error("Error fetching directions:", error);
    return [];
  }
};

const Markers = ({ locations, pois, onMarkerPress, onGetDirections, userLocation }) => (
    <>
      {pois.map((poi) => (
          <Marker
              key={poi.id}
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
              title={poi.name}
              onPress={() => {
                onMarkerPress(poi);
                if (userLocation) {
                  onGetDirections(
                      userLocation.coords.latitude,
                      userLocation.coords.longitude,
                      poi.latitude,
                      poi.longitude
                  );
                }
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
                if (userLocation) {
                  onGetDirections(
                      userLocation.coords.latitude,
                      userLocation.coords.longitude,
                      parseFloat(loc.coordinates.latitude),
                      parseFloat(loc.coordinates.longitude)
                  );
                }
              }}
          />
      ))}
    </>
);

const MapComponent = ({ locations, directions }) => {
  const mapRef = useRef(null);
  const location = useUserLocation();
  const pointsOfInterest = usePointsOfInterest(
      location?.coords.latitude,
      location?.coords.longitude
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const handleGetDirections = async (startLat, startLng, endLat, endLng) => {
    const coords = await getDirectionsFromAPI(startLat, startLng, endLat, endLng);
    setRouteCoordinates(coords);

    // Fit the map to show the entire route
    if (coords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true
      });
    }
  };

  // Use directions if they are provided from props (from Redux store)
  useEffect(() => {
    if (directions && directions.routes && directions.routes.length > 0 && location) {
      const formattedCoordinates = directions.routes[0].geometry.coordinates.map(
          coord => ({
            latitude: coord[1],
            longitude: coord[0]
          })
      );
      setRouteCoordinates(formattedCoordinates);

      if (formattedCoordinates.length > 0 && mapRef.current) {
        mapRef.current.fitToCoordinates(formattedCoordinates, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true
        });
      }
    }
  }, [directions, location]);

  return (
      <View style={Styles.mapContainer}>
        {location ? (
            <>
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
                    onGetDirections={handleGetDirections}
                    userLocation={location}
                />
                {routeCoordinates.length > 0 && (
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeWidth={4}
                        strokeColor="#1E90FF"
                    />
                )}
                <UrlTile
                    urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    maximumZ={19}
                />
              </MapView>
            </>
        ) : (
            <ActivityLoader />
        )}

        {selectedLocation && (
            <TouchableWithoutFeedback onPress={() => setSelectedLocation(null)}>
              <View style={Styles.locationDetailOverlay}>
                <LocationDetail
                    location={selectedLocation}
                    onClose={() => setSelectedLocation(null)}
                />
              </View>
            </TouchableWithoutFeedback>
        )}
      </View>
  );
};

export default MapComponent;