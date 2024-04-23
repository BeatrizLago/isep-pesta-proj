import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import Styles from "../Components/Styles";
import { FIREBASE_AUTH } from "../config/Firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signInAnonymous = async () => {
    setLoading(true);
    try {
      const response = await signInAnonymously(auth);
      console.log("Anonymous response:", response);
    } catch (error) {
      console.log(error);
      alert("O Login falhou: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log("Login response:", response);
    } catch (error) {
      console.log(error);
      alert("O Login falhou: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={Styles.conatinerCredentials}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={Styles.inputCredentials}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>
        <TextInput
          style={Styles.inputCredentials}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text.trim())}
        ></TextInput>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Login" onPress={signIn} />
            <Button
              title="Criar Conta"
              onPress={() => navigation.navigate("Signup")}
            />
            <Button title="Login Anonimo" onPress={signInAnonymous} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
