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
import MapView, { Marker, UrlTile, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import ActivityLoader from "../activityloader/ActivityLoader";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from "react-redux";
import haversine from 'haversine-distance';

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

const useUserLocation = () => {
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);

                Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.High,
                        timeInterval: 5000,
                        distanceInterval: 10,
                    },
                    (newLocation) => {
                        setLocation(newLocation);
                    }
                );

            } else {
                Alert.alert("Permissão de Localização Negada", "Por favor, conceda permissão de localização para usar o mapa.");
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
                        response.data.features.map((poiItem) => ({
                            id: poiItem.properties.place_id,
                            name: poiItem.properties.name || "Ponto de Interesse",
                            latitude: poiItem.geometry.coordinates[1],
                            longitude: poiItem.geometry.coordinates[0],
                            address: {
                                street: poiItem.properties.street || poiItem.properties.address_line1 || "",
                                city: poiItem.properties.city || "",
                                formatted: poiItem.properties.formatted || "",
                                address_line2: poiItem.properties.address_line2 || "",
                            },
                        }))
                    );
                } catch (error) {
                    Alert.alert("Erro POI", "Não foi possível carregar pontos de interesse. Verifique a chave API ou conexão.");
                }
            };
            fetchPOI();
        }
    }, [latitude, longitude]);
    return poi;
};

