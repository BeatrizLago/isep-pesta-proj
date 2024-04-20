import { Button, Text, View } from 'react-native'
import React, { Component } from 'react'
import { FIREBASE_AUTH } from '../../Firebase.config'


const List = ({ navigation}) => {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Button onPress={() => navigation.navigate('Details')} title='Abrir Detalhes'/>
        <Button onPress={() => FIREBASE_AUTH.signOut()} title='Logout'/>
      </View>
    )
}

export default List