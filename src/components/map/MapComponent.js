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

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62"; // Sua chave API

const useUserLocation = () => {
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const currentLocation = await Location.getCurrentPositionAsync({});
                setLocation(currentLocation);
                console.log("Localização do utilizador obtida:", currentLocation.coords);
            } else {
                Alert.alert("Permissão de Localização Negada", "Por favor, conceda permissão de localização para usar o mapa.");
                console.warn("Permissão de localização negada.");
            }
        })();
    }, []);
    return location;
};

const usePointsOfInterest = (latitude, longitude) => {
    const [poi, setPoi] = useState([]);
    useEffect(() => {
        if (latitude && longitude) {
            console.log("Fetching POIs for Lat:", latitude, "Lon:", longitude);
            const fetchPOI = async () => {
                try {
                    const response = await axios.get(
                        `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${longitude},${latitude},10000&limit=200&apiKey=${GEOAPIFY_API_KEY}`
                    );
                    setPoi(
                        response.data.features.map((poiItem) => ({ // Renomeado 'poi' para 'poiItem' para evitar conflito
                            id: poiItem.properties.place_id,
                            name: poiItem.properties.name || "Ponto de Interesse",
                            latitude: poiItem.geometry.coordinates[1], // Geoapify Places API: [lon, lat]
                            longitude: poiItem.geometry.coordinates[0], // Geoapify Places API: [lon, lat]
                            address: {
                                street: poiItem.properties.street || poiItem.properties.address_line1 || "",
                                city: poiItem.properties.city || "",
                                formatted: poiItem.properties.formatted || "",
                                address_line2: poiItem.properties.address_line2 || "",
                            },
                        }))
                    );
                    console.log("POIs carregados:", response.data.features.length);
                } catch (error) {
                    console.error("Erro ao buscar POIs:", error.message);
                    if (error.response) {
                        console.error("Detalhes do erro da API (POIs):", error.response.data);
                    }
                    Alert.alert("Erro POI", "Não foi possível carregar pontos de interesse. Verifique a chave API ou conexão.");
                }
            };
            fetchPOI();
        } else {
            console.log("Latitude ou Longitude são nulas/indefinidas para POIs. Lat:", latitude, "Lon:", longitude);
        }
    }, [latitude, longitude]);
    return poi;
};

// Nova função para geocodificação reversa e obtenção de uma coordenada roteável
const reverseGeocodeAndGetRoutableCoordinate = async (lon, lat) => {
    console.log("Geocodificando reversamente para ponto roteável: Lon:", lon, "Lat:", lat);
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
            console.log("Ponto roteável encontrado:", routableCoord);
            return routableCoord;
        }
        console.log("Não encontrou uma coordenada roteável para Lon:", lon, "Lat:", lat, "Resposta:", response.data);
        return null; // Não encontrou uma coordenada roteável
    } catch (error) {
        console.error("Erro ao geocodificar reversamente para ponto roteável:", error.message);
        if (error.response) {
            console.error("Detalhes do erro da API (Geocode Reversa):", error.response.data);
        }
        return null;
    }
};

