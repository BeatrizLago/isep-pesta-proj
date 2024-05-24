import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    marginVertical: 10,
    marginHorizontal: 20,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: "#333",
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  detailsContainer: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  acessLevel: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});
