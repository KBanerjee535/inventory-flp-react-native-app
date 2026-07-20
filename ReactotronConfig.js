import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({
    host: '10.0.2.2', // Required for Android emulator to access localhost
    port: 9090,        // Default Reactotron port
  })
  .useReactNative()    // Adds built-in React Native plugins
  .connect();          // Connects to the desktop client
