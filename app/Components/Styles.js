import { StyleSheet } from "react-native";

const Styles = StyleSheet.create({
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
  logoutButton: {
    marginRight: 20,
  },
  toggleSwitch: {
    marginLeft: 20,
  },
  mapContainerScreen: {
    flex: 1,
    width: "100%",
    marginTop: 20, 
  },
  searchBar: {
    position: "absolute",
    top: 85,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  inputSearchBar: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  toggleContainer: {
    marginRight: 20,
  },
  conatinerCredentials: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
  },
  inputCredentials: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
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
    marginTop: 10
  },   
  mbottom: {
    marginBottom: 10,
  },
  detailsSiteURL: {
    marginBottom: 10,
    color: "blue",
  },
  reviewTextInput: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  reviewContainer: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    marginVertical: 5,
  },
  loginPrompt: {
    color: 'red',
    marginVertical: 10,
    textAlign: 'center',
  },
});

export default Styles;
