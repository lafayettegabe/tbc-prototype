import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { HomeScreen } from '@/screens/HomeScreen';
import { BattleScreen } from '@/screens/BattleScreen';

export type RootStackParamList = {
  Home: undefined;
  Battle: { stage: number };
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false // line
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
        />
        <Stack.Screen 
          name="Battle" 
          component={BattleScreen}
          options={({ route }) => ({ title: `Battle ${route.params?.stage}` })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}