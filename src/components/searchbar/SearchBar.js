// SearchBar.js
import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import {Styles} from "./searchBar.styles";

const SearchBar = ({ handleSearch }) => {
  return (
    <View style={Styles.searchBar}>
      <TextInput
        style={Styles.inputSearchBar}
        placeholder="Search destination in Portugal"
        onChangeText={(text) => handleSearch(text)}
      />
    </View>
  );
};

export default SearchBar;
