import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SimpleWidget from '../screens/SimpleWidget';
import BinanceTradingView from '../screens/BinanceTradingView';
import Home from '../screens/Home';

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="SimpleWidget" component={SimpleWidget} />
        <Stack.Screen name="BinanceTradingView" component={BinanceTradingView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

