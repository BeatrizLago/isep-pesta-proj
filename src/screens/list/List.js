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
import { SearchBar, Overlay, Button } from "@rneui/themed"; // Import SearchBar, Overlay, Button
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocations } from "../../state/actions/locationAction"; // Assuming this fetches general locations, not just POIs
import MyFilter from "../../components/myfilter/MyFilter";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import { Styles } from "./List.styles"; // Ensure you have styles for the search bar and suggestions
import axios from "axios";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Assuming you might need this for future use

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

// Helper hook for location data and filtering (adapted for POIs in List screen)
// This hook will manage the initial fetch, filtering state, and filtered data.
const usePoiLocations = () => {
  const dispatch = useDispatch();
  // We'll manage POIs directly in this component's state, as they are fetched from Geoapify
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Data after MyFilter is applied
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
        // Handle permission denied case, e.g., show an alert
        console.warn("Location permission denied for List screen.");
        setLoading(false); // Stop loading even if permission is denied
      }
    };
    getUserLocation();
  }, []);

  // Fetch POIs when userLocation is available
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
          category: poi.properties.categories?.[0] || "Turismo", // Assuming category is an array, take first or default
          // Add dummy accessibility and wheelchair for MyFilter to work
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
        setFilteredData(pois); // Initially, filteredData is all POIs
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
    setFilteredData(pointsOfInterest); // Reset filtered data to all POIs
  }, [pointsOfInterest]);

  return {
    pointsOfInterest, // The raw list of POIs
    filteredData, // POIs after MyFilter's logic
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
    filteredData, // This now comes from the hook, representing data filtered by MyFilter
    setFilteredData,
    loading,
    toggleFilter,
    clearFilters,
    showFilter,
    selectedFilters,
    setSelectedFilters,
    userLocation,
  } = usePoiLocations(); // Use the adapted hook

  const user = useSelector((state) => state.user.userInfo); // Still need user info for MyFilter
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search bar
  const [searchFilteredData, setSearchFilteredData] = useState([]); // Data after search query is applied

  // Effect to apply text search filter
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
      setSearchFilteredData(filteredData); // If no search query, show data filtered by MyFilter
    }
  }, [filteredData, searchQuery]); // Re-run when MyFilter's output or search query changes

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Re-fetch POIs (the hook will handle this if userLocation is available)
    // For simplicity, we'll just re-set filteredData to pointsOfInterest
    setFilteredData(pointsOfInterest);
    setSearchQuery(""); // Clear search query on refresh
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
        {/* MyFilter now receives clearFilters and toggleFilter */}
        <MyFilter
            showFilter={showFilter}
            data={pointsOfInterest} // Pass all POIs to MyFilter for its internal filtering logic
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            setFilteredData={setFilteredData} // MyFilter will update this based on its filters
            onFilterChange={setSelectedFilters} // MyFilter will use this to update selectedFilters
            user={user}
            t={t}
            clearFilters={clearFilters} // Pass clearFilters
            toggleFilter={toggleFilter} // Pass toggleFilter to allow MyFilter to close itself
        />

        {/* Conditionally render SearchBar */}
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
                  // No need for onFocus/showSearchSuggestions here as we're just filtering the list
              />
            </View>
        )}

        {searchFilteredData.length > 0 ? (
            <FlatList
                data={searchFilteredData} // Use searchFilteredData for the FlatList
                renderItem={({ item }) => (
                    <PlaceCard
                        place={{
                          id: item.id,
                          name: item.name,
                          address: item.address,
                          category: item.category,
                          coordinates: item.coordinates,
                          accessibility: item.accessibility || {}, // Ensure accessibility is an object
                          wheelchair: item.wheelchair || { width: null, height: null }, // Ensure wheelchair is an object
                          phoneNumber: item.phoneNumber || null,
                          email: item.email || null,
                          siteURL: item.siteURL || null,
                          accessLevel: item.accessLevel || null, // Ensure accessLevel is passed
                        }}
                    />
                )}
                keyExtractor={(item) => item.id} // Use item.id as key for better performance
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