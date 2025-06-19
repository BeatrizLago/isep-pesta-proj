import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  FlatList,
  Text,
} from "react-native";
import { SearchBar } from "@rneui/themed";
import PlaceCard from "../../components/placecard/PlaceCard";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useSelector } from "react-redux";
import MyFilter from "../../components/myfilter/MyFilter";
import MyFilterButtons from "../../components/myfilterbuttons/MyFilterButtons";
import { Styles } from "./List.styles";
import axios from "axios";
import * as Location from "expo-location";

const GEOAPIFY_API_KEY = "1a13f7c626df4654913fa4a3b79c9d62";

// Helper function to map Geoapify categories to desired categories
const mapGeoapifyCategory = (geoapifyCategory) => {
  if (!geoapifyCategory) {
    return "Outros"; // Default if no category is found
  }

  // Convert to lowercase for easier comparison
  const lowerCaseCategory = geoapifyCategory.toLowerCase();

  if (lowerCaseCategory.includes("monument") || lowerCaseCategory.includes("historic")) {
    return "Monumentos";
  }
  if (lowerCaseCategory.includes("leisure") || lowerCaseCategory.includes("tourism.attraction") || lowerCaseCategory.includes("sport")) {
    return "Lazer";
  }
  if (lowerCaseCategory.includes("hotel") || lowerCaseCategory.includes("accommodation")) {
    return "Hotel";
  }
  // Add more mappings as needed
  if (lowerCaseCategory.includes("catering") || lowerCaseCategory.includes("restaurant") || lowerCaseCategory.includes("cafe")) {
    return "Alimentação";
  }
  if (lowerCaseCategory.includes("shop")) {
    return "Comércio";
  }
  if (lowerCaseCategory.includes("education")) {
    return "Educação";
  }
  if (lowerCaseCategory.includes("healthcare")) {
    return "Saúde";
  }
  if (lowerCaseCategory.includes("service")) {
    return "Serviços";
  }
  if (lowerCaseCategory.includes("transport")) {
    return "Transportes";
  }
  if (lowerCaseCategory.includes("park") || lowerCaseCategory.includes("garden")) {
    return "Parques e Jardins";
  }
  if (lowerCaseCategory.includes("museum")) {
    return "Museus";
  }

  return "Outros"; // Fallback for uncategorized items
};

const usePoiLocations = () => {
  const [pointsOfInterest, setPointsOfInterest] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation(location.coords);
      } else {
        setLoading(false);
      }
    };
    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchPointsOfInterest = async (location) => {
      setLoading(true);
      // You might want to adjust the categories parameter for Geoapify if you want more specific initial results
      // For example, instead of just 'tourism', you might add 'tourism.attraction', 'leisure', 'accommodation' etc.
      const url = `https://api.geoapify.com/v2/places?categories=tourism.sights,tourism.attraction,leisure,accommodation,commercial,catering&filter=circle:${location.longitude},${location.latitude},100000&limit=100&apiKey=${GEOAPIFY_API_KEY}`;
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
          // Apply the mapping function here
          category: mapGeoapifyCategory(poi.properties.categories?.[0]),
          accessibility: {
            parking: false, entrance: false, handicapBathroom: false,
            internalCirculation: false, signLanguage: false, visualAlarms: false,
            writtenDescriptions: false
          },
          wheelchair: { width: 0, height: 0 },
          accessLevel: "3",
          phoneNumber: null, email: null, siteURL: null
        }));
        setPointsOfInterest(pois);
        setFilteredData(pois);
      } catch (error) {
        console.error("Error fetching points of interest:", error);
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

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    setFilteredData(pointsOfInterest);
    setSearchQuery("");
    setRefreshing(false);
  }, [pointsOfInterest, setFilteredData]);

  const handleSearch = React.useCallback((text) => {
    setSearchQuery(text);
  }, []);

  if (loading) return <ActivityLoader />;

  return (
      <View style={{ flex: 1 }}>
        <MyFilterButtons
            toggleFilter={toggleFilter}
            clearFilters={clearFilters}
            showFilter={showFilter}
            t={t}
        />

        {!showFilter && (
            <>
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

              <FlatList
                  data={searchFilteredData}
                  renderItem={({ item }) => (
                      <PlaceCard
                          place={{
                            id: item.id,
                            name: item.name,
                            address: item.address,
                            category: item.category, // This will now be your custom category
                            coordinates: item.coordinates,
                            accessibility: item.accessibility || {},
                            wheelchair: item.wheelchair || { width: null, height: null },
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
            </>
        )}

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
      </View>
  );
};

export default List;