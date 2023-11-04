import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { getOtherProfile } from "../../functions/user";
import { toggleFollow } from "../../functions/user";
import { Stack } from "expo-router";

const Profile = () => {
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);

  const getProfileInfo = async () => {
    const receivedProfile = await getOtherProfile(userId);
    setProfile(receivedProfile);
  };
  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", gap: 20, marginTop: 15 }}
    >
      <Stack.Screen
        options={{
          title: "",
          headerStyle: { backgroundColor: 'transparent'},
          headerTransparent: true
        }}
      />
      {profile && (
        <>
          <Image
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              borderWidth: 3,
            }}
            source={{
              uri: "https://images.unsplash.com/photo-1695664551266-ccbe1b2d9285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
            }}
          />
          <Text>Name: {profile.name}</Text>
          <Text>Bio: {profile.bio}</Text>
          <Text>Location: {profile.location}</Text>
          <Text>Occupation: {profile.occupation}</Text>
          <TouchableOpacity
            style={{
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "black",
            }}
            onPress={() => toggleFollow(profile.userId)}
          >
            <Text style={{ padding: 10 }}>Follow</Text>
          </TouchableOpacity>
        </>
      )}
    </SafeAreaView>
  );
};

export default Profile;
