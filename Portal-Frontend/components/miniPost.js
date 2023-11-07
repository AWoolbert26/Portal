import React from "react";
import { Video } from "expo-av";
import { View } from "react-native";

const MiniPost = ({ post }) => {
  return (
    <View style={{ width: "100%", minWidth: 120, height: 175 }}>
      <Video
        // play
        source={{ uri: post.url }}
        style={{ flex: 1, borderRadius: 8 }}
        // shouldPlay={true}
        isLooping={true}
        resizeMode="cover"
      />
    </View>
  );
};

export default MiniPost;
