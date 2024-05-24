import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
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
});
