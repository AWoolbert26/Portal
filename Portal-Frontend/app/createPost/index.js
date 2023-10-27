import React, { useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { post } from "../../functions/post";
import { Video } from "expo-av";
import { Keyboard } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import { Stack } from "expo-router";

//error check for null description and fix case where no video was uploaded
const CreatePost = () => {
  const [video, setVideo] = useState(null);
  const [description, setDescription] = useState("");

  const videoRef = useRef(false);
  const [status, setStatus] = useState({});

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
    console.log(description);
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
      <View
        style={{
          margin: 10,
          width: "95%",
          alignItems: "center",
          flex: 1.3,
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
        <TouchableOpacity
          style={{
            backgroundColor: "black",
            padding: 8,
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            alignSelf: "flex-end",
          }}
          onPress={hideKeyboard}
        >
          <FontAwesomeIcon
            size={32}
            style={{ color: "white" }}
            icon={faKeyboard}
          />
        </TouchableOpacity>
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
        <Text style={{ fontSize: 24, fontWeight: "300", paddingVertical: 6 }}>
          Upload Video
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={video === null || description === "" ? true : false}
        onPress={submit}
        style={{
          width: "95%",
          alignItems: "center",
          backgroundColor: "black",
          marginTop: 5,
          opacity: loading || video === null || description === "" ? 0.2 : 1.0,
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
    </SafeAreaView>
  );
};

export default CreatePost;
