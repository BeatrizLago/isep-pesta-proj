import React, { useEffect, useState, useMemo } from "react";
import { View, FlatList, TouchableOpacity, Text, Button } from "react-native";
import { fetchFromFirestore } from "../config/Firestore";
import PlaceCard from "../Components/PlaceCard";
import ActivityLoader from "../Components/ActivityLoader";
import MyFilter from "../Components/MyFilter";

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false); // State to manage filter visibility

  const filters = ["0", "1", "2", "3", "4", "5"];
  const categories = useMemo(
    () => [...new Set(data.map((item) => item.category))],
    [data]
  );
  const cities = useMemo(
    () => [...new Set(data.map((item) => item.address.city))],
    [data]
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchFromFirestore("locations");
      setData(fetchedData);
      setFilteredData(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

  const clearFilters = () => {
    setSelectedFilters([]); // Clear selected filters
    setFilteredData(data); // Reset filtered data to original data
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityLoader />
      ) : (
        <>
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
            onPress={() => setShowFilter(!showFilter)} // Toggle filter visibility
          >
            <Text style={{ fontSize: 16, color: "blue" }}>
              {showFilter ? "Close Filter" : "Open Filter"}
            </Text>
          </TouchableOpacity>
          {showFilter && (
            <MyFilter
              data={data}
              filters={filters}
              cities={cities}
              categories={categories}
              selectedFilters={selectedFilters}
              setFilteredData={setFilteredData}
              onFilterChange={setSelectedFilters}
            />
          )}

          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 100, zIndex: 1 }}
            onPress={handleRefresh}
          >
            <Text style={{ fontSize: 16, color: "blue" }}>Refresh</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 190, zIndex: 1 }}
            onPress={clearFilters} // Call clearFilters function when pressed
          >
            <Text style={{ fontSize: 16, color: "red" }}>Clear Filters</Text>
          </TouchableOpacity>

          {filteredData.length > 0 ? (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => <PlaceCard place={item} />}
              keyExtractor={(item, index) => index.toString()}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Não foram encontrados dados correspondentes
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default List;
