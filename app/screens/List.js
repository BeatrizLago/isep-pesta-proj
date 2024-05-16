import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { fetchFromFirestore } from "../config/Firestore";
import PlaceCard from "../Components/PlaceCard";
import ActivityLoader from "../Components/ActivityLoader";
import Filter from "../Components/MyFilter";
import MyFilter from "../Components/MyFilter";

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);

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

  const applyFilters = (filteredLocations) => {
    setFilteredData(filteredLocations);
  };

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityLoader />
      ) : (
        <>
          <MyFilter locations={data} onFilter={applyFilters} />
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
            onPress={handleRefresh}
          >
            <Text style={{ fontSize: 16, color: "blue" }}>Refresh</Text>
          </TouchableOpacity>

          <FlatList
            data={filteredData}
            renderItem={({ item }) => <PlaceCard place={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}
    </View>
  );
};

export default List;
