import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
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
  centerModal: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerModalBox: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    height: "60%",
  },
  detailsContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  detailsImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  detailsContent: {
    padding: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailsCategory: {
    fontSize: 18,
    marginBottom: 10,
  },
  detailsSubtitle: {
    fontSize: 18,
  },
  detailsSubtitle2: {
    fontSize: 18,
    marginTop: 10,
  },
  mbottom: {
    marginBottom: 10,
  },
  detailsSiteURL: {
    marginBottom: 10,
    color: "blue",
  },
  reviewTextInput: {
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  reviewContainer: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    marginVertical: 5,
  },
  loginPrompt: {
    color: "red",
    marginVertical: 10,
    textAlign: "center",
  },
  ratingBarStyle:{
    backgroundColor:"lightgray",
    top: 35,
    width:90,
    height:35,
    alignItems:'center',
    alignSelf:'center',
    alignContent:'center',
    borderRadius:50,
    padding:5
  },
  rateButtonStyle:{
    height:40,
    top:10,
    backgroundColor:"yellow",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  rating: {
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    marginVertical: 10,
  },
});