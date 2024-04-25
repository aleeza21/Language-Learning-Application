import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { stylesSignUp } from "./style";

const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigation = useNavigation();

  const handleSignUp = () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((auth) => {
        if (auth) {
          navigation.reset({
            index: 0,
            routes: [{ name: "CameraScreen" }],
          });
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View style={stylesSignUp.container}>
      <Text style={stylesSignUp.title}>Sign Up</Text>
      {error ? <Text style={stylesSignUp.error}>{error}</Text> : null}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={stylesSignUp.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={stylesSignUp.input}
        secureTextEntry={true}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={stylesSignUp.input}
        secureTextEntry={true}
      />
      <Pressable onPress={handleSignUp} style={stylesSignUp.button}>
        <Text style={stylesSignUp.buttonText}>Sign Up</Text>
      </Pressable>
      <View style={stylesSignUp.footer}>
        <Text>Already have an account?</Text>
        <Pressable onPress={() => navigation.navigate("SignIn")}>
          <Text style={stylesSignUp.link}>Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignUpScreen;
