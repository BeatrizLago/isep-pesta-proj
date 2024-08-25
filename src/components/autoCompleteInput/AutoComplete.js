import React, { useState } from "react";
import { View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Styles } from "./AutoComplete.styles";

const Autocomplete = ({ data, placeholder, onSelect }) => {
  const [inputQuery, setInputQuery] = useState("");

  // Filter data based on the input query
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(inputQuery.toLowerCase())
  );

  // Handle selection of an item by id and map it to the corresponding name
  const handleSelectItem = (selectedId) => {
    const selectedItem = data.find((item) => item.id === selectedId);
    if (selectedItem) {
      console.log("Selected item name:", selectedItem.name);
      setInputQuery(selectedItem.name);
      onSelect(selectedItem.name);
    }
  };

  return (
    <View style={Styles.container}>
      <SelectList
        setSelected={handleSelectItem}
        data={filteredData.map((item) => ({ key: item.id, value: item.name }))}
        search={true}
        placeholder={placeholder}
        inputStyles={Styles.input}
        dropdownStyles={Styles.dropdown}
        dropdownItemStyles={Styles.dropdownItem}
      />
    </View>
  );
};

export default Autocomplete;
