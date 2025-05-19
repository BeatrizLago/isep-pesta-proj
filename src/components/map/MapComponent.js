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
  Alert,
} from "react-native";
import MapView, { Marker, UrlTile } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
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
  const [showAddChoiceModal, setShowAddChoiceModal] = useState(false);
  const [clickedCoordinate, setClickedCoordinate] = useState(null);
  const [customMarkers, setCustomMarkers] = useState([]); // <- armazenar markers personalizados

  const openCamera = async (type) => {
    setShowAddChoiceModal(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permissão negada", "Permita o uso da câmara para continuar.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      Alert.alert(
          `${type} registado com foto!`,
          `Latitude: ${clickedCoordinate.latitude.toFixed(5)}\nLongitude: ${clickedCoordinate.longitude.toFixed(5)}`
      );

      // Adicionar um novo marcador com ícone correspondente
      const icon =
          type === "Obras"
              ? require("../../assets/construcao.png")
              : require("../../assets/corte.jpg");

      const newMarker = {
        id: Date.now().toString(),
        latitude: clickedCoordinate.latitude,
        longitude: clickedCoordinate.longitude,
        type,
        icon,
      };

      setCustomMarkers((prev) => [...prev, newMarker]);

      console.log("Foto URI:", result.assets[0].uri);
    }
  };

  return (
      <View style={styles.mapContainer}>
        {location ? (
            <MapView
                ref={mapRef}
                style={styles.map}
                showsUserLocation
                onPress={(e) => {
                  setClickedCoordinate(e.nativeEvent.coordinate);
                  setShowAddChoiceModal(true);
                }}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.1,
                  longitudeDelta: 0.1,
                }}
            >
              {/* Pontos de Interesse e outros locais */}
              {pointsOfInterest.map((poi) => (
                  <Marker
                      key={poi.id}
                      coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
                      title={poi.name}
                      onPress={() => setSelectedLocation(poi)}
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
                      onPress={() =>
                          setSelectedLocation({
                            ...loc,
                            address: loc.address || { street: "", city: "", formatted: "" },
                          })
                      }
                  />
              ))}

              {/* Marcadores personalizados com ícones */}
              {customMarkers.map((marker) => (
                  <Marker
                      key={marker.id}
                      coordinate={{
                        latitude: marker.latitude,
                        longitude: marker.longitude,
                      }}
                      title={marker.type}
                  >
                    <Image
                        source={marker.icon}
                        style={{ width: 32, height: 32 }}
                        resizeMode="contain"
                    />
                  </Marker>
              ))}

              <UrlTile
                  urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  maximumZ={19}
              />
            </MapView>
        ) : (
            <ActivityLoader />
        )}

        {/* Botão de alerta */}
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

        {/* Modal de alertas */}
        <Modal visible={showAlertModal} animationType="fade" transparent>
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
                <TouchableOpacity
                    onPress={() => Alert.alert("Corte", "Alerta de corte registado")}
                >
                  <Image
                      source={require("../../assets/corte.jpg")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Cortes</Text>
              </View>
              <View style={styles.iconWithLabel}>
                <TouchableOpacity
                    onPress={() => Alert.alert("Obras", "Alerta de obras registado")}
                >
                  <Image
                      source={require("../../assets/construcao.png")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Obras</Text>
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

        {/* Modal de emergência */}
        <Modal visible={showSOSModal} animationType="fade" transparent>
          <TouchableWithoutFeedback onPress={() => setShowSOSModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Emergência</Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>Urgências: </Text>
              <TouchableOpacity onPress={() => Linking.openURL("tel:112")}>
                <Text style={styles.phoneNumber}>112</Text>
              </TouchableOpacity>
            </Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>SNS: </Text>
              <TouchableOpacity onPress={() => Linking.openURL("tel:808242424")}>
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

        {/* Modal ao clicar no mapa (Obras ou Cortes com CÂMARA) */}
        <Modal
            visible={showAddChoiceModal}
            animationType="fade"
            transparent
            onRequestClose={() => setShowAddChoiceModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowAddChoiceModal(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registar</Text>
            <Text style={styles.modalText}>
              {clickedCoordinate
                  ? `Selecione o tipo de alerta para:\nLat: ${clickedCoordinate.latitude.toFixed(
                      5
                  )}, Lon: ${clickedCoordinate.longitude.toFixed(5)}`
                  : "Coordenadas indisponíveis"}
            </Text>
            <View style={styles.iconGrid}>
              <View style={styles.iconWithLabel}>
                <TouchableOpacity onPress={() => openCamera("Obras")}>
                  <Image
                      source={require("../../assets/construcao.png")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Obras</Text>
              </View>
              <View style={styles.iconWithLabel}>
                <TouchableOpacity onPress={() => openCamera("Cortes")}>
                  <Image
                      source={require("../../assets/corte.jpg")}
                      style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.iconLabel}>Cortes</Text>
              </View>
            </View>
            <Pressable
                style={styles.modalButton}
                onPress={() => setShowAddChoiceModal(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </Pressable>
          </View>
        </Modal>
      </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  alertButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 50,
    elevation: 5,
  },
  alertIcon: { width: 30, height: 30 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  phoneNumber: {
    color: "blue",
    textDecorationLine: "underline",
  },
  modalButton: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  iconWithLabel: {
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
  },
});

export default MapComponent;