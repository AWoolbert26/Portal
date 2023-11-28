import React, {
  useState,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Video } from "expo-av";
import { Text, View, Image, Touchable } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Heart, MessageCircle, Tags } from "lucide-react-native";
import {
  likePost,
  unlikePost,
  getPostInfo,
  toggleFollow,
} from "../functions/user";
import { router } from "expo-router";
import FollowButton from "./FollowButton";
import { Card } from "@ui-kitten/components";

const SinglePost = forwardRef(({ post }, ref) => {
  const [captionOpen, setCaptionOpen] = useState(false);
  const [postInfo, setPostInfo] = useState(null);

  const toggleCaption = async () => {
    setCaptionOpen(!captionOpen);
  };

  const pressedLike = async () => {
    try {
      if (postInfo.isLiked) {
        const result = await unlikePost(post.id);
        var likeCount = postInfo.likeCount;
        result != postInfo.isLiked && likeCount--;
        setPostInfo({
          ...postInfo,
          isLiked: result,
          likeCount: likeCount,
        });
      } else {
        const result = await likePost(post.id);
        var likeCount = postInfo.likeCount;
        result != postInfo.isLiked && likeCount++;
        setPostInfo({ ...postInfo, isLiked: result, likeCount: likeCount });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const openComments = () => {
    setCaptionOpen(false);
    router.push("/comments/" + post.id);
  };

  const video = useRef(null);
  useImperativeHandle(ref, () => ({
    play,
    stop,
    unload,
  }));

  const loadInfo = async () => {
    try {
      const postInfo = await getPostInfo(post.id);
      setPostInfo(postInfo);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (captionOpen) {
      loadInfo();
    }
  }, [captionOpen]);

  useEffect(() => {
    //fetch like info on load
    loadInfo();
    return () => unload();
  }, []);

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

  const Header = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          paddingLeft: 7,
          backgroundColor: "transparent",
          width: "100%",
          zIndex: 2,
          paddingVertical: 10,
        }}
      >      
      <TouchableWithoutFeedback
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 7,
        }}
        onPress={() => router.push(`/user/${post.userId}`)}
      >
      <Image
        source={{
          uri: post.user.profilePicture,
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
        <Text
          style={{
            color: "black",
            fontWeight: 700,
            fontSize: 24,
          }}
        >
          {post.user.username}
        </Text>
        <Text
          style={{
            color: "white",
            fontSize: 20,
          }}
        >
          {post.user.profile.name}
        </Text>
      </TouchableWithoutFeedback>
    </View>
    )
  }

  const Footer = () => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          width: "100%",
          paddingVertical: 20,
          justifyContent:'space-between',
          flexDirection:'row'
        }}
      >
        {!captionOpen || !postInfo ? (
            <Text
              style={{
                color: "white",
                marginLeft: 10,
                fontSize: 16
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {post.description}
            </Text>
          ) : (
          <View>
            <Text
              style={{
                color: "white",
              }}
            >
              {post.description}
            </Text>
          </View>
        )}
        {postInfo && (
          <View
            style={{
              backgroundColor: 'black',
              width: 120,
              height: 45,
              columnGap: 20,
              alignItems: 'center',
              padding: 15,
              borderRadius: 50,
              right: 20,
              flexDirection:'row',
            }}
          >
            <TouchableWithoutFeedback
              style={{ alignItems: "center", flexDirection:'row', columnGap:10}}
              onPress={openComments}
            >
              <MessageCircle color="white" fill="white" size={23}></MessageCircle>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback
              style={{ alignItems: "center", flexDirection:'row', columnGap:10}}
              onPress={pressedLike}
            >
              {postInfo.isLiked ? (
                <Heart color="rgba(0, 0, 0, 0)" size={23} fill="#ff0000" />
              ) : (
                <Heart color="white" fill="white" size={23} />
              )}
              <Text style={{ color: "white", fontWeight:'bold' }}>{postInfo.likeCount}</Text>
            </TouchableWithoutFeedback>
          </View>
        )}
        </View>
    )
  }
  return (
    <View key={post.id} style={{}}>
      {/* user stuff at top */}
      <Card header={Header} footer={Footer}>
        {/* <FollowButton id={post.user.id} follows={true} /> */}
      <TouchableWithoutFeedback
        style={{ position: "relative" }}
        onPress={toggleCaption}
      >
        {/* background video */}
        <Video
          ref={video}
          source={{
            uri: post.url,
          }}
          style={{
            width: 400,
            marginVertical: 10,
            height: 400,
            borderRadius: 10,
            alignSelf:'center',
            aspectRatio:1/1,
          }}
          shouldPlay={false}
          isLooping={true}
          resizeMode="cover"
        />
        {/* post like bar and comment bar on side */}
      </TouchableWithoutFeedback>
      </Card>
    </View>
  );
});

export default SinglePost;
