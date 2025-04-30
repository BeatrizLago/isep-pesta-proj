import React, { useRef, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Linking,
  StyleSheet,
  Modal,
  Text,
  Pressable,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";
import LocationDetail from "../locationDetail/locationDetail";
import ActivityLoader from "../activityloader/ActivityLoader";

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
                address: {
                  street: poi.properties.street || poi.properties.address_line1 || "",
                  city: poi.properties.city || "",
                  formatted: poi.properties.formatted || "",
                  address_line2: poi.properties.address_line2 || "",
                },
              }))
          );
        } catch (error) {
          console.error("Erro ao buscar POIs:", error);
        }
      };
      fetchPOI();
    }
  }, [latitude, longitude]);
  return poi;
};

const Markers = ({ locations, pois, onMarkerPress }) => (
    <>
      {pois.map((poi) => (
          <Marker
              key={poi.id}
              coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
              title={poi.name}
              onPress={() => onMarkerPress(poi)}
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
                onMarkerPress({
                  ...loc,
                  address: loc.address || { street: "", city: "", formatted: "" },
                });
              }}
          />
      ))}
    </>
);

const MapComponent = ({ locations, t }) => {
  const mapRef = useRef(null);
  const location = useUserLocation();
  const pointsOfInterest = usePointsOfInterest(
      location?.coords.latitude,
      location?.coords.longitude
  );
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showSOSModal, setShowSOSModal] = useState(false);

  return (
      <View style={styles.mapContainer}>
        {location ? (
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation
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
              />
              <UrlTile
                  urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
              />
            </MapView>
        ) : (
            <ActivityLoader />
        )}

        <TouchableOpacity
            style={styles.alertButton}
            onPress={() => setShowAlertModal(true)}
        >
          <Image
              source={require("../../assets/alerta.png")}
              style={styles.alertIcon}
              resizeMode="contain"
          />
        </TouchableOpacity>

        <Modal
            visible={showAlertModal}
            animationType="slide"
            transparent
            onRequestClose={() => setShowAlertModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowAlertModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Alertas</Text>

            <View style={styles.iconGrid}>
              <View style={styles.iconWithLabel}>
                <TouchableOpacity onPress={() => setShowSOSModal(true)}>
                  <Image
                      source={require("../../assets/sos.png")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>SOS</Text>
              </View>
              <View style={styles.iconWithLabel}>
                <TouchableOpacity onPress={() => console.log("Corte clicado")}>
                  <Image
                      source={require("../../assets/corte.jpg")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Cortes</Text>
              </View>

              <View style={styles.iconWithLabel}>
                <TouchableOpacity onPress={() => console.log("Construção clicado")}>
                  <Image
                      source={require("../../assets/construcao.png")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Obras</Text>
              </View>

              <View style={styles.iconWithLabel}>
                <TouchableOpacity onPress={() => console.log("Chat clicado")}>
                  <Image
                      source={require("../../assets/chat.jpg")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Comunidade</Text>
              </View>
            </View>

            <Pressable
                style={styles.modalButton}
                onPress={() => setShowAlertModal(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </Modal>

        <Modal
            visible={showSOSModal}
            animationType="fade"
            transparent
            onRequestClose={() => setShowSOSModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowSOSModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergência</Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Urgências: </Text>
              <TouchableOpacity onPress={() => Linking.openURL('tel:112')}>
                <Text style={styles.phoneNumber}>112</Text>
              </TouchableOpacity>
            </Text>

            <Text style={styles.modalText}>
              <Text style={styles.boldText}>SNS: </Text>
              <TouchableOpacity onPress={() => Linking.openURL('tel:808242424')}>
                <Text style={styles.phoneNumber}>808 242 424</Text>
              </TouchableOpacity>
            </Text>

            <Pressable
                style={styles.modalButton}
                onPress={() => setShowSOSModal(false)}
            >
              <Text style={styles.modalButtonText}>Fechar</Text>
            </Pressable>
          </View>
        </Modal>

        {selectedLocation && (
            <TouchableWithoutFeedback onPress={() => setSelectedLocation(null)}>
              <View style={styles.locationDetailTopOverlay}>
                <LocationDetail
                    t={t}
                    location={selectedLocation}
                    onClose={() => setSelectedLocation(null)}
                />
              </View>
            </TouchableWithoutFeedback>
        )}
      </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  alertButton: {
    position: "absolute",
    bottom: 20,
    right: 10,
    width: 40,
    height: 40,
    zIndex: 1000,
  },
  alertIcon: { width: "100%", height: "100%" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 20,
  },
  iconWithLabel: {
    alignItems: "center",
    margin: 10,
  },
  icon: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },
  modalButton: { alignSelf: "flex-end", padding: 10 },
  modalButtonText: { fontSize: 16, fontWeight: "bold" },
  locationDetailTopOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  modalText: { fontSize: 16, marginBottom: 20 },
  phoneNumber: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
});

export default MapComponent;
