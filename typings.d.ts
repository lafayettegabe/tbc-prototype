import { 
  ViewProps as RNViewProps,
  TextProps as RNTextProps,
  ButtonProps as RNButtonProps,
} from 'react-native';

interface TailwindComponentProps {
  className?: string;
}

declare module 'react-native' {
  export interface ViewProps extends TailwindComponentProps, RNViewProps {}
  export interface TextProps extends TailwindComponentProps, RNTextProps {}
}