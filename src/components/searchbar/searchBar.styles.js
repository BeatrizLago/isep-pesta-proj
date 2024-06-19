import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  searchBar: {
    position: "absolute",
    top: 75,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  inputSearchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
