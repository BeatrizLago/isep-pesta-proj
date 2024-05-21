import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { fetchFromFirestore } from "../config/Firestore";
import PlaceCard from "../Components/PlaceCard";
import ActivityLoader from "../Components/ActivityLoader";
import MyFilter from "../Components/MyFilter";

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const fetchData = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const clearFilters = useCallback(() => {
    setSelectedFilters([]);
    setFilteredData(data);
  }, [data]);

  const toggleFilter = useCallback(() => {
    setShowFilter((prev) => !prev);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityLoader />
      ) : (
        <>
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              flexDirection: "row",
              zIndex: 1,
            }}
          >
            <TouchableOpacity
              onPress={toggleFilter}
              style={{ marginRight: 10 }}
            >
              <Text style={{ fontSize: 16, color: "blue" }}>
                {showFilter ? "Close Filter" : "Open Filter"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRefresh}
              style={{ marginRight: 10 }}
            >
              <Text style={{ fontSize: 16, color: "blue" }}>Refresh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={{ fontSize: 16, color: "red" }}>Clear Filters</Text>
            </TouchableOpacity>
          </View>

          {showFilter && (
            <MyFilter
              data={data}
              selectedFilters={selectedFilters}
              setFilteredData={setFilteredData}
              onFilterChange={setSelectedFilters}
            />
          )}

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