// Use forwardRef para permitir que o componente pai acesse os métodos internos do MapView
const MapComponent = React.forwardRef(({ locations, t, selectedPoiForMapClick }, ref) => { // Adicionado 'ref'
    const mapRef = ref || useRef(null); // Usar o ref passado ou criar um interno
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

    const fetchRoute = async (destinationLon, destinationLat) => {
        if (!location) {
            Alert.alert("Erro", "Localização atual indisponível.");
            console.log("Localização do utilizador é nula, não é possível buscar rota.");
            setRouteCoordinates([]);
            return;
        }

        console.log("Iniciando busca de rota...");
        console.log("Localização do utilizador (original): Lat:", location.coords.latitude, "Lon:", location.coords.longitude);
        console.log("Destino (original): Lat:", destinationLat, "Lon:", destinationLon);

        // --- NOVA LÓGICA: Obter coordenadas roteáveis via geocodificação reversa ---
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

        // Usar as coordenadas roteáveis obtidas
        const origin = `${routableOrigin.latitude.toFixed(6)},${routableOrigin.longitude.toFixed(6)}`;
        const destination = `${routableDestination.latitude.toFixed(6)},${routableDestination.longitude.toFixed(6)}`;

        console.log("Valor de 'origin' (roteável e arredondado para API):", origin);
        console.log("Valor de 'destination' (roteável e arredondado para API):", destination);

        const requestUrl = `https://api.geoapify.com/v1/routing?waypoints=${origin}|${destination}&mode=walk&apiKey=${GEOAPIFY_API_KEY}`;
        console.log("URL de Requisição da Rota:", requestUrl);

        try {
            const response = await axios.get(requestUrl);

            if (response.data.features && response.data.features.length > 0) {
                const route = response.data.features[0].geometry.coordinates;
                // A API de rotas da Geoapify retorna [lon, lat] para cada ponto da polyline
                const formattedRoute = route[0].map((coord) => ({
                    latitude: coord[1], // Mapeia lon para latitude
                    longitude: coord[0], // Mapeia lat para longitude
                }));
                setRouteCoordinates(formattedRoute);
                console.log("Rota encontrada com", formattedRoute.length, "pontos.");
                // O fitToCoordinates pode ser útil se você quiser mostrar a rota inteira,
                // mas para "zoom no POI", vamos depender do useEffect abaixo.
                // if (mapRef.current) {
                //     mapRef.current.fitToCoordinates(formattedRoute, {
                //         edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                //         animated: true,
                //     });
                // }
            } else {
                Alert.alert("Rota não encontrada", "Não foi possível encontrar uma rota para o destino.");
                setRouteCoordinates([]);
                console.warn("Nenhuma rota encontrada na resposta da API:", response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar rota:", error.message);
            if (error.response && error.response.data && error.response.data.message) {
                Alert.alert("Erro Rota", `Erro da API: ${error.response.data.message}`);
                console.error("Detalhes do erro da API:", error.response.data);
            } else {
                Alert.alert("Erro Rota", "Não foi possível buscar a rota. Verifique sua chave API, conexão ou coordenadas.");
            }
            setRouteCoordinates([]);
        }
    };

    // useEffect para lidar com o POI selecionado da Home e dar zoom
    useEffect(() => {
        if (selectedPoiForMapClick) {
            console.log("MapComponent recebeu POI para clique automático:", selectedPoiForMapClick.name);
            // Simular o comportamento de um clique no marcador
            setSelectedLocation(selectedPoiForMapClick);
            fetchRoute(selectedPoiForMapClick.coordinates.longitude, selectedPoiForMapClick.coordinates.latitude);

            // Animar o mapa para o POI selecionado com zoom
            if (mapRef.current) {
                mapRef.current.animateToRegion({
                    latitude: selectedPoiForMapClick.coordinates.latitude,
                    longitude: selectedPoiForMapClick.coordinates.longitude,
                    latitudeDelta: 0.005, // Ajuste este valor para controlar o nível de zoom (menor = mais zoom)
                    longitudeDelta: 0.005, // Ajuste este valor para controlar o nível de zoom
                }, 1000); // Duração da animação em milissegundos
            }
        }
    }, [selectedPoiForMapClick]); // Dependência: executa quando selectedPoiForMapClick muda

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
                        setRouteCoordinates([]); // Limpa a rota ao clicar no mapa
                        setSelectedLocation(null); // Limpa o POI selecionado
                        console.log("Mapa clicado em:", e.nativeEvent.coordinate.latitude, e.nativeEvent.coordinate.longitude);
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
                            onPress={() => {
                                setSelectedLocation(poi);
                                console.log("POI selecionado:", poi.name, "Lat:", poi.latitude, "Lon:", poi.longitude);
                                // Passar LONGITUDE primeiro, depois LATITUDE para fetchRoute
                                fetchRoute(poi.longitude, poi.latitude);
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
                                console.log("Localização selecionada:", loc.name, "Lat:", loc.coordinates.latitude, "Lon:", loc.coordinates.longitude);
                                // Passar LONGITUDE primeiro, depois LATITUDE para fetchRoute
                                fetchRoute(parseFloat(loc.coordinates.longitude), parseFloat(loc.coordinates.latitude));
                            }}
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

                    {/* Render the route Polyline */}
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
}); // Fechamento do forwardRef

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