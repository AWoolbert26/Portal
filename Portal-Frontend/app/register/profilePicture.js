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
import { Stack } from "expo-router";

const ProfilePictureUploader = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const profilePictureRef = useRef(false);
  const [loading, setLoading] = useState(false);
  const { authUser, setAuthUser } = useContext(AuthContext);
  if (authUser === null) {
    router.replace("/login");
  }

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

  const skip = () => {
    router.replace("/home");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 100 }}>
        Upload a Profile Picture
      </Text>
      <View style={{ margin: 10, width: "95%", alignItems: "center" }}>
        <Image
          source={
            profilePicture
              ? { uri: profilePicture.assets[0].uri }
              : {
                  uri: "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png",
                }
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
            padding: 20,
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
        <TouchableOpacity
          onPress={skip}
          style={{
            width: 150,
            alignItems: "center",
            backgroundColor: "black",
            marginTop: 10,
            opacity: 1.0,
          }}
        >
          <Text style={{ fontSize: 16, color: "white", paddingVertical: 6 }}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProfilePictureUploader;
