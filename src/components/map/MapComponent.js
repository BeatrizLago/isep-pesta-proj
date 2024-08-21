import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableWithoutFeedback,
  Button,
  Text,
  Platform,
  FlatList,
} from "react-native";
import MapView, { Polyline, Marker, UrlTile } from "react-native-maps";
import LocationDetail from "../locationDetail/locationDetail";
import { Styles } from "./MapComponent.styles";
import * as Location from "expo-location";
import ActivityLoader from "../activityloader/ActivityLoader";
import polyline from "@mapbox/polyline";
import { metersToKilometers, secondsToHours } from "../../utils/utils";

// Custom hook to handle location permissions and fetching current location
const useUserLocation = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      }
    };

    requestLocationPermission();
  }, []);

  return location;
};

// Custom hook to decode and manage route coordinates
const useRouteCoordinates = (directions) => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);

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

  return routeCoordinates;
};

// Component for rendering map markers
const Markers = ({ locations, routeCoordinates, onMarkerPress }) => (
  <>
    {routeCoordinates.length > 0 ? (
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
    ) : (
      locations &&
      locations.map((loc) => (
        <Marker
          key={loc.id}
          coordinate={{
            latitude: parseFloat(loc.coordinates.latitude),
            longitude: parseFloat(loc.coordinates.longitude),
          }}
          title={loc.name}
          onPress={() => onMarkerPress(loc)}
        />
      ))
    )}
  </>
);

// Component for rendering a mini box with text
const RouteInfoBox = ({ routeCoordinates, directions }) => {
  if (routeCoordinates.length === 0 || !directions) return null;

  const steps = directions.routes[0].segments[0].steps;

  const renderItem = ({ item, index }) => (
    <View style={Styles.listItem}>
      <Text style={Styles.listItemText}>
        {index + 1}. {item.instruction}
      </Text>
    </View>
  );

  return (
    <View style={Styles.routeInfoBox}>
      <Text style={Styles.routeInfoText}>Route Available</Text>
      <Text style={Styles.routeInfoText}>
        Distance: {metersToKilometers(directions.routes[0].summary.distance)} km
      </Text>
      <Text style={Styles.routeInfoText}>
        Duration: {secondsToHours(directions.routes[0].summary.duration)} h
      </Text>
      <View style={Styles.listContainer}>
        <FlatList
          data={steps}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={true}
        />
      </View>
    </View>
  );
};

// Main map component
const MapComponent = ({ destination, directions, locations, t }) => {
  const mapRef = useRef(null);
  const location = useUserLocation();
  const routeCoordinates = useRouteCoordinates(directions);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleZoomToUserLocation = useCallback(() => {
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
  }, [location]);

  const handleMapPress = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const handleMarkerPress = useCallback((loc) => {
    setSelectedLocation(loc);
  }, []);

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
            <Markers
              locations={locations}
              routeCoordinates={routeCoordinates}
              onMarkerPress={handleMarkerPress}
            />
            <UrlTile
              urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
              maximumZ={19}
            />
          </MapView>

          {Platform.OS === "ios" && (
            <View style={Styles.buttonContainer}>
              <Button
                title="Zoom to My Location"
                onPress={handleZoomToUserLocation}
              />
            </View>
          )}

          <RouteInfoBox
            routeCoordinates={routeCoordinates}
            directions={directions}
          />
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
