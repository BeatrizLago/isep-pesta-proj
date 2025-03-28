import React, { useRef, useEffect, useState } from "react";
import { View, Button } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import { Styles } from "./MapComponent.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";
const GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places";

const MapComponent = () => {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [route, setRoute] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permissão de localização negada.");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
      fetchPointsOfInterest(loc.coords.latitude, loc.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          },
          1000
      );
    }
  }, [location]);

  const fetchPointsOfInterest = async (lat, lon) => {
    try {
      const response = await axios.get(GEOAPIFY_PLACES_URL, {
        params: {
          categories: "tourism",
          filter: `circle:${lon},${lat},5000`,
          apiKey: GEOAPIFY_API_KEY,
        },
      });
      const pois = response.data.features.map((poi) => ({
        id: poi.properties.id,
        name: poi.properties.name || "Ponto Turístico",
        latitude: poi.geometry.coordinates[1],
        longitude: poi.geometry.coordinates[0],
      }));
      setPointsOfInterest(pois);
    } catch (error) {
      console.error("Erro ao buscar pontos turísticos:", error);
    }
  };

  const fetchDirections = async (destination) => {
    if (!location) return;
    try {
      const response = await axios.get("https://api.geoapify.com/v1/routing", {
        params: {
          waypoints: `${location.latitude},${location.longitude}|${destination.latitude},${destination.longitude}`,
          mode: "drive",
          apiKey: GEOAPIFY_API_KEY,
        },
      });
      if (response.data.features && response.data.features.length > 0) {
        const routeCoords = response.data.features[0].geometry.coordinates.map(
            (coord) => ({
              latitude: coord[1],
              longitude: coord[0],
            })
        );
        setRoute(routeCoords);
      } else {
        console.error("Nenhuma rota encontrada.");
      }
    } catch (error) {
      console.error("Erro ao buscar direções:", error);
    }
  };

  return (
      <View style={Styles.container}>
        {!location ? (
            <ActivityLoader />
        ) : (
            <>
              <MapView
                  ref={mapRef}
                  style={Styles.map}
                  showsUserLocation={true}
                  initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
              >
                {pointsOfInterest.map((poi) => (
                    <Marker
                        key={poi.id}
                        coordinate={{
                          latitude: poi.latitude,
                          longitude: poi.longitude,
                        }}
                        title={poi.name}
                        onPress={() => {
                          setSelectedDestination(poi);
                          fetchDirections(poi);
                        }}
                    />
                ))}
                {route && <Polyline coordinates={route} strokeWidth={3} strokeColor="blue" />}
              </MapView>

              {selectedDestination && (
                  <Button
                      title="Limpar Rota"
                      onPress={() => {
                        setRoute(null);
                        setSelectedDestination(null);
                      }}
                  />
              )}
            </>
        )}
      </View>
  );
};

export default MapComponent;