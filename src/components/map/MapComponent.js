import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {Styles} from "./MapComponent.styles";
import { useRef, useEffect } from "react";

const MapComponent = ({ destination, locations }) => {
  const mapRef = useRef(null);
  // coordenadas do porto
  const portoCoords = {
    latitude: 41.1579,
    longitude: -8.6291,
  };

  useEffect(() => {
    if (destination && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...destination,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000 // 1000ms animation duration
      );
    }
  }, [destination]);

  return (
    <View style={Styles.mapContainer}>
      <MapView
        ref={mapRef}
        style={Styles.map}
        initialRegion={{
          latitude: portoCoords.latitude,
          longitude: portoCoords.longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        }}
      >
        {destination && (
          <Marker coordinate={destination} title={destination.name} />
        )}
        {locations &&
          locations.map((location) => (
            <Marker
              key={location.id}
              coordinate={{
                latitude: parseFloat(location.coordinates.latitude),
                longitude: parseFloat(location.coordinates.longitude),
              }}
              title={location.name}
            />
          ))}
      </MapView>
    </View>
  );
};

export default MapComponent;
