import { View, Text, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";

function filterLocationsByAccessLevel(locations, chosenAccessLevel) {
  return locations.filter(
    (location) => location.accessLevel === chosenAccessLevel
  );
}

function filterLocationsByCity(locations, chosenCity) {
  return locations.filter((location) => location.address.city === chosenCity);
}
function filterLocationsByCategory(locations, chosenCategory) {
  return locations.filter((location) => location.category === chosenCategory);
}
function filterLocationsByWheelchair(locations, wheelchair) {
  return locations.filter((location) => {
    return (
      wheelchair.width <= location.wheelchair.width &&
      wheelchair.height <= location.wheelchair.height
    );
  });
}

const MyFilter = ({ locations, onFilter }) => {
  const [selectedAccessLevel, setSelectedAccessLevel] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wheelchair, setWheelchair] = useState({ width: 50, height: 40 });

  const applyFilters = () => {
    let filteredLocations = locations;

    if (selectedAccessLevel) {
      filteredLocations = filterLocationsByAccessLevel(
        filteredLocations,
        selectedAccessLevel
      );
    }
    if (selectedCity) {
      filteredLocations = filterLocationsByCity(
        filteredLocations,
        selectedCity
      );
    }
    if (selectedCategory) {
      filteredLocations = filterLocationsByCategory(
        filteredLocations,
        selectedCategory
      );
    }
    if (wheelchair.width > 0 && wheelchair.height > 0) {
      filteredLocations = filterLocationsByWheelchair(
        filteredLocations,
        wheelchair
      );
    }

    onFilter(filteredLocations);
  };

  return (
    <View style={{ padding: 10 }}>
      <Text>Filter by:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 5,
          marginBottom: 10,
        }}
        placeholder="Access Level"
        value={selectedAccessLevel}
        onChangeText={(text) => setSelectedAccessLevel(text)}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 5,
          marginBottom: 10,
        }}
        placeholder="City"
        value={selectedCity}
        onChangeText={(text) => setSelectedCity(text)}
      />
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: "grey",
          padding: 5,
          marginBottom: 10,
        }}
        placeholder="Category"
        value={selectedCategory}
        onChangeText={(text) => setSelectedCategory(text)}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "grey", padding: 5 }}
          placeholder="Wheelchair Width"
          keyboardType="numeric"
          value={wheelchair.width.toString()}
          onChangeText={(text) =>
            setWheelchair({ ...wheelchair, width: parseInt(text) || 0 })
          }
        />
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "grey",
            padding: 5,
            marginLeft: 10,
          }}
          placeholder="Wheelchair Height"
          keyboardType="numeric"
          value={wheelchair.height.toString()}
          onChangeText={(text) =>
            setWheelchair({ ...wheelchair, height: parseInt(text) || 0 })
          }
        />
      </View>
      <TouchableOpacity
        onPress={() => applyFilters()}
        style={{ backgroundColor: "blue", padding: 10, alignItems: "center" }}
      >
        <Text style={{ color: "white" }}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyFilter;
