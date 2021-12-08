import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux'
import Home from './Screens/Home';
import Category from './Screens/Category';
import { store } from './Redux/Store'
import { Button } from 'react-native';
import Field from './Screens/Field';
import ShareScreen from './Screens/Share';
import Editor from './Screens/editor';
import Crate from './Screens/Crate';
import ImageScreen from './Screens/ImageScreen';
import CrateDetailScreen from './Screens/CrateDetails'
import ContactList from './Screens/ContactList';
import { NativeBaseProvider } from 'native-base'
import ViewMedia from './Screens/ViewMedia';

const Stack = createNativeStackNavigator();

function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name='crate' component={Crate} />
        <Stack.Screen name='imagescreen' component={ImageScreen} />
        <Stack.Screen name='editor' component={Editor} />
        <Stack.Screen name='cratedetail' component={CrateDetailScreen} />
        <Stack.Screen name='viewmedia' component={ViewMedia} />
        <Stack.Screen name='contactlist' component={ContactList} />
        <Stack.Screen name='share' component={ShareScreen} />
        <Stack.Screen name='field' component={Field} />
        <Stack.Screen name='home' component={Home}
          options={{
            headerRight: () => (
              <Button
                onPress={() => alert('This is a button!')}
                title="Info"
                color="navy"
              />
            ),
          }}
        />

        <Stack.Screen name='category' component={Category} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

function App() {
  return (
    <NativeBaseProvider>
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </NativeBaseProvider>
  );
}

export default App;