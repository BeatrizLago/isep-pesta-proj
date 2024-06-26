// MapComponent.js

import React, { useRef, useEffect, useState } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import LocationDetail from '../locationDetail/locationDetail';
import { Styles } from './MapComponent.styles';


const MapComponent = ({ destination, locations, t }) => {
  const mapRef = useRef(null);
  const portoCoords = {
    latitude: 41.1579,
    longitude: -8.6291,
  };

  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (destination && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          ...destination,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        },
        1000
      );
    }
  }, [destination]);

  const handleMapPress = () => {
    setSelectedLocation(null); // Close LocationDetail on map press
  };

  const handleMarkerPress = (location) => {
    setSelectedLocation(location); // Show LocationDetail on marker press
  };

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
        onPress={handleMapPress} // Handle map press to close LocationDetail
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
              onPress={() => handleMarkerPress(location)}
            />
          ))}
      </MapView>

      {selectedLocation && (
        <TouchableWithoutFeedback onPress={() => setSelectedLocation(null)}>
          <View style={Styles.locationDetailOverlay}>
            <LocationDetail
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
              t = {t} 
            />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default MapComponent;
