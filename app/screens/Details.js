import { View, Text } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../Firebase.config'

const Details = () => {
  return (
    <View>
      <Text>{FIREBASE_AUTH.currentUser.displayName}</Text>
      <Text>"Hello world"</Text>
    </View>
  )
}

export default Details

