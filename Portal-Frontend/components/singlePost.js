import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Video } from "expo-av";
import { Text, View, Image } from "react-native";

const SinglePost = forwardRef(({ post }, ref) => {
  const video = useRef(null);
  useImperativeHandle(ref, () => ({
    play,
    stop,
    unload,
  }));

  const play = async () => {
    if (video.current == null) {
      return;
    }
    const status = await video.current.getStatusAsync();
    if (status?.isPlaying) {
      return;
    }
    try {
      await video.current.playAsync();
    } catch (err) {
      console.log(err);
    }
  };

  const stop = async () => {
    if (video.current == null) {
      return;
    }
    const status = await video.current.getStatusAsync();
    if (!status?.isPlaying) {
      return;
    }
    try {
      await video.current.stopAsync();
    } catch (err) {
      console.log(err);
    }
  };

  const unload = async () => {
    if (video.current == null) {
      return;
    }
    try {
      await video.current.unloadAsync();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View key={post.id} style={{}}>
      {/* background video */}
      <Video
        ref={video}
        source={{
          uri: post.url,
        }}
        style={{
          width: "100%",
          // Without height undefined it won't work
          height: undefined,
          // figure out your image aspect ratio
          aspectRatio: 3 / 5,
        }}
        shouldPlay={true}
        isLooping={true}
        resizeMode="cover"
      />
      {/* user stuff at top */}
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 7,
          marginTop: 7,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100%",
        }}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
          }}
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: "black",
            backgroundColor: "white",
          }}
        />
        <Text style={{ marginLeft: 7, color: "white" }}>
          {post.user.username}
        </Text>
      </View>
      {/* caption */}
      <View
        style={{
          position: "absolute",
          marginTop: "155%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100%",
        }}
      >
        <Text
          style={{
            color: "white",
          }}
        >
          {post.description}
        </Text>
      </View>
    </View>
  );
});

export default SinglePost;
