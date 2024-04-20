import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './app/screens/Login';
import List from './app/screens/List';
import Details from './app/screens/Details';
import {User, onAuthStateChanged} from 'firebase/auth';
import { FIREBASE_APP, FIREBASE_AUTH } from './Firebase.config';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout(){
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen name='Home' component={List}/>
      <InsideStack.Screen name='Details' component={Details}/>
    </InsideStack.Navigator>
  )
}

const App = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user)=>{
      console.log('user', user);
      setUser(user);
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: false}}/>
        ) : (
          <Stack.Screen name='Login' component={Login} options={{headerShown: false}}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;