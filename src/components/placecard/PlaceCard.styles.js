import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    marginHorizontal: 20,
    borderRadius: 10,
    overflow: "hidden",
    elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 250,
    justifyContent: "flex-end",
  },
  imageStyle: {
    borderRadius: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  accessLevelContainer: {
    position: "absolute",
    alignItems: "center",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 5,
    borderRadius: 50,
    width: "10%",
    height: "15%",
  },
  detailsContainer: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  address: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 5,
  },
  accessLevel: {
    fontSize: 14,
    color: "black",
    marginTop: 5,
    fontWeight: "bold",
  },
});
