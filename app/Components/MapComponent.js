// MapComponent.js
import React from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Styles from "./Styles";

const MapComponent = ({ destination, portugalCenter }) => {
  return (
    <View style={Styles.mapContainer}>
      <MapView
        style={Styles.map}
        initialRegion={{
          latitude: portugalCenter.latitude,
          longitude: portugalCenter.longitude,
          latitudeDelta: portugalCenter.zoomLevel,
          longitudeDelta: portugalCenter.zoomLevel,
        }}
      >
        {destination && <Marker coordinate={destination} title="Destination" />}
        <Marker coordinate={portugalCenter} title="Portugal" />
      </MapView>
    </View>
  );
};

export default MapComponent;
