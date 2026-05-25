const navigationHistory = []; // Store navigation history manually

export const navigateToScreen = (navigation, screenName) => {
  if (
    navigationHistory.length === 0 ||
    navigationHistory[navigationHistory.length - 1] !== screenName
  ) {
    navigationHistory.push(screenName); // Push only if it's a new screen
  }
  navigation.navigate(screenName);
};

export const handleBack = navigation => {
  if (navigationHistory.length > 1) {
    navigationHistory.pop(); // Remove current screen
    const lastScreen = navigationHistory[navigationHistory.length - 1]; // Get last visited screen
    navigation.navigate(lastScreen);
  } else {
    console.log('No previous screen');
  }
};
