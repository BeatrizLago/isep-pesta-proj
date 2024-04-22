// MapComponent.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';


const MapComponent = ({ destination, portugalCenter }) => {
  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} initialRegion={{
        latitude: portugalCenter.latitude,
        longitude: portugalCenter.longitude,
        latitudeDelta: portugalCenter.zoomLevel,
        longitudeDelta: portugalCenter.zoomLevel,
      }}>
        {destination && <Marker coordinate={destination} title="Destination" />}
        <Marker coordinate={portugalCenter} title="Portugal" />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    width: '95%',
    height: '80%',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 20,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
