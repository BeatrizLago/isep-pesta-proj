// SearchBar.js
import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';

const SearchBar = ({ handleSearch }) => {
  return (
    <View style={styles.searchBar}>
      <TextInput
        style={styles.input}
        placeholder="Search destination in Portugal"
        onChangeText={(text) => handleSearch(text)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    position: 'absolute',
    top: 85,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});

export default SearchBar;
