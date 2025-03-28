import React, { useState, useEffect, useCallback } from "react";
import { View, KeyboardAvoidingView, Text, ScrollView, Platform } from "react-native";
import { SearchBar, Overlay, Button, Icon } from "@rneui/themed";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import { clearDirections, fetchDirections } from "../../state/actions/directionsAction";
import MapComponent from "../../components/map/MapComponent";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import MyFilter from "../../components/myfilter/MyFilter";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { Styles } from "./Home.styles";
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const clearFilters = useCallback(() => { setSelectedFilters([]); setFilteredData(locations); }, [locations]);

  return { locations, filteredData, setFilteredData, loading, toggleFilter, clearFilters, showFilter, setShowFilter, selectedFilters, setSelectedFilters };
};

const useDirections = (startLocation, endLocation, preference, isStraight, profile) => {
  const dispatch = useDispatch();

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

  const handleClearDirections = async () => await dispatch(clearDirections());

  return { handleDirections, handleClearDirections };
};

const Home = ({ t }) => {
  const { locations, filteredData, setFilteredData, loading, toggleFilter, clearFilters, showFilter, selectedFilters, setSelectedFilters } = useLocations();
  const user = useSelector((state) => state.user.userInfo);
  const directions = useSelector((state) => state.direction.directions);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [profile, setProfile] = useState(null);
  const [preference, setPreference] = useState("recommended");
  const [isStraight, setIsStraight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showPOIList, setShowPOIList] = useState(false);
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const { handleDirections, handleClearDirections } = useDirections(startLocation, endLocation, preference, isStraight, profile);
  const portugalCenter = { latitude: 39.5, longitude: -8, zoomLevel: 6 };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      }
    })();
  }, []);

  const fetchPointsOfInterest = async () => {
    if (!userLocation) return;
    const url = `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${userLocation.longitude},${userLocation.latitude},100000&limit=100&apiKey=${GEOAPIFY_API_KEY}`;
    try {
      const response = await axios.get(url);
      const pois = response.data.features.map((poi) => ({ id: poi.properties.place_id.toString(), name: poi.properties.name || "Tourist Point", coordinates: { latitude: poi.geometry.coordinates[1], longitude: poi.geometry.coordinates[0] }, address: { street: poi.properties.street || "Unknown", city: poi.properties.city || "Unknown" }, category: poi.properties.categories || "Tourism" }));
      setPointsOfInterest(pois);
    } catch (error) {
      console.error("Error fetching POIs:", error);
      setPointsOfInterest([]);
    }
  };

  const handleGetPOIs = () => { fetchPointsOfInterest(); setShowPOIList(true); };
  const handleSelectPOI = (poi) => { if (userLocation) setStartLocation([userLocation.longitude, userLocation.latitude]); setEndLocation([poi.coordinates.longitude, poi.coordinates.latitude]); setShowPOIList(false); if (userLocation) setTimeout(() => handleDirections(), 300); };

  if (loading) return <ActivityLoader />;

  return (
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height" }>
        <View style={{ flex: 1 }}>
          <MyFilterButtons toggleFilter={toggleFilter} clearFilters={clearFilters} showFilter={showFilter} t={t} />
          <MyFilter showFilter={showFilter} data={locations} selectedFilters={selectedFilters} setFilteredData={setFilteredData} onFilterChange={setSelectedFilters} user={user} t={t} />
          <View style={Styles.mapContainerScreen}>
            <SearchBar placeholder={t("components.searchBar.text")} onChangeText={(text) => setSearchQuery(text)} value={searchQuery} round lightTheme platform="android" />
            <View style={Styles.buttonContainer}>
              <Button title={t("screens.map.getDirections")} onPress={handleGetPOIs} buttonStyle={Styles.button} titleStyle={Styles.buttonText} icon={<Icon name="directions" size={20} color="white" style={Styles.icon} />} />
              <Button title={t("screens.map.clearDirections")} onPress={handleClearDirections} buttonStyle={Styles.button} titleStyle={Styles.buttonText} icon={<Icon name="clear" size={20} color="white" style={Styles.icon} />} />
            </View>
            <Overlay isVisible={showPOIList} onBackdropPress={() => setShowPOIList(false)} overlayStyle={{ width: "80%", maxHeight: "70%" }}>
              <ScrollView style={{ maxHeight: 400 }}>
                <View style={{ padding: 20 }}>
                  {pointsOfInterest.length > 0 ? pointsOfInterest.map((poi) => <Button key={poi.id} title={poi.name} onPress={() => handleSelectPOI(poi)} buttonStyle={{ marginVertical: 5 }} />) : <Text style={{ textAlign: "center", padding: 20 }}>{t("screens.map.noPoints") || "Nenhum ponto turístico encontrado"}</Text>}
                </View>
              </ScrollView>
            </Overlay>
            <View style={{ flex: 1 }}>
              <MapComponent destination={filteredData[0]} directions={directions} portugalCenter={portugalCenter} locations={filteredData} pointsOfInterest={pointsOfInterest} t={t} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
  );
};

export default Home;