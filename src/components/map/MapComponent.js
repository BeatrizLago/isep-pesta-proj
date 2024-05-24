import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import {Styles} from "./MapComponent.styles";

const MapComponent = ({ destination, locations }) => {
  // Define the latitude and longitude of Porto
  const portoCoords = {
    latitude: 41.1579,
    longitude: -8.6291,
  };

  return (
    <View style={Styles.mapContainer}>
      <MapView
        style={Styles.map}
        initialRegion={{
          latitude: portoCoords.latitude,
          longitude: portoCoords.longitude,
          latitudeDelta: 0.1, // Adjust the latitudeDelta and longitudeDelta as needed
          longitudeDelta: 0.1,
        }}
      >
        {destination && (
          <Marker coordinate={destination} title="Destination" />
        )}
        {locations &&
          locations.map((location, index) => (
            <Marker
              key={index}
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
