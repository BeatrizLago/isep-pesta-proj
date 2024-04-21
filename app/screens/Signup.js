import { StyleSheet, View, Text, TextInput, ActivityIndicator, Button, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import{FIREBASE_AUTH} from '../../Firebase.config'
import { createUserWithEmailAndPassword, updateCurrentUser, updateProfile } from 'firebase/auth';

const Signup = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);

            const displayName = (firstName && lastName) ? `${firstName} ${lastName}` : email; // If firstName and lastName are undefined or empty, use email

            await updateProfile(auth.currentUser, {
                displayName: displayName
            });
            console.log(response);  
            alert('Verifique o seu email');
        } catch (error) {
            console.error(error);
            alert('Criar a conta falhou: ' + error.message);
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <View style= {styles.conatiner}>
        <KeyboardAvoidingView behavior='padding'>
          <TextInput style= {styles.input} value={firstName} placeholder='First Name' autoCapitalize='none' onChangeText={(text) => setFirstName(text.trim())}></TextInput>
          <TextInput style= {styles.input} value={lastName} placeholder='Last Name' autoCapitalize='none' onChangeText={(text) => setLastName(text.trim())}></TextInput>
          <TextInput style= {styles.input} value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text.trim())}></TextInput>
          <TextInput style= {styles.input} value={password} secureTextEntry={true} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text.trim())}></TextInput>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
                <Button title='Criar Conta' onPress={signUp}/>
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

export default Signup