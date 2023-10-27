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
import { comment, getComments } from "../../functions/user";
import { Heart } from "lucide-react-native";

const Comments = () => {
  const { postId } = useLocalSearchParams();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(null);

  const gettingComments = async () => {
    console.log("getting comments");
    const result = await getComments(postId);
    console.log(result);
    setComments(result);
  };

  const handleSubmit = async () => {
    const result = await comment({ newComment: newComment, postId: postId });
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
          style={{ marginBottom: 47 }}
          data={comments}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 25 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 15,
                }}
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
              </View>
              <Text style={{ color: "white", marginLeft: 30 }}>
                {item.comment}
              </Text>
              <View
                style={{
                  alignSelf: "flex-end",
                  marginRight: 40,
                  flexDirection: "row",
                }}
              >
                <Heart color="#fff" size={15} fill="#ffff" />
                <Text style={{ color: "white", marginLeft: 10 }}>Like</Text>
              </View>
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
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
};

export default Comments;
