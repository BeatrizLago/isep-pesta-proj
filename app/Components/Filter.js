import { View, Text } from "react-native";
import React from "react";

function filterLocationsByAccessLevel(locations, chosenAccessLevel) {
  return locations.filter(
    (location) => location.accessLevel === chosenAccessLevel
  );
}

const Filter = (locations) => {
  return (
    <View>
      <Text>Filter</Text>
    </View>
  );
};

module.exports = { filterLocationsByAccessLevel };
export default Filter;
