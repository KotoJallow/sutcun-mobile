import React from 'react';// Import the global.css file in the index.js file:
import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import { Provider } from 'react-redux';
import { store } from './src/redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  );
}
