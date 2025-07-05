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
import { useSelector } from "react-redux";
import haversine from 'haversine-distance';

import { FIREBASE_DB, FIREBASE_STORAGE } from '../../services/firebase/firebaseConfig';
import { collection, addDoc, doc, runTransaction, onSnapshot } from 'firebase/firestore';
import { ref as storageRefCreator, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


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

const usePointsOfInterest = (latitude, longitude, activeFilters) => {
    const [poi, setPoi] = useState([]);
    useEffect(() => {
        if (latitude && longitude) {
            const fetchPOI = async () => {
                try {
                    // CATEGORIAS FILTRADAS: Apenas turismo, acomodação (hotéis), lazer e entretenimento
                    const categories = "tourism,accommodation,leisure,entertainment";
                    const response = await axios.get(
                        `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${longitude},${latitude},10000&limit=200&apiKey=${GEOAPIFY_API_KEY}`
                    );
                    const fetchedPoi = response.data.features.map((poiItem) => ({
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
                        category: poiItem.properties.categories ? poiItem.properties.categories[0] : 'tourism',
                    }));

                    if (activeFilters && activeFilters.length > 0) {
                        setPoi(fetchedPoi.filter(item => activeFilters.includes(item.category)));
                    } else {
                        setPoi(fetchedPoi);
                    }

                } catch (error) {
                    console.error("Erro detalhado ao carregar POIs:", error.response?.data || error.message);
                    Alert.alert("Erro POI", "Não foi possível carregar pontos de interesse. Verifique a chave API ou conexão.");
                }
            };
            fetchPOI();
        }
    }, [latitude, longitude, activeFilters]);
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

const MapComponent = React.forwardRef(({ locations, t, selectedPoiForMapClick, onApplyFilters, clearRouteTrigger, onClearRouteDone }, ref) => {
    const mapRef = ref || useRef(null);
    const location = useUserLocation();

    const [activePoiFilters, setActivePoiFilters] = useState([]);
    const pointsOfInterest = usePointsOfInterest(
        location?.coords.latitude,
        location?.coords.longitude,
        activePoiFilters
    );

    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showSOSModal, setShowSOSModal] = useState(false);
    const [showAddChoiceModal, setShowAddChoiceModal] = useState(false);
    const [clickedCoordinate, setClickedCoordinate] = useState(null);
    const [customMarkers, setCustomMarkers] = useState([]);

    const [showAlertDetailsModal, setShowAlertDetailsModal] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState(null);

    const [showProximityAlertModal, setShowProximityAlertModal] = useState(false);
    const [proximityAlertsCount, setProximityAlertsCount] = useState(0);
    const [shownProximityAlerts, setShownProximityAlerts] = useState({});

    // State para gerenciar se os alertas de proximidade devem ser suprimidos após adicionar um
    const [suppressProximityAlert, setSuppressProximityAlert] = useState(false);
    // State para rastrear se o modal de alerta de proximidade já foi mostrado nesta sessão
    const [hasProximityAlertBeenShown, setHasProximityAlertBeenShown] = useState(false);


    const [routeCoordinates, setRouteCoordinates] = useState([]);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const authUser = useSelector((state) => state.auth.user);
    const currentUserName = authUser?.name || "Utilizador Anónimo";
    const currentUserId = authUser?.uid;

    useEffect(() => {
        console.log("Estado de Autenticação:", {
            isAuthenticated,
            currentUserId,
            authUser
        });
    }, [isAuthenticated, currentUserId, authUser]);

    useEffect(() => {
        const alertsCollectionRef = collection(FIREBASE_DB, 'alerts');
        const unsubscribe = onSnapshot(alertsCollectionRef, (snapshot) => {
            const fetchedAlerts = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                confirmedBy: doc.data().confirmedBy || [],
                rejectedBy: doc.data().rejectedBy || [],
            }));
            setCustomMarkers(fetchedAlerts);
        }, (error) => {
            console.error("Erro ao carregar alertas do Firestore:", error);
            Alert.alert("Erro", "Não foi possível carregar os alertas do mapa.");
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (selectedAlert && customMarkers.length > 0) {
            const updatedSelectedAlert = customMarkers.find(
                (marker) => marker.id === selectedAlert.id
            );
            if (updatedSelectedAlert) {
                setSelectedAlert(updatedSelectedAlert);
            }
        }
    }, [customMarkers, selectedAlert]);

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
        // Redefine o estado do modal de proximidade ao iniciar uma nova ação de alerta
        setShowProximityAlertModal(false);
        setProximityAlertsCount(0);
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
            const imageUri = result.assets[0].uri;
            const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
            const storageRef = storageRefCreator(FIREBASE_STORAGE, `alert_images/${filename}`);

            try {
                const response = await fetch(imageUri);
                const blob = await response.blob();
                await uploadBytes(storageRef, blob);
                const downloadURL = await getDownloadURL(storageRef);

                const newAlertData = {
                    latitude: clickedCoordinate.latitude,
                    longitude: clickedCoordinate.longitude,
                    type,
                    imageUri: downloadURL,
                    icon: type === "Obras" ? "construcao" : "corte",
                    publishedBy: currentUserName,
                    publishedAt: new Date().toISOString(),
                    userId: currentUserId,
                    confirmedBy: [],
                    rejectedBy: [],
                };

                await addDoc(collection(FIREBASE_DB, 'alerts'), newAlertData);

                Alert.alert(
                    `${type} registado com foto!`,
                    `Latitude: ${clickedCoordinate.latitude.toFixed(5)}\nLongitude: ${clickedCoordinate.longitude.toFixed(5)}`
                );

                // Suprime temporariamente os alertas de proximidade após adicionar um novo
                setSuppressProximityAlert(true);
                // Redefine a supressão após um breve atraso
                setTimeout(() => {
                    setSuppressProximityAlert(false);
                }, 3000); // Suprime por 3 segundos

            } catch (error) {
                console.error("Erro ao adicionar alerta ou fazer upload da imagem:", error);
                Alert.alert("Erro", "Não foi possível registar o alerta. Tente novamente.");
            }
        }
    };

    const handleVote = async (alertId, voteType) => {
        if (!isAuthenticated || !currentUserId) {
            Alert.alert("Ação não permitida", "Para votar, você precisa estar logado na sua conta.");
            return;
        }

        const alertDocRef = doc(FIREBASE_DB, 'alerts', alertId);

        try {
            const imageUriToDelete = await runTransaction(FIREBASE_DB, async (transaction) => {
                const docSnapshot = await transaction.get(alertDocRef);
                if (!docSnapshot.exists()) {
                    throw "Documento não existe!";
                }

                const data = docSnapshot.data();
                let confirmedBy = data.confirmedBy || [];
                let rejectedBy = data.rejectedBy || [];

                const isConfirmed = confirmedBy.includes(currentUserId);
                const isRejected = rejectedBy.includes(currentUserId);

                if (voteType === 'confirm') {
                    if (isConfirmed) {
                        confirmedBy = confirmedBy.filter(id => id !== currentUserId);
                    } else {
                        confirmedBy.push(currentUserId);
                        if (isRejected) {
                            rejectedBy = rejectedBy.filter(id => id !== currentUserId);
                        }
                    }
                } else {
                    if (isRejected) {
                        rejectedBy = rejectedBy.filter(id => id !== currentUserId);
                    } else {
                        rejectedBy.push(currentUserId);
                        if (isConfirmed) {
                            confirmedBy = confirmedBy.filter(id => id !== currentUserId);
                        }
                    }
                }

                if (rejectedBy.length > confirmedBy.length) {
                    transaction.delete(alertDocRef);
                    return data.imageUri;
                } else {
                    transaction.update(alertDocRef, { confirmedBy, rejectedBy });
                    return null;
                }
            });

            if (imageUriToDelete) {
                setShowAlertDetailsModal(false);

                try {
                    const imageRef = storageRefCreator(FIREBASE_STORAGE, imageUriToDelete);
                    await deleteObject(imageRef);
                } catch (storageError) {
                    console.warn("Não foi possível apagar a imagem do alerta do Storage:", storageError);
                }
            }

        } catch (error) {
            console.error("Erro ao votar ou eliminar o alerta:", error);
            Alert.alert("Erro", "Não foi possível registrar seu voto ou processar a ação.");
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
                    longitude: selectedPoiForMapClick.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }, 1000);
            }
        }
    }, [selectedPoiForMapClick]);

    useEffect(() => {
        if (clearRouteTrigger) {
            setRouteCoordinates([]);
            if (onClearRouteDone) {
                onClearRouteDone();
            }
        }
    }, [clearRouteTrigger, onClearRouteDone]);


    useEffect(() => {
        // Apenas executa a verificação de proximidade se não estiver suprimindo E ainda não foi mostrado
        if (location && customMarkers.length > 0 && !suppressProximityAlert) {
            checkProximityToAlerts(location.coords);
        }
    }, [location, customMarkers, suppressProximityAlert]);

    const checkProximityToAlerts = (userCoords) => {
        const proximityRadius = 50;
        let count = 0;
        const newShownProximityAlerts = { ...shownProximityAlerts };

        customMarkers.forEach((marker) => {
            const markerCoords = { latitude: marker.latitude, longitude: marker.longitude };
            const distance = haversine(userCoords, markerCoords);

            if (distance <= proximityRadius) {
                count++;
                if (!newShownProximityAlerts[marker.id]) {
                    newShownProximityAlerts[marker.id] = true;
                }
            } else if (distance > proximityRadius * 2 && newShownProximityAlerts[marker.id]) {
                delete newShownProximityAlerts[marker.id];
            }
        });

        setProximityAlertsCount(count);
        setShownProximityAlerts(newShownProximityAlerts);

        // Apenas mostra o modal se alertas forem detectados, não estiver atualmente suprimido E ainda não foi mostrado
        if (count > 0 && !showProximityAlertModal && !suppressProximityAlert && !hasProximityAlertBeenShown) {
            setShowProximityAlertModal(true);
            setHasProximityAlertBeenShown(true); // Marca como mostrado para esta sessão
        } else if (count === 0 && showProximityAlertModal) {
            setShowProximityAlertModal(false);
        }
    };


    useEffect(() => {
        if (onApplyFilters) {
            onApplyFilters.current = (filters) => {
                setActivePoiFilters(filters);
            };
        }
    }, [onApplyFilters]);


    const confirmedCount = selectedAlert ? (selectedAlert.confirmedBy?.length || 0) : 0;
    const rejectedCount = selectedAlert ? (selectedAlert.rejectedBy?.length || 0) : 0;


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
                                // Garante que o modal de proximidade e a contagem sejam redefinidos ao selecionar um POI
                                setShowProximityAlertModal(false);
                                setProximityAlertsCount(0);
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
                                // Garante que o modal de proximidade e a contagem sejam redefinidos ao selecionar um local
                                setShowProximityAlertModal(false);
                                setProximityAlertsCount(0);
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
                                // Garante que o modal de proximidade e a contagem sejam redefinidos ao selecionar um marcador de alerta
                                setShowProximityAlertModal(false);
                                setProximityAlertsCount(0);
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

                        {isAuthenticated && (
                            <View style={styles.voteButtonsContainer}>
                                <TouchableOpacity
                                    style={[styles.voteButton, styles.confirmButton]}
                                    onPress={() => handleVote(selectedAlert.id, 'confirm')}
                                >
                                    <Text style={styles.voteButtonText}>✔ {confirmedCount}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.voteButton, styles.rejectButton]}
                                    onPress={() => handleVote(selectedAlert.id, 'reject')}
                                >
                                    <Text style={styles.voteButtonText}>✖ {rejectedCount}</Text>
                                </TouchableOpacity>
                            </View>
                        )}

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
                {proximityAlertsCount > 0 && (
                    <View style={styles.alertDetailsModalContent}>
                        <Text style={styles.modalTitle}>Aviso de Proximidade!</Text>
                        <Text style={styles.modalText}>
                            Você está perto de {proximityAlertsCount} alerta{proximityAlertsCount > 1 ? "s" : ""}.
                        </Text>
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
        top: '10%', // Começa mais acima
        width: '90%', // Aumenta a largura para 90% da tela
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        maxHeight: '80%', // Limita a altura máxima para 80% da tela
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
        textAlign: 'center',
        lineHeight: 22,
    },
    boldText: {
        fontWeight: 'bold',
    },
    phoneNumber: {
        color: '#007bff',
    },
    iconGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 10,
    },
    iconWithLabel: {
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 10,
    },
    icon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 5,
    },
    iconLabel: {
        fontSize: 12,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    alertDetailImage: {
        width: '100%', // Mantém a largura 100% do modal
        height: 250, // Aumenta a altura da imagem para 250
        marginBottom: 15,
        borderRadius: 8,
    },
    voteButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 15,
    },
    voteButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    confirmButton: {
        backgroundColor: '#28a745',
    },
    rejectButton: {
        backgroundColor: '#dc3545',
    },
    voteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default MapComponent;