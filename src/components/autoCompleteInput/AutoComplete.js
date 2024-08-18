import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AutocompleteInput from "react-native-autocomplete-input";

const Autocomplete = ({ data, placeholder, onSelect }) => {
  const [inputQuery, setInputQuery] = useState("");

  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(inputQuery.toLowerCase())
  );

  const handleSelectItem = (itemName) => {
    setInputQuery(itemName); // Set the input query to the selected item
    onSelect(itemName); // Call the onSelect function passed as a prop
  };

  return (
    <AutocompleteInput
      data={filteredData}
      value={inputQuery}
      onChangeText={(text) => setInputQuery(text)}
      placeholder={placeholder}
      flatListProps={{
        keyExtractor: (item) => item.id.toString(),
        renderItem: ({ item }) => (
          <TouchableOpacity onPress={() => handleSelectItem(item.name)}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        ),
      }}
    />
  );
};

export default Autocomplete;
