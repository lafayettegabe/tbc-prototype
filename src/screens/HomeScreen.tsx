import React from 'react';
import { StyleSheet, Pressable, View, Text } from 'react-native';
import { createScreen } from '@/components/createScreen';

export const HomeScreen = createScreen('Home', ({ navigation }) => (
  <View className="flex-1 items-center justify-center bg-black">
    <Text className="text-white text-4xl mb-8 font-bold">
      Matching Game!
    </Text>
    <Pressable
      style={styles.button}   
      onPress={() => navigation.navigate('Game', { level: 1 })}
    >
      <Text className="text-white text-2xl">Start</Text>
    </Pressable>
  </View>
));

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 50,
    width: 100,
    alignItems: 'center',
  },
});