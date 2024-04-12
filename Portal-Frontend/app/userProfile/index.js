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
import MiniPost from "../../components/miniPost";
import SinglePost from "../../components/singlePost";
import { Divide, X } from "lucide-react-native";
import { router } from "expo-router";
import { getUserWithPosts } from "../../functions/user";
import { AuthContext } from "../auth/AuthContext";
import { setProfile } from "../../functions/user";
import { Pencil } from "lucide-react-native";
import { Card, Divider } from "@ui-kitten/components";

const ScreenWidth = Dimensions.get("window").width;
const gap = 12;
const vidsPerRow = 3;
const totalGapSize = (vidsPerRow - 1) * gap;
const childWidth = (ScreenWidth - totalGapSize) / vidsPerRow;

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
  const [isLoading, setIsLoading] = useState(true);

  const initUserWithPosts = async () => {
    const userWithPosts = await getUserWithPosts(authUser.id);
    setUser(userWithPosts);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userWithPosts = await getUserWithPosts(authUser.id);
        setUser(userWithPosts);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
        setIsLoading(false);
      }
    };
    if (authUser) {
      fetchData(); // Call the data fetching function
    }
  }, [authUser]);

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
        backgroundColor: "white",
      }}
    >

      {/* 
          I'm not sure why the stack screen at this location ends up going to the home screen
          debugging is required. 
      */}
      {/* <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "transparent" },
          headerTransparent: true,
          title: "My Profile",
        }}
      /> */}

      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackTitle: "Home",
        }}
      />

      <ScrollView
        style={
          {
            //  margin: 1
          }
        }
      >
        {user && (
          <>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Image
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 100,
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

              <TouchableOpacity
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  height: 40,
                  width: 100,
                  backgroundColor: "black",
                  borderRadius: 50,
                  borderColor: "black",
                  borderStyle: "solid",
                  borderWidth: 1,
                }}
                onPress={show}
              >
                <Text style={{ color: "white" }}>
                  EDIT
                  <Pencil color="white" size={16} style={{ marginLeft: 15 }} />
                </Text>
              </TouchableOpacity>

              <Divider />
            </View>

            <Card
              style={{ backgroundColor: "transparent", marginVertical: 20 }}
            >
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                About me {"\n"}
                {""}
                <Text style={{ fontSize: 15, fontWeight: "400" }}>
                  {user.profile.bio}
                </Text>
              </Text>
              <View
                style={{
                  alignContent: "flex-start",
                  flexDirection: "column",
                  marginTop: 20,
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
                  Interests:{" "}
                  <Text style={{ fontSize: 15, fontWeight: "400" }}>
                    {user.categories.map((item) => item.name).join(", ")}
                  </Text>
                </Text>

                {editScreenVisible && (
                  <Modal
                    animationType="slide"
                    visible={editScreenVisible}
                    transparent={true}
                    style={{}}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => Keyboard.dismiss()}
                    >
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: "black",
                          height: "100%",
                          width: "60%",
                        }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: 20,
                          }}
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              paddingVertical: 15,
                              color: "white",
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
                                  borderColor: "white",
                                  color: "white",
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
                              color: "white",
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
                                  borderColor: "white",
                                  color: "white",
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
                              color: "white",
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
                                  borderColor: "white",
                                  color: "white",
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
                              color: "white",
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
                                  borderColor: "white",
                                  color: "white",
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
                              color="white"
                              onPress={handleSubmit(onSubmit)}
                            ></Button>
                          </View>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                )}
              </View>
            </Card>
          </>
        )}
        <Divider style={{ paddingBottom: 2 }} />
        {/* posts */}
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            marginVertical: -(gap / 2),
            marginHorizontal: -(gap / 2),
            gap: 1,
          }}
        >
          {user &&
            user.posts.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  minWidth: childWidth,
                  maxWidth: childWidth,
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


        <View
          style={{
            
          }}
        >
          
        </View>

      </ScrollView>
      <Footer />
    </SafeAreaView>
  );
};

export default userProfile;
