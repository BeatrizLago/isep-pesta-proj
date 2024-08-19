import React, { useRef, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Button, Platform } from "react-native";
import MapView, { Polyline, Marker, UrlTile } from "react-native-maps";
import LocationDetail from "../locationDetail/locationDetail";
import { Styles } from "./MapComponent.styles";
import * as Location from "expo-location";
import ActivityLoader from "../activityloader/ActivityLoader";
import polyline from "@mapbox/polyline";

const MapComponent = ({ destination, directions, locations, t }) => {
  const mapRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [location, setLocation] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (directions) {
      const decodedCoordinates = polyline
        .decode(directions.routes[0].geometry)
        .map(([latitude, longitude]) => ({ latitude, longitude }));

      setRouteCoordinates(decodedCoordinates);
    } else {
      setRouteCoordinates([]); // Reset route coordinates if no directions
    }
  }, [directions]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };

    requestLocationPermission();
  }, []);

  const handleZoomToUserLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
    }
  };

  const handleMapPress = () => {
    setSelectedLocation(null);
  };

  const handleMarkerPress = (location) => {
    setSelectedLocation(location);
  };

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
            onPress={handleMapPress}
          >
            {routeCoordinates.length > 0 && (
              <>
                <Polyline
                  coordinates={routeCoordinates}
                  strokeColor="#000" // Black color for the route
                  strokeWidth={3} // Thickness of the route line
                />
                <Marker
                  coordinate={routeCoordinates[0]} // Start point
                  title="Start"
                />
                <Marker
                  coordinate={routeCoordinates[routeCoordinates.length - 1]} // End point
                  title="End"
                />
              </>
            )}
            <UrlTile
              urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
            {routeCoordinates.length === 0 &&
              locations && // Show markers only if no route is present
              locations.map((loc) => (
                <Marker
                  key={loc.id}
                  coordinate={{
                    latitude: parseFloat(loc.coordinates.latitude),
                    longitude: parseFloat(loc.coordinates.longitude),
                  }}
                  title={loc.name}
                  onPress={() => handleMarkerPress(loc)}
                />
              ))}
          </MapView>
          {Platform.OS === "ios" && (
            <View style={Styles.buttonContainer}>
              <Button
                title="Zoom to My Location"
                onPress={handleZoomToUserLocation}
              />
            </View>
          )}
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
              t={t}
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default MapComponent;
