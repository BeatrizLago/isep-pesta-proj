import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  KeyboardAvoidingView,
  Text,
  ScrollView,
  Platform,
  Linking,
  TouchableOpacity,
  Alert,
  Keyboard,
  Dimensions,
} from "react-native";
import { SearchBar, Overlay, Button, Icon } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import { clearDirections, fetchDirections } from "../../state/actions/directionsAction";
import MapComponent from "../../components/map/MapComponent";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import MyFilter from "../../components/myfilter/MyFilter";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "./Home.styles";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

const useLocations = () => {
  const dispatch = useDispatch();
  const locations = useSelector((state) => state.location.locations);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchLocations());
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    };

    if (locations.length === 0) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [dispatch, locations.length]);

  useEffect(() => {
    if (locations.length > 0) {
      setFilteredData(locations);
    }
  }, [locations]);

  const toggleFilter = useCallback(() => setShowFilter((prev) => !prev), []);
  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilteredData(locations);
  }, [locations]);

  return { locations, filteredData, setFilteredData, loading, toggleFilter, clearFilters, showFilter, setShowFilter, selectedFilters, setSelectedFilters };
};

const useDirections = (startLocation, endLocation, preference, isStraight, profile) => {
  const dispatch = useDispatch();
  const directions = useSelector((state) => state.direction.directions);

  const handleDirections = useCallback(() => {
    if (startLocation && endLocation) {
      const coordinates = [startLocation, endLocation];
      const fetchAndLogDirections = async () => {
        const language = await AsyncStorage.getItem("LANGUAGE");
        const body = { coordinates, preference, continue_straight: isStraight, language };
        await dispatch(fetchDirections(body, profile));
      };
      fetchAndLogDirections();
    }
  }, [startLocation, endLocation, dispatch, preference, isStraight, profile]);

  const handleClearDirections = useCallback(async () => {
    await dispatch(clearDirections());
  }, [dispatch]);

  return { directions, handleDirections, handleClearDirections };
};

