import React, { useRef, useEffect, useState } from "react";
import { View, TouchableWithoutFeedback, Button, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import LocationDetail from "../locationDetail/locationDetail";
import { Styles } from "./MapComponent.styles";
import * as Location from "expo-location";
import ActivityLoader from "../activityloader/ActivityLoader";
import Mapbox from "@rnmapbox/maps";

Mapbox.setAccessToken(
  "sk.eyJ1IjoiMTIwMTEzMiIsImEiOiJjbHl5bDc5ZnUxZmZ3MmpzMGkxeDk2NGh5In0.pdYLJDr9jpkELX-UuuoPOA"
);

const MapComponent = ({ destination, locations, t }) => {
  const mapRef = useRef(null);
  const portoCoords = {
    latitude: 41.1579,
    longitude: -8.6291,
  };

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

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
    // <View style={Styles.mapContainer}>
    //   {location ? (
    //     <>
    //       <MapView
    //         ref={mapRef}
    //         style={Styles.map}
    //         showsUserLocation={true}
    //         initialRegion={{
    //           latitude: location.coords.latitude,
    //           longitude: location.coords.longitude,
    //           latitudeDelta: 0.1,
    //           longitudeDelta: 0.1,
    //         }}
    //         onPress={handleMapPress}
    //       >
    //         <UrlTile
    //           urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //           maximumZ={19}
    //         />
    //         {locations &&
    //           locations.map((loc) => (
    //             <Marker
    //               key={loc.id}
    //               coordinate={{
    //                 latitude: parseFloat(loc.coordinates.latitude),
    //                 longitude: parseFloat(loc.coordinates.longitude),
    //               }}
    //               title={loc.name}
    //               onPress={() => handleMarkerPress(loc)}
    //             />
    //           ))}
    //       </MapView>
    //       {Platform.OS === "ios" && (
    //         <View style={Styles.buttonContainer}>
    //           <Button
    //             title="Zoom to My Location"
    //             onPress={handleZoomToUserLocation}
    //           />
    //         </View>
    //       )}
    //     </>
    //   ) : (
    //     <ActivityLoader />
    //   )}

    //   {selectedLocation && (
    //     <TouchableWithoutFeedback onPress={() => setSelectedLocation(null)}>
    //       <View style={Styles.locationDetailOverlay}>
    //         <LocationDetail
    //           location={selectedLocation}
    //           onClose={() => setSelectedLocation(null)}
    //           t={t}
    //         />
    //       </View>
    //     </TouchableWithoutFeedback>
    //   )}
    // </View>

    <View>
      <View>
        <Mapbox.MapView />
      </View>
    </View>
  );
};

export default MapComponent;
