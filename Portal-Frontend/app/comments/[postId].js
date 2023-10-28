import React, { useEffect, useState } from "react";
import {
  View,
  SafeAreaView,
  TextInput,
  Text,
  Button,
  FlatList,
  Image,
} from "react-native";
import { Stack } from "expo-router/stack";
import { useLocalSearchParams } from "expo-router";
import {
  comment,
  getComments,
  likeComment,
  unlikeComment,
} from "../../functions/user";
import { Heart } from "lucide-react-native";
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { router } from "expo-router";

const Comments = () => {
  const { postId } = useLocalSearchParams();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(null);

  const gettingComments = async () => {
    const result = await getComments(postId);
    setComments(Object.values(result));
  };

  const createComment = async () => {
    const result = await comment({ newComment: newComment, postId: postId });
    setComments([...comments, result]);
  };

  const pressedLike = async (comment) => {
    if (comment.isLiked) {
      const result = await unlikeComment(comment.id);
      var likeCount = comment.likeCount;
      result != comment.isLiked && likeCount--;
      comment.likeCount = likeCount;
      comment.isLiked = result;
      const index = comments.findIndex((item) => item.id === comment.id);
      const newComments = [...comments];
      newComments[index] = comment;
      setComments(newComments);
    } else {
      const result = await likeComment(comment.id);
      var likeCount = comment.likeCount;
      result != comment.isLiked && likeCount++;
      comment.likeCount = likeCount;
      comment.isLiked = result;
      const index = comments.findIndex((item) => item.id === comment.id);
      const newComments = [...comments];
      newComments[index] = comment;
      setComments(newComments);
    }
  };

  useEffect(() => {
    gettingComments();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <Stack.Screen
        options={{
          title: "Comments",
          headerStyle: { backgroundColor: "black" },
          headerTintColor: "white",
        }}
      />
      {comments && (
        <FlatList
          style={{ marginBottom: 85 }}
          data={comments}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 25 }}>
              {/* how to make touch area smaller */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                  // backgroundColor: "white",
                }}
                onPress={() => router.push(`/user/${item.userId}`)}
              >
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    borderWidth: 1,
                    borderColor: "black",
                    backgroundColor: "white",
                    marginLeft: 10,
                  }}
                />
                <Text style={{ color: "white", marginLeft: 10, fontSize: 25 }}>
                  {item.User.username}
                </Text>
              </TouchableOpacity>
              <Text style={{ color: "white", marginLeft: 30 }}>
                {item.comment}
              </Text>
              <TouchableWithoutFeedback
                style={{
                  alignSelf: "flex-end",
                  marginRight: 40,
                  flexDirection: "row",
                }}
                onPress={() => pressedLike(item)}
              >
                {item.isLiked ? (
                  <Heart color="rgba(0, 0, 0, 0)" size={15} fill="#ff0000" />
                ) : (
                  <Heart color="#fff" size={15} fill="#ffff" />
                )}
                <Text style={{ color: "white", marginLeft: 10 }}>
                  {item.likeCount > 0 ? item.likeCount : "Like"}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
      <View
        style={{
          position: "absolute",
          bottom: 30,
          width: "90%",
          alignSelf: "center",
        }}
      >
        <TextInput
          autoCapitalize="none"
          placeholder="Comment..."
          placeholderTextColor="black"
          style={{
            backgroundColor: "lightgrey",
            borderRadius: 50,
            fontSize: 20,
            padding: 10,
            fontWeight: "200",
          }}
          onChangeText={(text) => setNewComment(text)}
        />
        <Button title="Submit" onPress={createComment} />
      </View>
    </SafeAreaView>
  );
};

export default Comments;
