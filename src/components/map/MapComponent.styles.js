import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 20,
    overflow: "hidden",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  userLocation: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  routeInfoBox: {
    position: "absolute",
    top: 10,
    left: 10, // Moved further left
    bottom: 10,
    right: 200, // Adjusted to ensure it doesn't cover too much of the map
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 8,
    borderRadius: 5,
    zIndex: 1,
  },
  routeInfoText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  listContainer: {
    marginTop: 10, // Spacing between text and list
    maxHeight: 200, // Set a maximum height for the FlatList container
  },
  listItem: {
    padding: 5,
  },
  listItemText: {
    fontSize: 14,
  },
});
