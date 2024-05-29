import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bottomBarHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    position: "absolute",
    padding: 10,
    width: "100%",
    bottom: 0,
  },
  bottomBarItem: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 1,
    backgroundColor: "#6c6c67",
    borderRadius: 50,
    width: "45%",
  },
  bottomBarItem1: {
    justifyContent: "center",
    flexDirection: "row",
    padding: 20,
    zIndex: 1,
    backgroundColor: "#6c6c67",
    borderRadius: 50,
    width: "45%",
  },
  filterText: {
    fontSize: 16,
    color: "white",
  },
  clearFilterText: {
    fontSize: 16,
    color: "white",
  },

  filterButton: {
    padding: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#007BFF",
  },
  locationList: {
    paddingBottom: 70,
  },
});