const reverseGeocodeAndGetRoutableCoordinate = async (lon, lat) => {
    try {
        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${GEOAPIFY_API_KEY}`
        );
        if (response.data.features && response.data.features.length > 0) {
            const feature = response.data.features[0];
            const routableCoord = {
                longitude: feature.geometry.coordinates[0],
                latitude: feature.geometry.coordinates[1],
                address: feature.properties.formatted
            };
            return routableCoord;
        }
        return null;
    } catch (error) {
        return null;
    }
};

const MapComponent = React.forwardRef(({ locations, t, selectedPoiForMapClick }, ref) => {
    const mapRef = ref || useRef(null);
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
    const [customMarkers, setCustomMarkers] = useState([]);
    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const [showAlertDetailsModal, setShowAlertDetailsModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    const [showProximityAlertModal, setShowProximityAlertModal] = useState(false);
    const [proximityAlertDetails, setProximityAlertDetails] = useState(null);
    const [shownProximityAlerts, setShownProximityAlerts] = useState({});

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const authUser = useSelector((state) => state.auth.user);
    const currentUserName = authUser?.name || "Utilizador Anónimo";

    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const storedMarkers = await AsyncStorage.getItem('mapAlertMarkers');
                if (storedMarkers) {
                    setCustomMarkers(JSON.parse(storedMarkers));
                }
            } catch (error) {
                console.error("Erro ao carregar marcadores do AsyncStorage:", error);
            }
        };
        loadMarkers();
    }, []);

    const saveMarkers = async (markers) => {
        try {
            await AsyncStorage.setItem('mapAlertMarkers', JSON.stringify(markers));
        } catch (error) {
            console.error("Erro ao guardar marcadores do AsyncStorage:", error);
        }
    };

    const handleMapPress = (e) => {
        if (!isAuthenticated) {
            Alert.alert(
                "Ação não permitida",
                "Para adicionar alertas, você precisa estar logado na sua conta. Por favor, faça login ou registe-se."
            );
            return;
        }
        setShowAddChoiceModal(true);
        setClickedCoordinate(e.nativeEvent.coordinate);
        setRouteCoordinates([]);
        setSelectedLocation(null);
        setShowAlertDetailsModal(false);
        setSelectedAlert(null);
        setShowProximityAlertModal(false);
        setProximityAlertDetails(null);
    };

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
            const newMarker = {
                id: Date.now().toString(),
                latitude: clickedCoordinate.latitude,
                longitude: clickedCoordinate.longitude,
                type,
                imageUri: result.assets[0].uri,
                icon: type === "Obras" ? "construcao" : "corte",
                publishedBy: currentUserName,
                publishedAt: new Date().toISOString(),
            };

            setCustomMarkers((prev) => {
                const updatedMarkers = [...prev, newMarker];
                saveMarkers(updatedMarkers);
                return updatedMarkers;
            });

            Alert.alert(
                `${type} registado com foto!`,
                `Latitude: ${clickedCoordinate.latitude.toFixed(5)}\nLongitude: ${clickedCoordinate.longitude.toFixed(5)}`
            );
        }
    };

    const removeAlert = () => {
        if (selectedAlert && (selectedAlert.publishedBy === currentUserName)) {
            Alert.alert(
                "Remover Alerta",
                `Tem a certeza que quer remover o alerta de ${selectedAlert.type} publicado por ${selectedAlert.publishedBy}?`,
                [
                    {
                        text: "Cancelar",
                        style: "cancel",
                    },
                    {
                        text: "Remover",
                        onPress: () => {
                            setCustomMarkers((prevMarkers) => {
                                const updatedMarkers = prevMarkers.filter(
                                    (marker) => marker.id !== selectedAlert.id
                                );
                                saveMarkers(updatedMarkers);
                                return updatedMarkers;
                            });
                            setShowAlertDetailsModal(false);
                            setSelectedAlert(null);
                            Alert.alert("Alerta Removido", `O alerta de ${selectedAlert.type} foi removido com sucesso.`);
                        },
                    },
                ],
                { cancelable: true }
            );
        } else {
            Alert.alert("Permissão Negada", "Você só pode remover alertas que você publicou.");
        }
    };

    const fetchRoute = async (destinationLon, destinationLat) => {
        if (!location) {
            Alert.alert("Erro", "Localização atual indisponível.");
            setRouteCoordinates([]);
            return;
        }

        const routableOrigin = await reverseGeocodeAndGetRoutableCoordinate(
            location.coords.longitude,
            location.coords.latitude
        );
        const routableDestination = await reverseGeocodeAndGetRoutableCoordinate(
            destinationLon,
            destinationLat
        );

        if (!routableOrigin) {
            Alert.alert(
                "Erro na Rota",
                "Não foi possível encontrar um ponto de partida roteável. Tente mover-se para uma rua ou local com melhor cobertura."
            );
            setRouteCoordinates([]);
            return;
        }

        if (!routableDestination) {
            Alert.alert(
                "Erro na Rota",
                "Não foi possível encontrar um ponto de chegada roteável. Tente locais mais próximos de ruas ou pontos mais acessíveis."
            );
            setRouteCoordinates([]);
            return;
        }

        const origin = `${routableOrigin.latitude.toFixed(6)},${routableOrigin.longitude.toFixed(6)}`;
        const destination = `${routableDestination.latitude.toFixed(6)},${routableDestination.longitude.toFixed(6)}`;

        const requestUrl = `https://api.geoapify.com/v1/routing?waypoints=${origin}|${destination}&mode=walk&apiKey=${GEOAPIFY_API_KEY}`;

        try {
            const response = await axios.get(requestUrl);

            if (response.data.features && response.data.features.length > 0) {
                const route = response.data.features[0].geometry.coordinates;
                const formattedRoute = route[0].map((coord) => ({
                    latitude: coord[1],
                    longitude: coord[0],
                }));
                setRouteCoordinates(formattedRoute);
            } else {
                Alert.alert("Rota não encontrada", "Não foi possível encontrar uma rota para o destino.");
                setRouteCoordinates([]);
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert("Erro Rota", `Erro da API: ${error.response.data.message}`);
            } else {
                Alert.alert("Erro Rota", "Não foi possível buscar a rota. Verifique sua chave API, conexão ou coordenadas.");
            }
            setRouteCoordinates([]);
        }
    };

    useEffect(() => {
        if (selectedPoiForMapClick) {
            setSelectedLocation(selectedPoiForMapClick);
            fetchRoute(selectedPoiForMapClick.coordinates.longitude, selectedPoiForMapClick.coordinates.latitude);

            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: selectedPoiForMapClick.coordinates.latitude,
                    longitude: selectedPoiForMapClick.coordinates.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }, 1000);
            }
        }
    }, [selectedPoiForMapClick]);

    useEffect(() => {
        if (location && customMarkers.length > 0) {
            checkProximityToAlerts(location.coords);
        }
    }, [location, customMarkers]);

    const checkProximityToAlerts = (userCoords) => {
        const proximityRadius = 50;

        customMarkers.forEach((marker) => {
            const markerCoords = { latitude: marker.latitude, longitude: marker.longitude };
            const distance = haversine(userCoords, markerCoords);

            if (distance <= proximityRadius && !shownProximityAlerts[marker.id]) {
                setProximityAlertDetails(marker);
                setShowProximityAlertModal(true);
                setShownProximityAlerts((prev) => ({ ...prev, [marker.id]: true }));
            } else if (distance > proximityRadius * 2 && shownProximityAlerts[marker.id]) {
                setShownProximityAlerts((prev) => {
                    const newState = { ...prev };
                    delete newState[marker.id];
                    return newState;
                });
            }
        });
    };

    return (
        <View style={styles.mapContainer}>
            {location ? (
                <MapView
                    ref={mapRef}
                    style={styles.map}
                    showsUserLocation
                    onPress={handleMapPress}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.1,
                        longitudeDelta: 0.1,
                    }}
                >
                    {pointsOfInterest.map((poi) => (
                        <Marker
                            key={poi.id}
                            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
                            title={poi.name}
                            onPress={() => {
                                setSelectedLocation(poi);
                                fetchRoute(poi.longitude, poi.latitude);
                                setShowAlertDetailsModal(false);
                                setSelectedAlert(null);
                                setShowProximityAlertModal(false);
                                setProximityAlertDetails(null);
                            }}
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
                                setSelectedLocation({
                                    ...loc,
                                    address: loc.address || { street: "", city: "", formatted: "" },
                                });
                                fetchRoute(parseFloat(loc.coordinates.longitude), parseFloat(loc.coordinates.latitude));
                                setShowAlertDetailsModal(false);
                                setSelectedAlert(null);
                                setShowProximityAlertModal(false);
                                setProximityAlertDetails(null);
                            }}
                        />
                    ))}

                    {customMarkers.map((marker) => (
                        <Marker
                            key={marker.id}
                            coordinate={{
                                latitude: marker.latitude,
                                longitude: marker.longitude,
                            }}
                            title={marker.type}
                            description={`Alerta de ${marker.type}`}
                            onPress={() => {
                                setSelectedAlert(marker);
                                setShowAlertDetailsModal(true);
                                setRouteCoordinates([]);
                                setSelectedLocation(null);
                                setShowAddChoiceModal(false);
                                setShowProximityAlertModal(false);
                                setProximityAlertDetails(null);
                            }}
                        >
                            <Image
                                source={
                                    marker.icon === "construcao"
                                        ? require("../../assets/construcao.png")
                                        : require("../../assets/corte.jpg")
                                }
                                style={{ width: 32, height: 32 }}
                                resizeMode="contain"
                            />
                        </Marker>
                    ))}

                    {routeCoordinates.length > 0 && (
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeWidth={4}
                            strokeColor="blue"
                        />
                    )}

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
                onPress={() => setShowSOSModal(true)}
            >
                <Image
                    source={require("../../assets/sos.png")}
                    style={styles.alertIcon}
                    resizeMode="contain"
                />
            </TouchableOpacity>

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

            {isAuthenticated && (
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
                                <TouchableOpacity onPress={() => openCamera("Cortes/Obstáculos")}>
                                    <Image
                                        source={require("../../assets/corte.jpg")}
                                        style={styles.icon}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.iconLabel}>Cortes/Obstáculos</Text>
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
            )}

            <Modal
                visible={showAlertDetailsModal}
                animationType="fade"
                transparent
                onRequestClose={() => setShowAlertDetailsModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowAlertDetailsModal(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                {selectedAlert && (
                    <View style={styles.alertDetailsModalContent}>
                        <Text style={styles.modalTitle}>{selectedAlert.type}</Text>
                        {selectedAlert.imageUri ? (
                            <Image
                                source={{ uri: selectedAlert.imageUri }}
                                style={styles.alertDetailImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text>Nenhuma foto disponível.</Text>
                        )}
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Publicado por:</Text> {selectedAlert.publishedBy || "Desconhecido"}
                        </Text>
                        <Text style={styles.modalText}>
                            <Text style={styles.boldText}>Data/Hora:</Text> {selectedAlert.publishedAt ? new Date(selectedAlert.publishedAt).toLocaleString() : "N/A"}
                        </Text>
                        <Pressable
                            style={[styles.modalButton, styles.removeAlertButton]}
                            onPress={removeAlert}
                        >
                            <Text style={styles.modalButtonText}>Remover Alerta</Text>
                        </Pressable>
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => setShowAlertDetailsModal(false)}
                        >
                            <Text style={styles.modalButtonText}>Fechar</Text>
                        </Pressable>
                    </View>
                )}
            </Modal>
            <Modal
                visible={showProximityAlertModal}
                animationType="fade"
                transparent
                onRequestClose={() => setShowProximityAlertModal(false)}
            >
                <TouchableWithoutFeedback onPress={() => setShowProximityAlertModal(false)}>
                    <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                {proximityAlertDetails && (
                    <View style={styles.alertDetailsModalContent}>
                        <Text style={styles.modalTitle}>Aviso de Proximidade!</Text>
                        <Text style={styles.modalText}>
                            Você está perto de um alerta de <Text style={styles.boldText}>{proximityAlertDetails.type}</Text> publicado por <Text style={styles.boldText}>{proximityAlertDetails.publishedBy || "Desconhecido"}</Text>.
                        </Text>
                        {proximityAlertDetails.imageUri ? (
                            <Image
                                source={{ uri: proximityAlertDetails.imageUri }}
                                style={styles.alertDetailImage}
                                resizeMode="contain"
                            />
                        ) : (
                            <Text>Nenhuma foto disponível para este alerta.</Text>
                        )}
                        <Pressable
                            style={styles.modalButton}
                            onPress={() => setShowProximityAlertModal(false)}
                        >
                            <Text style={styles.modalButtonText}>OK</Text>
                        </Pressable>
                    </View>
                )}
            </Modal>
        </View>
    );
});

const styles = StyleSheet.create({
    mapContainer: {
        flex: 1,
    },
    map: {
        flex: 0.8,
    },
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
        justifyContent: 'flex-end',
    },
    modalContent: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        alignSelf: 'center',
        maxHeight: '80%',
    },
    alertDetailsModalContent: {
        position: "absolute",
        alignSelf: 'center',
        top: '25%',
        width: '80%',
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    alertDetailImage: {
        width: '100%',
        height: 200,
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 10,
        textAlign: 'center',
    },
    boldText: {
        fontWeight: "bold",
    },
    phoneNumber: {
        color: "blue",
        textDecorationLine: "underline",
        fontSize: 16,
    },
    modalButton: {
        backgroundColor: "#ccc",
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: "center",
    },
    modalButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    iconGrid: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    iconWithLabel: {
        alignItems: "center",
        marginHorizontal: 10,
        marginVertical: 10,
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ddd',
        padding: 5,
    },
    iconLabel: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    removeAlertButton: {
        backgroundColor: '#dc3545',
        marginTop: 5,
        marginBottom: 10,
    },
});

export default MapComponent;