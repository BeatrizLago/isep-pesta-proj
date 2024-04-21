import { StyleSheet, View, Text, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, AsyncStorage } from 'react-native'
import React, { useState } from 'react'
import{FIREBASE_AUTH} from '../../Firebase.config'
import { createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({navigation}) => {

const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [loading, setLoading] = useState(false);
const auth = FIREBASE_AUTH;

const signInAnonymous = async () => {
    setLoading(true);
    try {
        const response = await signInAnonymously(auth);
        console.log(response);  
    } catch (error) {
        console.log(error);
        alert('O Login falhou: ' + error.message);
    } finally {
        setLoading(false);
    }
}

const signIn = async () => {
    setLoading(true);
    try {
        const response = await signInWithEmailAndPassword(auth, email, password);
        savedata(email, password);
        console.log(response);  
    } catch (error) {
        console.log(error);
        alert('O Login falhou: ' + error.message);
    } finally {
        setLoading(false);
    }
}

const savedata = async (eamil,password) => {
    let value = {'email': eamil, 'password': password}   
    await AsyncStorage.setItem('user', JSON.stringify(value));
       this.setState({user: value});
    
       console.log("deneme",value);
   } 


  return (
    <View style= {styles.conatiner}>
    <KeyboardAvoidingView behavior='padding'>
      <TextInput style= {styles.input} value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text.trim())}></TextInput>
      <TextInput style= {styles.input} value={password} secureTextEntry={true} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text.trim())}></TextInput>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
            <Button title='Login' onPress={signIn}/>
            <Button title='Criar Conta' onPress={() => navigation.navigate('Signup')}/>
            <Button title='Login Anonimo' onPress={signInAnonymous}/>
        </>
      )}
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
    conatiner: {
        marginHorizontal : 20,
        flex : 1,
        justifyContent : 'center'
    },
    input:{
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
});

export default Login