import Reactotron from 'reactotron-react-native';

if (__DEV__) {
  Reactotron
    .configure({
      host: 'localhost', // Required for Android emulator redirection
      port: 9090,  // Name displayed in Reactotron
    })
    .useReactNative() // Adds built-in React Native plugins
    .connect(); // Connects to the desktop app

  // Optional: Clear Reactotron on every app reload
  Reactotron.clear();
}