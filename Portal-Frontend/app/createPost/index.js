import React, { useRef, useState, useEffect } from "react";
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { post } from "../../functions/post";
import { Video } from "expo-av";
import { Keyboard } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { Stack } from "expo-router";
import { getCategories } from "../../functions/user";
import { Picker } from "@react-native-picker/picker";

//error check for null description and fix case where no video was uploaded
const CreatePost = () => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");

  const videoRef = useRef(false);
  const [status, setStatus] = useState({});

  // const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState({});

  const categories = {
    1: "Law",
    2: "Computer Science",
    3: "Business",
    4: "Politics",
    5: "Mechanical Engineering",
    6: "Art",
    7: "Retail",
    8: "Agriculture",
    9: "Sales",
    10: "Healthcare",
    11: "Media and Entertainment",
  }; // should we limit what categories each creator can post to?
  // const getUsercategories = async () => {
  //   try {
  //     const gotCategories = await getCategories();

  //     const formatedCategories = {};

  //     gotCategories.categories.forEach((category) => {
  //       formatedCategories[category.id] = category.name;
  //     });
  //     setCategories(formatedCategories);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const pressed = (id) => {
    if (selectedCategories[id] === undefined) {
      //if not already selected
      setSelectedCategories((current) => {
        current[id] = categories[id];
        return { ...current };
      });
    } else {
      // console.log("here ", )
      setSelectedCategories((current) => {
        delete current[id];

        return { ...current };
      });
    }
  };

  const getColor = (id) => {
    //works, but color rerender doesn't work
    if (id in selectedCategories) {
      return "#5481C6";
    }
    return "black";
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      videoMaxDuration: 300, //5 minutes
      quality: 1,
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      setVideo(result.assets[0]);
      videoRef.current = true;
    }
  };

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    const body = new FormData();
    body.append("video", {
      uri:
        Platform.OS === "android"
          ? video.uri
          : video.uri.replace("file://", ""),
      type: video.type + "/mov", //needs to be something/mov
      name: "video.mov",
    });
    body.append("description", description);
    const stringifyedCategories = JSON.stringify(selectedCategories);
    body.append("categories", stringifyedCategories);

    await post(body);
  };

  const hideKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={{ flex: 10, alignItems: "center" }}>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackTitle: "Home",
        }}
      />
      <TouchableWithoutFeedback onPress={hideKeyboard}>
        <View style={{ flex: 1, alignItems: "center", width: "100%" }}>
          <View
            style={{
              margin: 10,
              width: "95%",
              alignItems: "center",
              flex: 1,
            }}
          >
            <TextInput
              multiline={true}
              style={{
                flexDirection: "row",
                width: "100%",
                borderColor: "black",
                borderWidth: 1,
                padding: 10,
                flex: 1,
                alignItems: "flex-start",
                maxHeight: 150,
              }}
              placeholder="Description"
              onChangeText={(text) => setDescription(text)}
              value={description}
            />

            <ScrollView
              horizontal={true}
              style={{
                flex: 1,
                maxHeight: 30,
                width: "100%",
                backgroundColor: "black",
              }}
            >
              {/* wrapper view allows scroll view to work because touchable without feedback wrapper usually prevents it */}
              <View onStartShouldSetResponder={() => true}>
                <Text
                  style={{
                    color: "white",
                    marginHorizontal: 5,
                    marginVertical: 5,
                  }}
                >
                  {selectedCategories
                    ? Object.values(selectedCategories).join(", ")
                    : "Select categories below..."}
                </Text>
              </View>
            </ScrollView>

            {/* selectable categories */}
            <View
              style={{
                flexDirection: "row",
                gap: 10,
                alignItems: "center",
                marginTop: 10,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <ScrollView horizontal={true} style={{ paddingBottom: 10 }}>
                {categories &&
                  Object.entries(categories).map(([id, name]) => {
                    return (
                      <TouchableOpacity
                        key={id}
                        onPress={() => pressed(id)}
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                          padding: 10,
                          borderColor: getColor(id),
                          borderStyle: "solid",
                          borderWidth: 1,
                        }}
                      >
                        <Text
                          style={{
                            color: getColor(id),
                          }}
                        >
                          {name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
              </ScrollView>
            </View>
          </View>

          {/* audio only plays if phone not on silent */}
          {video && (
            <Video
              ref={videoRef}
              style={{
                width: "95%",
                flex: 3,
                margin: 3,
              }}
              source={{
                uri: video.uri,
              }}
              useNativeControls
              ignoreSilentSwitch
              // resizeMode={ResizeMode.CONTAIN}
              isLooping
              onPlaybackStatusUpdate={(status) => setStatus(() => status)}
            />
          )}

          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: "95%",
              alignItems: "center",
              borderStyle: "solid",
              borderWidth: 1,
              borderColor: "black",
              marginTop: "auto",
            }}
          >
            <Text
              style={{ fontSize: 24, fontWeight: "300", paddingVertical: 6 }}
            >
              Upload Video
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              video === null ||
              description === "" ||
              Object.keys(selectedCategories).length === 0
                ? true
                : false
            }
            onPress={submit}
            style={{
              width: "95%",
              alignItems: "center",
              backgroundColor: "black",
              marginTop: 5,
              opacity:
                loading ||
                video === null ||
                description === "" ||
                Object.keys(selectedCategories).length === 0
                  ? 0.2
                  : 1.0,
            }}
          >
            <Text
              style={{
                fontSize: 48,
                color: "white",
                fontWeight: "300",
                paddingVertical: 6,
              }}
            >
              {loading ? "Posting..." : "Post"}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default CreatePost;
