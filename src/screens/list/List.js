import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Keyboard, // Import Keyboard to dismiss it
  Dimensions, // Import Dimensions for overlay styling if needed
  ScrollView, // For search suggestions if implemented
} from "react-native";
import { SearchBar, Overlay, Button } from "@rneui/themed";
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction";
import MyFilter from "../../components/myfilter/MyFilter";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import { Styles } from "./List.styles";
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

const usePoiLocations = () => {
  const dispatch = useDispatch();
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch user location once
  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } else {
        console.warn("Location permission denied for List screen.");
        setLoading(false);
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchPointsOfInterest = async (location) => {
      setLoading(true);
      const url = `https://api.geoapify.com/v2/places?categories=tourism&filter=circle:${location.longitude},${location.latitude},100000&limit=100&apiKey=${GEOAPIFY_API_KEY}`;
      try {
        const response = await axios.get(url);
        const pois = response.data.features.map((poi) => ({
          id: poi.properties.place_id.toString(),
          name: poi.properties.name || "Ponto Turístico",
          coordinates: {
            latitude: poi.geometry.coordinates[1],
            longitude: poi.geometry.coordinates[0]
          },
          address: {
            street: poi.properties.street || "Desconhecido",
            city: poi.properties.city || "Desconhecido"
          },
          category: poi.properties.categories?.[0] || "Turismo",
          accessibility: {
            parking: false, entrance: false, handicapBathroom: false,
            internalCirculation: false, signLanguage: false, visualAlarms: false,
            writtenDescriptions: false
          },
          wheelchair: { width: 0, height: 0 }, // Dummy values
          accessLevel: "3", // Dummy access level
          phoneNumber: null, email: null, siteURL: null
        }));
        setPointsOfInterest(pois);
        setFilteredData(pois);
      } catch (error) {
        console.error("Erro ao buscar POIs:", error);
        setPointsOfInterest([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    if (userLocation) {
      fetchPointsOfInterest(userLocation);
    }
  }, [userLocation]);

  const toggleFilter = useCallback(() => setShowFilter((prev) => !prev), []);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilteredData(pointsOfInterest);
  }, [pointsOfInterest]);

  return {
    pointsOfInterest,
    filteredData,
    setFilteredData,
    loading,
    toggleFilter,
    clearFilters,
    showFilter,
    setShowFilter,
    selectedFilters,
    setSelectedFilters,
    userLocation,
  };
};


const List = ({ t }) => {
  const {
    pointsOfInterest,
    filteredData,
    setFilteredData,
    loading,
    toggleFilter,
    clearFilters,
    showFilter,
    selectedFilters,
    setSelectedFilters,
    userLocation,
  } = usePoiLocations();

  const user = useSelector((state) => state.user.userInfo);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilteredData, setSearchFilteredData] = useState([]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = filteredData.filter(poi =>
          (poi.name && poi.name.toLowerCase().includes(lowerCaseQuery)) ||
          (poi.address && poi.address.city && poi.address.city.toLowerCase().includes(lowerCaseQuery)) ||
          (poi.category && poi.category.toLowerCase().includes(lowerCaseQuery))
      );
      setSearchFilteredData(results);
    } else {
      setSearchFilteredData(filteredData);
    }
  }, [filteredData, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setFilteredData(pointsOfInterest);
    setSearchQuery("");
    setRefreshing(false);
  }, [pointsOfInterest, setFilteredData]);


  const handleSearch = useCallback((text) => {
    setSearchQuery(text);
  }, []);

  if (loading) return <ActivityLoader />;

  return (
      <View style={{ flex: 1 }}>
        <MyFilterButtons
            toggleFilter={toggleFilter}
            showFilter={showFilter}
            t={t}
        />
        <MyFilter
            showFilter={showFilter}
            data={pointsOfInterest}
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setFilteredData={setFilteredData}
            onFilterChange={setSelectedFilters}
            user={user}
            t={t}
            clearFilters={clearFilters}
            toggleFilter={toggleFilter}
        />

        {!showFilter && (
            <View style={Styles.searchBarWrapper}>
              <SearchBar
                  placeholder={t("components.searchBar.text") || "Pesquisar POIs..."}
                  onChangeText={handleSearch}
                  value={searchQuery}
                  round
                  lightTheme
                  platform="android"
                  containerStyle={Styles.searchBarContainer}
                  inputContainerStyle={Styles.searchBarInputContainer}

              />
            </View>
        )}

        {searchFilteredData.length > 0 ? (
            <FlatList
                data={searchFilteredData}
                renderItem={({ item }) => (
                    <PlaceCard
                        place={{
                          id: item.id,
                          name: item.name,
                          address: item.address,
                          category: item.category,
                          coordinates: item.coordinates,
                          accessibility: item.accessibility || {},
                          wheelchair: item.wheelchair || { width: null, height: null }, // Ensure wheelchair is an object
                          phoneNumber: item.phoneNumber || null,
                          email: item.email || null,
                          siteURL: item.siteURL || null,
                          accessLevel: item.accessLevel || null,
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={Styles.locationList}
            />
        ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              {t("screens.list.notFound") || "Nenhum ponto de interesse encontrado."}
            </Text>
        )}
      </View>
  );
};

export default List;