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
});
