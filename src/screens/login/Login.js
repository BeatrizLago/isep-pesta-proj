import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import {styles} from "./Login.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch } from "react-redux";
import { signInAnonymous, signIn } from "../../state/actions/authAction";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInAnonymousFunc = async () => {
    setLoading(true);
    try {
      dispatch(signInAnonymous());
    } finally {
      setLoading(false);
    }
  };

  const signInFunc = async () => {
    setLoading(true);
    try {
      dispatch(signIn(email, password));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.conatinerCredentials}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.inputCredentials}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text.trim())}
        ></TextInput>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <Button title="Login" onPress={signInFunc} />
            <Button
              title="Criar Conta"
              onPress={() => navigation.navigate("Signup")}
            />
            <Button title="Login Anonimo" onPress={signInAnonymousFunc} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
