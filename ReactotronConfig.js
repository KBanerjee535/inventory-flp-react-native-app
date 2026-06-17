import Reactotron from 'reactotron-react-native';

Reactotron
  .configure({
    host: 'localhost', // Required for Android emulator redirection
    port: 9090,        // Default Reactotron port
  })
  .useReactNative()    // Adds built-in React Native plugins
  .connect();          // Connects to the desktop client
