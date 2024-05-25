import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./Login.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { signInAnonymous, signIn } from "../../state/actions/authAction";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInAnonymousFunc = async () => {
    setLoading(true);
    try {
      dispatch(signInAnonymous());
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const signInFunc = async () => {
    setLoading(true);
    try {
      dispatch(signIn(email, password));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      alert(error);
      // Optionally, clear error after displaying it
      // dispatch(clearError());
    }
  }, [error]);

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
