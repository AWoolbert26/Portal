import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Image,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getOtherProfile, getUserWithPosts } from "../../functions/user";
import { toggleFollow, checkFollowing } from "../../functions/user";
import { Stack } from "expo-router";
import { getOtherProfilePicture } from "../../functions/user";
import { router } from "expo-router";
import MiniPost from "../../components/miniPost";
import { Modal } from "react-native";
import SinglePost from "../../components/singlePost";
import { X } from "lucide-react-native";

const Profile = () => {
  const { userId } = useLocalSearchParams();
  const [user, setUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const numColumns = 3;
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const initUserWithPosts = async () => {
    const userWithPosts = await getUserWithPosts(userId);
    setUser(userWithPosts);
  };

  const getProfileInfo = async () => {
    const check = await checkFollowing(userId);
    setIsFollowing(check);
  };

  useEffect(() => {
    initUserWithPosts();
    getProfileInfo();
  }, []);

  const handleFollowToggle = async () => {
    const isNowFollowing = await toggleFollow(user.profile.userId);
    setIsFollowing(isNowFollowing);
  };

  const message = () => {
    router.push(`messages/${userId}`);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", marginTop: 15, width: "100%" }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          title: user ? `${user.profile.name}` : "Profile",
        }}
      />
      {user && (
        <View
          style={{
            margin: "2.5%",
            minWidth: "95%",
            gap: 5,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Image
              style={{
                width: 100,
                height: 100,
                borderRadius: 100,
                // borderWidth: 3,
              }}
              source={{
                uri:
                  user.profilePicture ||
                  "https://images.unsplash.com/photo-1695664551266-ccbe1b2d9285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80",
              }}
            />
            <View
              style={{
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Text style={{ fontSize: 24, fontWeight: "700" }}>
                {user.profile.name}
              </Text>
              <Text style={{ fontSize: 20 }}>{`@${user.username}`}</Text>

              <Text>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  Occupation:
                </Text>{" "}
                {user.profile.occupation}
              </Text>
              <Text>
                <Text style={{ fontWeight: "700", fontSize: 16 }}>
                  Location:
                </Text>{" "}
                {user.profile.location}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              width: "100%",
            }}
          >
            <Text style={{ flexWrap: "wrap" }}>{`${user.profile.bio}`}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              gap: 10,
            }}
          >
            <TouchableOpacity
              style={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: isFollowing ? "transparent" : "black",
                backgroundColor: isFollowing ? "black" : "transparent",
              }}
              onPress={handleFollowToggle}
            >
              <Text
                style={{ padding: 10, color: isFollowing ? "white" : "black" }}
              >
                {isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderStyle: "solid",
                borderWidth: 1,
                borderColor: "black",
                backgroundColor: "transparent",
              }}
              onPress={message}
            >
              <Text style={{ padding: 10, color: "black" }}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* posts */}
      <ScrollView
        style={{
          padding: 4,
          width: "100%",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "space-between",
            padding: 4,
            width: "100%",
          }}
        >
          {user &&
            user.posts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  width: "32%",
                }}
                onPress={() => {
                  setSelectedPost(item);
                  setModalVisible(true);
                }}
              >
                <MiniPost post={item} />
              </TouchableOpacity>
            ))}
        </View>

        <Modal visible={modalVisible} animationType="slide">
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "black",
            }}
          >
            <SinglePost post={selectedPost} />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={{ marginTop: 20 }}
            >
              <X color="white" />
            </TouchableOpacity>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
