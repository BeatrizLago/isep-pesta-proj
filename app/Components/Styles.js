import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
  mapContainer: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    width: "95%",
    height: "80%",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  logoutButton: {
    marginRight: 20,
  },
  toggleSwitch: {
    marginLeft: 20,
  },
  mapContainerScreen: {
    flex: 1,
    width: "100%",
    marginTop: 20, // Adjust this value to move the search bar higher
  },
  searchBar: {
    position: "absolute",
    top: 85,
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
  toggleContainer: {
    marginRight: 20,
  },
  conatinerCredentials: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  inputCredentials: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
});

export default Styles;
