import React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '@/navigation/Navigator';

type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: StackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};

export function createScreen<T extends keyof RootStackParamList>(
  screenName: T,
  content: (props: ScreenProps<T>) => React.ReactNode
) {
  const ScreenComponent = (props: ScreenProps<T>) => content(props);
  ScreenComponent.displayName = `${screenName}Screen`;
  return ScreenComponent;
}