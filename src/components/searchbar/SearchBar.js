// SearchBar.js
import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import {Styles} from "./searchBar.styles";

const SearchBar = ({ handleSearch, t }) => {
  return (
    <View style={Styles.searchBar}>
      <TextInput
        style={Styles.inputSearchBar}
        placeholder= {t("components.searchBar.text")}
        onChangeText={(text) => handleSearch(text)}
      />
    </View>
  );
};

export default SearchBar;