const Home = ({ t }) => {
  const { locations, filteredData, setFilteredData, loading, toggleFilter, clearFilters, showFilter, selectedFilters, setSelectedFilters } = useLocations();
  const user = useSelector((state) => state.user.userInfo);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [profile, setProfile] = useState("driving-car");
  const [preference, setPreference] = useState("recommended");
  const [isStraight, setIsStraight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPOIList, setShowPOIList] = useState(false);
  // pointsOfInterest agora será a lista de POIs que o MapComponent pode exibir
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const { directions, handleDirections, handleClearDirections } = useDirections(startLocation, endLocation, preference, isStraight, profile);
  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  const mapComponentRef = useRef(null);

  const [selectedPoiForMapClick, setSelectedPoiForMapClick] = useState(null);
  const [clearRouteTrigger, setClearRouteTrigger] = useState(false);

  // Calcula a altura da janela uma vez
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        setStartLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert("Permissão de Localização Negada", "Por favor, conceda permissão de localização para usar a busca.");
      }
    })();
  }, []);

  // Nova função para buscar e setar os POIs no Home component
  // Esta função deve espelhar as categorias buscadas no MapComponent
  const fetchPointsOfInterestForSearch = async () => {
    if (!userLocation) {
      // Pode ser um erro ou apenas esperar a localização
      return;
    }
    // As mesmas categorias usadas no MapComponent
    const categories = "tourism,accommodation,leisure,entertainment";
    const url = `https://api.geoapify.com/v2/places?categories=${categories}&filter=circle:${userLocation.longitude},${userLocation.latitude},100000&limit=200&apiKey=${GEOAPIFY_API_KEY}`; // Aumentei o limite para mais POIs
    try {
      const response = await axios.get(url);
      const pois = response.data.features.map((poi) => ({
        id: poi.properties.place_id.toString(),
        name: poi.properties.name || "Ponto de Interesse",
        coordinates: {
          latitude: poi.geometry.coordinates[1],
          longitude: poi.geometry.coordinates[0],
        },
        address: {
          street: poi.properties.street || "Desconhecido",
          city: poi.properties.city || "Desconhecido",
        },
        category: poi.properties.categories ? poi.properties.categories[0] : "tourism", // Usar a primeira categoria se disponível
      }));
      setPointsOfInterest(pois);
    } catch (error) {
      console.error("Erro ao buscar POIs para pesquisa:", error);
      setPointsOfInterest([]);
    }
  };

  useEffect(() => {
    // Carrega os POIs uma vez que a localização do usuário esteja disponível
    if (userLocation) {
      fetchPointsOfInterestForSearch();
    }
  }, [userLocation]);


  const handleGetPOIs = () => {
    // Já que pointsOfInterest será preenchido pelo useEffect,
    // apenas mostra a lista se já tiver dados.
    if (pointsOfInterest.length > 0) {
      setShowPOIList(true);
    } else {
      Alert.alert("Nenhum POI encontrado", "Tente novamente mais tarde ou ajuste sua localização.");
    }
  };

  const handleSelectPOI = useCallback((poi) => {
    setShowPOIList(false);
    setEndLocation({
      latitude: poi.coordinates.latitude,
      longitude: poi.coordinates.longitude,
    });

    setSelectedPoiForMapClick(poi);
    setClearRouteTrigger(false);

    if (mapComponentRef.current && poi.coordinates) {
      mapComponentRef.current.animateToRegion({
        latitude: poi.coordinates.latitude,
        longitude: poi.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 2) {
      // Filtrar a lista de pointsOfInterest já carregada
      const filtered = pointsOfInterest.filter(poi =>
          poi.name.toLowerCase().includes(text.toLowerCase()) ||
          poi.address.street.toLowerCase().includes(text.toLowerCase()) ||
          poi.address.city.toLowerCase().includes(text.toLowerCase()) ||
          poi.address.formatted?.toLowerCase().includes(text.toLowerCase()) // Caso tenha formatted address
      );
      setSearchResults(filtered);
      setShowSearchSuggestions(filtered.length > 0);
    } else {
      setSearchResults([]);
      setShowSearchSuggestions(false);
    }
  };


  const handleSelectSearchSuggestion = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSearchSuggestions(false);
    Keyboard.dismiss();

    setEndLocation({
      latitude: suggestion.coordinates.latitude,
      longitude: suggestion.coordinates.longitude,
    });

    setSelectedPoiForMapClick(suggestion);
    setClearRouteTrigger(false);


    if (mapComponentRef.current && suggestion.coordinates) {
      mapComponentRef.current.animateToRegion({
        latitude: suggestion.coordinates.latitude,
        longitude: suggestion.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  useEffect(() => {
    if (startLocation && endLocation) {
      handleDirections();
    }
  }, [startLocation, endLocation, handleDirections]);

  const handleRouteCleared = useCallback(() => {
    setClearRouteTrigger(false);
  }, []);


  if (loading) return <ActivityLoader />;

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }}>
            <MyFilterButtons toggleFilter={toggleFilter} clearFilters={clearFilters} showFilter={showFilter} t={t} />
            <MyFilter showFilter={showFilter} data={locations} selectedFilters={selectedFilters} setFilteredData={setFilteredData} onFilterChange={setSelectedFilters} user={user} t={t} />

            {!showFilter && (
                <>
                  <View style={Styles.searchBarWrapper}>
                    <SearchBar
                        placeholder={t("components.searchBar.text")}
                        onChangeText={handleSearch}
                        value={searchQuery}
                        round
                        lightTheme
                        platform="android"
                        containerStyle={Styles.searchBarContainer}
                        inputContainerStyle={Styles.searchBarInputContainer}
                        onFocus={() => {
                          if (searchQuery.length > 2 && searchResults.length > 0) {
                            setShowSearchSuggestions(true);
                          }
                        }}
                    />
                    {showSearchSuggestions && searchResults.length > 0 && (
                        <ScrollView
                            style={[
                              Styles.suggestionsList,
                              { maxHeight: windowHeight * 0.4 }
                            ]}
                            keyboardShouldPersistTaps="always"
                        >
                          {searchResults.map((item, index) => (
                              <TouchableOpacity
                                  key={`${item.id}-${index}`}
                                  style={Styles.suggestionItem}
                                  onPress={() => handleSelectSearchSuggestion(item)}
                              >
                                <Text style={Styles.suggestionText}>{item.name}</Text>
                              </TouchableOpacity>
                          ))}
                        </ScrollView>
                    )}
                  </View>

                  <View style={Styles.buttonContainer}>
                    <Button
                        title={t("screens.map.clearDirections")}
                        onPress={() => {
                          handleClearDirections();
                          setEndLocation(null);
                          setSelectedPoiForMapClick(null);
                          setClearRouteTrigger(true);
                        }}
                        buttonStyle={Styles.button}
                        titleStyle={Styles.buttonText}
                        icon={<Icon name="clear" size={20} color="white" style={Styles.icon} />}
                    />
                  </View>
                </>
            )}

            <View style={Styles.mapContainerScreen}>
              <Overlay
                  isVisible={showPOIList}
                  onBackdropPress={() => setShowPOIList(false)}
                  overlayStyle={{ width: "80%", maxHeight: "70%" }}
              >
                <ScrollView style={{ maxHeight: Dimensions.get('window').height * 1 }}>
                  <View style={{ padding: 20 }}>
                    {pointsOfInterest.length > 0 ? (
                        pointsOfInterest.map((poi, index) => (
                            <Button
                                key={`${poi.id}-${index}`}
                                title={poi.name}
                                onPress={() => handleSelectPOI(poi)}
                                buttonStyle={{
                                  marginVertical: 10,
                                  paddingVertical: 20,
                                  paddingHorizontal: 15,
                                  backgroundColor: '#007bff',
                                  minHeight: 60,
                                  borderRadius: 8,
                                }}
                                titleStyle={{
                                  fontSize: 16,
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                            />
                        ))
                    ) : (
                        <Text style={{ textAlign: "center", padding: 20 }}>
                          {t("screens.list.notFound") || "Nenhum ponto turístico encontrado"}
                        </Text>
                    )}
                  </View>
                </ScrollView>
              </Overlay>
              <View style={{ flex: 1 }}>
                <MapComponent
                    ref={mapComponentRef}
                    directions={directions}
                    portugalCenter={portugalCenter}
                    locations={filteredData}
                    pointsOfInterest={pointsOfInterest} // Passando pointsOfInterest para o MapComponent
                    userLocation={userLocation}
                    selectedPoiForMapClick={selectedPoiForMapClick}
                    clearRouteTrigger={clearRouteTrigger}
                    onClearRouteDone={handleRouteCleared}
                    t={t}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  );
};

export default Home;