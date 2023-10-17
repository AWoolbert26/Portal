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

const Profile = () => {
  const { userId } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);

  const getProfileInfo = async () => {
    const receivedProfile = await getOtherProfile(userId);
    setProfile(receivedProfile);
    console.log(receivedProfile);
  };
  useEffect(() => {
    getProfileInfo();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        style={{
          width: 150,
          height: 150,
          marginRight: 20,
          borderRadius: 100,
        }}
        source={{
          uri: "https://images.unsplash.com/photo-1695664551266-ccbe1b2d9285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
        }}
      />
      {profile && (
        <View>
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
            <Text style={{ padding: 5 }}>Follow</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Profile;
