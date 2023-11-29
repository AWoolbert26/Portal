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
      style={{ flex: 1, marginTop: 15 }}
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
            justifyContent:'center', marginVertical: 20
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent:'flex-start',
              alignItems: "center",
              left: 20,
              marginVertical: 20,
              columnGap:20
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
                  "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png",
              }}
            />
            <View
              style={{
                rowGap: 2,
                justifyContent: "center"
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
              flexDirection: "row",
              justifyContent: "center",
              alignItems:'center',
              marginVertical: 20,
              width: "100%",
            }}
          >
            <Text style={{ flexWrap: "wrap" }}>{`${user.profile.bio}`}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              columnGap: 10,
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
      {user && user.posts && user.posts.length > 0 ? (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            padding: 4,
            width: "100%",
          }}
        >
          {user.posts.map((item) => (
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
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 50,
          }}
        >
          <Text>No videos available</Text>
          <TouchableOpacity
            style={{
              marginTop: 10,
              padding: 10,
              backgroundColor: "black",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white" }}>This user hasn't uploaded any videos.</Text>
          </TouchableOpacity>
        </View>
      )}

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
