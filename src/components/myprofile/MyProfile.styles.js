import { StyleSheet } from "react-native";

export const Styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginTop: 10, 
    },
    profilePicture: {
        width: 130,
        height: 130,
        borderRadius: 150 / 2,
        overflow: "hidden",
        borderWidth: 3,
        borderColor: "black"
    },
    profileName: {
      fontSize: 23, 
      fontWeight: 'bold',
      marginTop: 5,
    },
    emailText: {
        fontSize: 18, 
      },
      emailLabelText: {
        fontWeight: "bold",
        fontSize: 18, 
      },
    separator: {
        width: '100%',
        height: 2, 
        backgroundColor: 'black',
        marginVertical: 10, 
      },
      emailContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      },
      wheelchairContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 15,
        //justifyContent: "center",
      },
      wheelchairPicture: {
        width: 75,
        height: 75,
        //borderRadius: 150 / 2,
        //overflow: "hidden",
        //borderWidth: 3,
        //borderColor: "black"
      },
      wheelchairInfoContainer: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }
  });