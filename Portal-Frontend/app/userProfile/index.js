import React from "react";
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
} from "react-native";
import { Stack } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useState, useEffect } from "react";
import {
  getUserInformation,
  getCategories,
  setProfile,
  getProfile,
} from "../../functions/user";
import { useForm, Controller } from "react-hook-form";
import Footer from "../../components/footer";
const ScreenWidth = Dimensions.get("window").width;
import { getUserPosts } from "../../functions/user";
import MiniPost from "../../components/miniPost";
import SinglePost from "../../components/singlePost";
import { X } from "lucide-react-native";
import { getProfilePicture } from "../../functions/user";

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
  const [username, setUsername] = useState(null);
  const [categories, setCategories] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [location, setLocation] = useState(null);
  const [occupation, setOccupation] = useState(null);
  const [bio, setBio] = useState(null);
  const [editScreenVisible, setEditScreenVisible] = useState(false);
  const show = () => setEditScreenVisible(true);
  const [followers, setFollowers] = useState(0);
  const [userPosts, setUserPosts] = useState([]);
  const numColumns = 3
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);

  useEffect(() => {
    async function fetchProfilePicture() {
      try {
        const url = await getProfilePicture();
        setProfilePictureUrl(url.profilePicture);
      } catch (error) {
        console.log(error);
      }
    }
    fetchProfilePicture();
  }, []);

  useEffect(() => {
    getUserInformation()
      .then((result) => {
        setEmail(result.data.email);
        setUsername(result.data.username);
      })
      .catch((error) => {
        console.error("Error while retrieving username:", error);
      });
  }, []);

  useEffect(() => {
    getCategories()
      .then((result) => {
        if (result && result.categories) {
          const categoryNames = result.categories.map(
            (category) => category.name
          );
          setCategories(categoryNames.join(", "));
        }
      })
      .catch((error) => {
        console.log("Error while retrieving categories:", error);
      });
  }, []);

  useEffect(() => {
    getProfile()
      .then((result) => {
        setName(result.data.name);
        setLocation(result.data.location);
        setOccupation(result.data.occupation);
        setBio(result.data.bio);
        setValue("name", result.data.name);
        setValue("location", result.data.location);
        setValue("occupation", result.data.occupation);
        setValue("bio", result.data.bio);
      })
      .catch((error) => {
        console.error("Error while retrieving profile:", error);
      });
  }, [editScreenVisible]);

  useEffect(() => {
    // Fetch and set the user's posts when the profile component loads
    getUserPosts()
      .then((posts) => {
        setUserPosts(posts);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);


  const onSubmit = async (data) => {
    try {
      await setProfile(data);
      setEditScreenVisible(!editScreenVisible);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, flexDirection: "row", marginTop: 30 }}>
          <View
            style={{
              flex: 1,
              paddingTop: 0,
              flexDirection: "column",
              marginHorizontal: 25,
            }}
          >
            <Text style={{ fontSize: 23 }}>{username}</Text>
            <Text style={{ fontSize: 18 }}>{email}</Text>
            <Text style={{fontSize: 20, marginTop: 20}}>Followers: {followers}</Text>
          </View>
          <Image
            style={{
              width: 150,
              height: 150,
              marginRight: 20,
              borderRadius: 100,
            }}
            source={{ url: profilePictureUrl || "https://images.unsplash.com/photo-1695664551266-ccbe1b2d9285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80" }}
            resizeMode={'cover'}
          />
        </View>
        <View
          style={{
            flex: 1,
            alignContent: "flex-start",
            flexDirection: "column",
            marginHorizontal: 25,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Name:{" "}
            <Text style={{ fontSize: 15, fontWeight: "400" }}>{name}</Text>
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Location:{" "}
            <Text style={{ fontSize: 15, fontWeight: "400" }}>{location}</Text>
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Occupation:{" "}
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {occupation}
            </Text>
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Bio: <Text style={{ fontSize: 15, fontWeight: "400" }}>{bio}</Text>
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>
            Interests:{" "}
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              {categories}
            </Text>
          </Text>

          <View style={{ flexDirection: 'row', marginTop: 15, justifyContent: "center" }}>
          {/* //message button */}
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: 33,
              width: 100,
              backgroundColor: "black",
              marginRight: 6,
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: 1,
              marginTop: 15,
            }}
            //onPress={show}
          >
            <Text style={{ color: "white" }}>Messages</Text>
          </TouchableOpacity>

          {/* //following button */}
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: 33,
              width: 100,
              backgroundColor: "black",
              marginRight: 6,
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: 1,
              marginTop: 15,
            }}
            //onPress={show}
          >
            <Text style={{ color: "white" }}>Following</Text>
          </TouchableOpacity>

          {/* //edit button */}
          <TouchableOpacity
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: 33,
              width: 100,
              backgroundColor: "black",
              marginRight: 6,
              borderColor: "black",
              borderStyle: "solid",
              borderWidth: 1,
              marginTop: 15,
            }}
            onPress={show}
          >
            <Text style={{ color: "white" }}>Edit</Text>
          </TouchableOpacity>
          </View>
          <Modal
            animationType="fade"
            visible={editScreenVisible}
            transparent={false}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 60,
              }}
            >
              <View
                style={{
                  margin: 20,
                  borderRadius: 20,
                  padding: 35,
                  alignItems: "center",
                  elevation: 5,
                }}
              >
                <Text style={{ fontSize: 30 }}>Edit your profile</Text>
                <Image
                  style={{
                    width: 150,
                    height: 150,
                    marginTop: 60,
                    borderRadius: 100,
                  }}
                  source={{ url: profilePictureUrl || "https://images.unsplash.com/photo-1695664551266-ccbe1b2d9285?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2787&q=80" }}
                  resizeMode={'cover'}
                />
                <View
                  style={{
                    flex: 1,
                    justifyContent: "flex-start",
                    paddingTop: 50,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      paddingVertical: 15,
                    }}
                  >
                    Name:
                  </Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={{ marginVertical: 1, borderBottomWidth: 1 }}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    name="name"
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      paddingVertical: 15,
                    }}
                  >
                    Location:
                  </Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={{ marginVertical: 1, borderBottomWidth: 1 }}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    name="location"
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      paddingVertical: 15,
                    }}
                  >
                    Occupation:
                  </Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={{ marginVertical: 1, borderBottomWidth: 1 }}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    name="occupation"
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      marginVertical: 15,
                    }}
                  >
                    Bio:
                  </Text>
                  <Controller
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        style={{ marginVertical: 1, borderBottomWidth: 1 }}
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                    name="bio"
                  />
                  <View style={{ marginTop: 60 }}>
                    <Button
                      title="Save"
                      color="black"
                      onPress={handleSubmit(onSubmit)}
                    ></Button>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
        <View
          style={{
            flex: 1,
            borderWidth: 0.5,
            marginTop: 30,
            width: ScreenWidth,
          }}
        />

          {/* posts */}

      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 4 }}>
        {userPosts.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => {
              setSelectedPost(item);
              setModalVisible(true);
            }}
          >
          <MiniPost post={item} />
         </TouchableOpacity>
        ))}
        
        <Modal 
          visible={modalVisible} 
          animationType="slide"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:'black'}}>
            <SinglePost post={selectedPost}/>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={{marginTop: 20}}><X color="white"/></TouchableOpacity>
          </View>
        </Modal>

      </View>
      </ScrollView>
      <Footer/>
    </SafeAreaView>
  );
};

export default userProfile;
