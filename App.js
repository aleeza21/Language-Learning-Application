import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "./components/cameraScreen";
import SignUpScreen from "./components/signUpScreen";
import SignInScreen from "./components/signInScreen";
import ImageScreen from "./components/imageScreen";
import ImageClassifier from "./components/objectDetectionScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen
          name="CameraScreen"
          component={CameraScreen}
          options={{ title: "Camera" }}
        />
        <Stack.Screen
          name="ImageScreen"
          component={ImageScreen}
          options={{ title: "Image" }}
        />
        <Stack.Screen
          name="ImageClassifier"
          component={ImageClassifier}
          options={{ title: "Object Detection Classifier" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;