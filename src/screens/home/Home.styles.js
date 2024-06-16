import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    flexDirection: "column"
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
    marginTop: 20, // Increase to desired padding
    paddingTop: 20, // Add top padding
  },  
});
