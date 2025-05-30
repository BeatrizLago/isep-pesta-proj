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
import MapComponent from "../../components/map/MapComponent"; // Caminho ajustado
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import MyFilter from "../../components/myfilter/MyFilter";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { Styles } from "./Home.styles";
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62"; // Your Geoapify API Key

// Helper hook for location data and filtering
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

// Helper hook for handling directions
const useDirections = (startLocation, endLocation, preference, isStraight, profile) => {
  const dispatch = useDispatch();
  const directions = useSelector((state) => state.direction.directions); // Added directions state

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

  const handleClearDirections = useCallback(async () => { // Made useCallback
    await dispatch(clearDirections());
  }, [dispatch]);

  return { directions, handleDirections, handleClearDirections }; // Return directions
};

const Home = ({ t }) => {
  const { locations, filteredData, setFilteredData, loading, toggleFilter, clearFilters, showFilter, selectedFilters, setSelectedFilters } = useLocations();
  const user = useSelector((state) => state.user.userInfo);
  const [startLocation, setStartLocation] = useState(null); // User's current location for directions
  const [endLocation, setEndLocation] = useState(null); // Destination for directions (selected POI or search result)
  const [profile, setProfile] = useState("driving-car");
  const [preference, setPreference] = useState("recommended");
  const [isStraight, setIsStraight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPOIList, setShowPOIList] = useState(false);
  const [pointsOfInterest, setPointsOfInterest] = useState([]); // POIs fetched from Geoapify
  const [userLocation, setUserLocation] = useState(null); // User's actual GPS location
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const { directions, handleDirections, handleClearDirections } = useDirections(startLocation, endLocation, preference, isStraight, profile);
  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  // Ref para o MapComponent
  const mapComponentRef = useRef(null);

  // Novo estado para controlar o POI a ser "clicado" no mapa
  const [selectedPoiForMapClick, setSelectedPoiForMapClick] = useState(null);


  // Request location permission and get user's current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
        // Set user's current location as startLocation for directions
        setStartLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } else {
        Alert.alert("Permissão de Localização Negada", "Por favor, conceda permissão de localização para usar a busca.");
      }
    })();
  }, []);

  // Fetch Points of Interest (POIs) near the user's location
  const fetchPointsOfInterest = async () => {
    if (!userLocation) {
      Alert.alert("Localização Indisponível", "Não foi possível obter a sua localização atual para buscar POIs.");
      return;
    }
    const url = `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${userLocation.longitude},${userLocation.latitude},100000&limit=100&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await axios.get(url);
      const pois = response.data.features.map((poi) => ({
        id: poi.properties.place_id.toString(),
        name: poi.properties.name || "Ponto Turístico",
        coordinates: {
          latitude: poi.geometry.coordinates[1],
          longitude: poi.geometry.coordinates[0],
        },
        address: {
          street: poi.properties.street || "Desconhecido",
          city: poi.properties.city || "Desconhecido",
        },
        category: poi.properties.categories || "Turismo",
      }));
      setPointsOfInterest(pois);
    } catch (error) {
      console.error("Erro ao buscar POIs:", error);
      setPointsOfInterest([]);
      Alert.alert("Erro ao Buscar POIs", "Não foi possível carregar os pontos de interesse.");
    }
  };

  // Handle getting POIs and showing the list
  const handleGetPOIs = () => {
    fetchPointsOfInterest();
    setShowPOIList(true);
  };

  // Handle selecting a POI from the list to get directions and center map
  const handleSelectPOI = useCallback((poi) => {
    setShowPOIList(false);
    setEndLocation({
      latitude: poi.coordinates.latitude,
      longitude: poi.coordinates.longitude,
    });

    // Define o POI para ser "clicado" no mapa
    setSelectedPoiForMapClick(poi);

    // Zoom para o POI selecionado
    if (mapComponentRef.current && poi.coordinates) {
      mapComponentRef.current.animateToRegion({
        latitude: poi.coordinates.latitude,
        longitude: poi.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, []);

  // Handle search input and fetch autocomplete suggestions
  const handleSearch = async (text) => {
    setSearchQuery(text);
    if (text.length > 2 && userLocation) {
      try {
        const response = await axios.get(
            `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&filter=circle:${userLocation.longitude},${userLocation.latitude},50000&limit=10&apiKey=${GEOAPIFY_API_KEY}`
        );
        if (response.data.features) {
          setSearchResults(
              response.data.features.map((feature) => ({
                id: feature.properties.place_id,
                name: feature.properties.name || feature.properties.address_line1 || feature.properties.formatted,
                coordinates: {
                  latitude: feature.geometry.coordinates[1],
                  longitude: feature.geometry.coordinates[0],
                },
              }))
          );
          setShowSearchSuggestions(true);
        } else {
          setSearchResults([]);
          setShowSearchSuggestions(false);
        }
      } catch (error) {
        console.error("Erro ao buscar sugestões de pesquisa:", error.message);
        setSearchResults([]);
        setShowSearchSuggestions(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchSuggestions(false);
    }
  };

  // Handle selecting a search suggestion
  const handleSelectSearchSuggestion = (suggestion) => {
    setSearchQuery(suggestion.name);
    setShowSearchSuggestions(false);
    Keyboard.dismiss();

    setEndLocation({
      latitude: suggestion.coordinates.latitude,
      longitude: suggestion.coordinates.longitude,
    });

    // Define o POI para ser "clicado" no mapa
    setSelectedPoiForMapClick(suggestion);


    if (mapComponentRef.current && suggestion.coordinates) {
      mapComponentRef.current.animateToRegion({
        latitude: suggestion.coordinates.latitude,
        longitude: suggestion.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  // Effect to trigger directions when endLocation or startLocation changes
  useEffect(() => {
    if (startLocation && endLocation) {
      handleDirections();
    }
  }, [startLocation, endLocation, handleDirections]);


  if (loading) return <ActivityLoader />;

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={{ flex: 1 }}>
            <MyFilterButtons toggleFilter={toggleFilter} clearFilters={clearFilters} showFilter={showFilter} t={t} />
            <MyFilter showFilter={showFilter} data={locations} selectedFilters={selectedFilters} setFilteredData={setFilteredData} onFilterChange={setSelectedFilters} user={user} t={t} />
            <View style={Styles.mapContainerScreen}>
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
                        style={Styles.suggestionsList}
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
                    title={t("screens.map.getDirections")}
                    onPress={handleDirections} // This will now use startLocation and endLocation
                    buttonStyle={Styles.button}
                    titleStyle={Styles.buttonText}
                    icon={<Icon name="directions" size={20} color="white" style={Styles.icon} />}
                />
                <Button
                    title={t("screens.map.clearDirections")}
                    onPress={() => {
                      handleClearDirections();
                      setEndLocation(null); // Clear end location to reset map view
                      setSelectedPoiForMapClick(null); // Clear the selected POI for map click
                    }}
                    buttonStyle={Styles.button}
                    titleStyle={Styles.buttonText}
                    icon={<Icon name="clear" size={20} color="white" style={Styles.icon} />}
                />
                <Button
                    title="Ver Pontos de Interesse"
                    onPress={handleGetPOIs}
                    buttonStyle={Styles.button}
                    titleStyle={Styles.buttonText}
                    icon={<Icon name="place" size={20} color="white" style={Styles.icon} />}
                />
              </View>

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
                    ref={mapComponentRef} // Pass the ref to MapComponent
                    directions={directions} // Pass directions from state
                    portugalCenter={portugalCenter}
                    locations={filteredData} // Pass your existing locations/filteredData
                    pointsOfInterest={pointsOfInterest} // Pass pointsOfInterest
                    userLocation={userLocation} // Pass userLocation
                    selectedPoiForMapClick={selectedPoiForMapClick} // Pass the selected POI for auto-click
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