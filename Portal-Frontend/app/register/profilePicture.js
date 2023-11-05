import React, { useState, useRef, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Camera } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { postProfilePicture } from "../../functions/post";
import { AuthContext } from "../auth/AuthContext";
import { router } from "expo-router";
import {Stack} from "expo-router";

const ProfilePictureUploader = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const profilePictureRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useContext(AuthContext);
  // if (authUser === null) {
  //   router.replace("/login");
  // }
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePicture(result);
      profilePictureRef.current = true;
    }
  };

  const submitProfilePicture = async () => {
    setLoading(true);
    if (profilePicture && profilePicture.assets) {
      const formData = new FormData();
      formData.append("profilePicture", {
        uri: profilePicture.assets[0].uri,
        type: "image/jpeg", // You can adjust the type as needed
        name: "profile_picture.jpg",
      });

      try {
        // Call your function to upload the profile picture
        await postProfilePicture(formData);
        // You can add further logic like updating the user's profile with the new picture URL, etc.
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center", flexDirection:'column' }}>
    <Stack.Screen
        options= {{ headerShown: false }}
      />
    <Text style={{fontSize: 20, fontWeight:'bold', marginBottom: 100}}>Upload a Profile Picture</Text>
    <View style={{ margin: 10, width: "95%", alignItems: "center" }}>
      <Image
        source={
          profilePicture
            ? { uri: profilePicture.assets[0].uri }
            : { uri: 'https://images.unsplash.com/photo-1695664551266-ccbe1b2d9285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80' }
        }
        style={{ width: 300, height: 300, borderRadius: 150 }}
      />
      <TouchableOpacity
        onPress={pickImage}
        style={{
          width: 150,
          alignItems: "center",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "black",
          marginTop: 70,
          padding: 20
        }}
      >
        <Text style={{ fontSize: 16 }}>Upload Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={!profilePicture}
        onPress={submitProfilePicture}
        style={{
          width: 150,
          alignItems: "center",
          backgroundColor: "black",
          marginTop: 10,
          opacity: loading || !profilePicture ? 0.2 : 1.0,
        }}
      >
        <Text style={{ fontSize: 16, color: "white", paddingVertical: 6 }}>
          {loading ? "Uploading..." : "Save"}
        </Text>
      </TouchableOpacity>
    </View>
  </SafeAreaView>
  );
};

export default ProfilePictureUploader;
