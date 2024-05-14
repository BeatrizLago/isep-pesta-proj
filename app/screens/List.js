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

const List = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetchFromFirestore("locations");
      setData(fetchedData);
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

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityLoader />
      ) : (
        <>
          <TouchableOpacity
            style={{ position: "absolute", top: 10, right: 10, zIndex: 1 }}
            onPress={handleRefresh}
          >
            <Text style={{ fontSize: 16, color: "blue" }}>Refresh</Text>
          </TouchableOpacity>

          <FlatList
            data={data}
            renderItem={({ item }) => <PlaceCard place={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        </>
      )}
    </View>
  );
};

export default List;
