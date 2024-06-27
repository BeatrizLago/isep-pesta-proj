// SearchBar.js
import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import {Styles} from "./searchBar.styles";

const SearchBar = ({ handleSearch, t, theme }) => {
  return (
    <View style={Styles.searchBar}>
      <TextInput
        style={[Styles.inputSearchBar, { borderColor: theme.text, backgroundColor: theme.background, color: theme.text  }]}
        placeholder= {t("components.searchBar.text")}
        placeholderTextColor={theme.text}
        onChangeText={(text) => handleSearch(text)}
      />
    </View>
  );
};

export default SearchBar;
