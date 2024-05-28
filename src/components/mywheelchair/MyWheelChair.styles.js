import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
  container: {
    position: "relative",
    zIndex: 1,
  },
  dropdown: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
  },
  slider: {
    width: "80%",
    alignSelf: "center",
    marginVertical: 10,
  },
  text: {
    textAlign: "center",
    marginVertical: 5,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
