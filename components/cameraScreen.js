import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Alert, Platform, TouchableOpacity } from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { auth } from "../firebase";
import { stylesHome, stylesCamera } from "./style";

const CameraScreen = () => {
  const navigation = useNavigation();

  // used this hook to prevent camera from black screen
  const isFocused = useIsFocused();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: "SignIn" }],
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const [cameraPermission, setCameraPermission] = useState(null);
  const [imagePermission, setImagePermission] = useState(null);
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState(null);

  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const permissionFunction = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    console.log(cameraPermission.status);
    setCameraPermission(cameraPermission.status === "granted");

    const imagePermission = await ImagePicker.getMediaLibraryPermissionsAsync();
    console.log(imagePermission.status);
    setImagePermission(imagePermission.status === "granted");

    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
    console.log(mediaLibraryPermission.status);
    setMediaLibraryPermission(mediaLibraryPermission.status === "granted");

    if (
      imagePermission.status !== "granted" &&
      cameraPermission.status !== "granted" &&
      mediaLibraryPermission.status !== "granted"
    ) {
      Alert.alert("Permission for media access needed.");
    }
  };

  useEffect(() => {
    permissionFunction();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null);
      console.log("URI", data.uri);
      await saveImageToGallery(data.uri);
      setImageUri(data.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
      presentationStyle: 0,
    });
    console.log("result assets", result.assets);
    console.log("result", result.assets[0].uri);
    // console.log(result);  // its causes WARN Key "cancelled" in the image picker result is deprecated and will be removed in SDK 48, use "canceled" instead
    if (!result.canceled) {
      navigation.navigate("ImageScreen", { uri: result.assets[0].uri });
    }
  };

  const saveImageToGallery = async (uri) => {
    if (mediaLibraryPermission) {
      try {
        const asset = await MediaLibrary.createAssetAsync(uri);
        console.log("Asset:", asset);
        if (Platform.OS === "android") {
          MediaLibrary.createAlbumAsync("Images", asset, false)
            .then(() => {
              console.log("File Saved Successfully!");
            })
            .catch((e) => {
              console.log("Error In Saving File!", e);
            });
        } else {
          MediaLibrary.createAlbumAsync("Images", [asset], false)
            .then(() => {
              console.log("File Saved Successfully!");
            })
            .catch((e) => {
              console.log("Error In Saving File!", e);
            });
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Need Storage permission to save file");
    }
  };

  const handleClassifier = () => {
    navigation.navigate("ImageClassifier");
  };

  const Menu = () => {
    return (
      <View style={stylesHome.menuContainer}>
        <TouchableOpacity onPress={takePicture} style={stylesHome.menuButton}>
          <Text style={stylesHome.menuButtonText}>Capture</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage} style={stylesHome.menuButton}>
          <Text style={stylesHome.menuButtonText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOut} style={stylesHome.menuButton}>
          <Text style={stylesHome.menuButtonText}>Sign Out</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleClassifier} style={stylesHome.menuButton}>
          <Text style={stylesHome.menuButtonText}>Classifier</Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (
    cameraPermission === null ||
    imagePermission === null ||
    mediaLibraryPermission === null
  ) {
    return <View />;
  }
  if (
    cameraPermission === false ||
    imagePermission === false ||
    mediaLibraryPermission === false
  ) {
    return <Text>No access to camera or gallery</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={stylesHome.container}>
        <Text style={stylesHome.title}>Welcome to Camera App!</Text>
      </View>

      <View style={stylesCamera.cameraContainer}>
        {isFocused && (
          <Camera
            ref={(ref) => setCamera(ref)}
            style={stylesCamera.fixedRatio}
            type={type}
            ratio={"1:1"}
          />
        )}
      </View>
      <Menu />
    </View>
  );
};

export default CameraScreen;
