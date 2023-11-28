import React, { useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Button,
  TextInput,
  Modal,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Footer from "../../components/footer";
const ScreenWidth = Dimensions.get("window").width;
import MiniPost from "../../components/miniPost";
import SinglePost from "../../components/singlePost";
import { X } from "lucide-react-native";
import { router } from "expo-router";
import { getUserWithPosts } from "../../functions/user";
import { AuthContext } from "../auth/AuthContext";
import { setProfile } from "../../functions/user";

const userProfile = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    values,
  } = useForm({
    defaultValues: {
      name: "",
      location: "",
      occupation: "",
      bio: "",
    },
    values,
  });
  const [user, setUser] = useState(null);
  const { authUser } = useContext(AuthContext);
  const [editScreenVisible, setEditScreenVisible] = useState(false);
  const show = () => setEditScreenVisible(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const initUserWithPosts = async () => {
    const userWithPosts = await getUserWithPosts(authUser.id);
    setUser(userWithPosts);
  };

  useEffect(() => {
    if (authUser) {
      initUserWithPosts();
    }
  }, []);

  const onSubmit = async (data) => {
    try {
      //refetch user info
      setProfile(data);
      initUserWithPosts();
      setEditScreenVisible(!editScreenVisible);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        width: "100%",
        gap: 10,
      }}
    >
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          title: "My Profile",
        }}
      />

      {user && (
        <>
          <View
            style={{
              flexDirection: "row",
              marginTop: 30,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                marginLeft: 25,
              }}
            >
              <Text style={{ fontSize: 28, fontWeight: "700" }}>
                {user.username}
              </Text>
              <Text style={{ fontSize: 24 }}>{user.email}</Text>
              <Text style={{ fontSize: 18 }}>
                Followers: {user._count.followers}
              </Text>
            </View>
            <Image
              style={{
                width: 150,
                height: 150,
                marginRight: 20,
                borderRadius: 100,
              }}
              source={{
                url:
                  user.profilePicture ||
                  "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png",
              }}
              resizeMode={"cover"}
            />
          </View>
          <View
            style={{
              alignContent: "flex-start",
              flexDirection: "column",
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Name:{" "}
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                {user.profile.name}
              </Text>
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Location:{" "}
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                {user.profile.location}
              </Text>
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Occupation:{" "}
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                {user.profile.occupation}
              </Text>
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Bio:{" "}
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                {user.profile.bio}
              </Text>
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              Interests:{" "}
              <Text style={{ fontSize: 15, fontWeight: "400" }}>
                {user.categories.map((item) => item.name).join(", ")}
              </Text>
            </Text>

            {editScreenVisible && (
              <Modal
                animationType="fade"
                visible={editScreenVisible}
                transparent={false}
                style={{}}
              >
                <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 60,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: 300,
                      }}
                    >
                      Edit your profile
                    </Text>
                    <Image
                      style={{
                        height: 150,
                        aspectRatio: 1,
                        marginTop: 20,
                        borderRadius: 250,
                      }}
                      source={{
                        url:
                          user.profilePicture ||
                          "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png",
                      }}
                      resizeMode={"cover"}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-start",
                        paddingTop: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          paddingVertical: 15,
                        }}
                      >
                        Name:
                      </Text>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={{
                              marginVertical: 1,
                              borderBottomWidth: 1,
                              borderWidth: 1,
                              width: 200,
                              height: 45,
                              borderRadius: 10,
                            }}
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                        name="name"
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          paddingVertical: 15,
                        }}
                      >
                        Location:
                      </Text>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={{
                              marginVertical: 1,
                              borderBottomWidth: 1,
                              borderWidth: 1,
                              width: 200,
                              height: 45,
                              borderRadius: 10,
                            }}
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                        name="location"
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          paddingVertical: 15,
                        }}
                      >
                        Occupation:
                      </Text>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={{
                              marginVertical: 1,
                              borderBottomWidth: 1,
                              borderWidth: 1,
                              width: 200,
                              height: 45,
                              borderRadius: 10,
                            }}
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                        name="occupation"
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          marginVertical: 15,
                        }}
                      >
                        Bio:
                      </Text>
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextInput
                            style={{
                              marginVertical: 1,
                              borderBottomWidth: 1,
                              borderWidth: 1,
                              width: 200,
                              height: 45,
                              borderRadius: 10,
                            }}
                            value={value}
                            onChangeText={onChange}
                          />
                        )}
                        name="bio"
                      />
                      <View style={{ marginTop: 30 }}>
                        <Button
                          title="Save"
                          color="black"
                          onPress={handleSubmit(onSubmit)}
                        ></Button>
                      </View>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 15,
              justifyContent: "center",
              alignSelf: "center",
              columnGap: 5,
            }}
          >
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",
                height: 33,
                width: 100,
                backgroundColor: "black",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
              }}
              onPress={() => router.push("/messages")}
            >
              <Text style={{ color: "white" }}>Messages</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",

                height: 33,
                width: 100,
                backgroundColor: "black",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
              }}
              //onPress={show}
            >
              <Text style={{ color: "white" }}>Following</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignItems: "center",

                height: 33,
                width: 100,
                backgroundColor: "black",
                borderColor: "black",
                borderStyle: "solid",
                borderWidth: 1,
              }}
              onPress={show}
            >
              <Text style={{ color: "white" }}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{ width: ScreenWidth, color: "black", borderWidth: 1 }}
          ></View>
        </>
      )}

      {/* posts */}
      <ScrollView
        style={{
          padding: 4,
          width: "100%",
          marginBottom: 50,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 2,
            // justifyContent: "space-between",
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
      <Footer />
    </SafeAreaView>
  );
};

export default userProfile;
