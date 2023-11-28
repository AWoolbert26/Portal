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
import { Heart, MessageSquare, Minus } from "lucide-react-native";
import {
  likePost,
  unlikePost,
  getPostInfo,
  toggleFollow,
} from "../functions/user";
import { router } from "expo-router";
import FollowButton from "./FollowButton";

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

  return (
    <View key={post.id} style={{}}>
      {/* user stuff at top */}
      <View
        style={{
          position: "absolute",
          flexDirection: "row",
          paddingLeft: 7,
          marginTop: 7,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          width: "100%",
          zIndex: 2,
          padding: 10,
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
              color: "white",
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
        {/* <FollowButton id={post.user.id} follows={true} /> */}
      </View>
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
            width: "100%",
            // Without height undefined it won't work
            height: undefined,
            // figure out your image aspect ratio
            aspectRatio: 3 / 5,
          }}
          shouldPlay={false}
          isLooping={true}
          resizeMode="cover"
        />
        {/* caption */}
        <View
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            width: "100%",
            bottom: 20,
          }}
        >
          {!captionOpen || !postInfo ? (
            <Text
              style={{
                color: "white",
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
        </View>
        {/* post like bar and comment bar on side */}
        {postInfo && (
          <View
            style={{
              position: "absolute",
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              rowGap: 20,
              alignItems: "center",
              top: "40%",
              padding: 15,
              borderRadius: 50,
              right: 5,
            }}
          >
            <TouchableWithoutFeedback
              style={{ alignItems: "center" }}
              onPress={pressedLike}
            >
              {postInfo.isLiked ? (
                <Heart color="rgba(0, 0, 0, 0)" size={35} fill="#ff0000" />
              ) : (
                <Heart color="#fff" size={35} />
              )}
              <Text style={{ color: "white" }}>{postInfo.likeCount}</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={{ alignItems: "center" }}
              onPress={openComments}
            >
              <MessageSquare color="#fff" size={35}></MessageSquare>
              <Text style={{ color: "white" }}>{postInfo.commentCount}</Text>
            </TouchableWithoutFeedback>
          </View>
        )}
      </TouchableWithoutFeedback>
    </View>
  );
});

export default SinglePost;
