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
  mapContainerScreen: {
    flex: 1,
    width: "100%",
    marginTop: 20,
  },
});
