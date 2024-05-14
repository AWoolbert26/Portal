import { Link, Stack, usePathname } from "expo-router";
import React, { useContext, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  FlatListComponent,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { getMessages, message } from "../../functions/message";
import socket from "../../utils/socket";
import { useState, useRef } from "react";
import { AuthContext } from "../auth/AuthContext";
import { getOtherProfile } from "../../functions/user";
import { Image } from "expo-image";
import { ArrowUp } from "lucide-react-native";
const Message = () => {
  const { userId } = useLocalSearchParams();

  const { authUser } = useContext(AuthContext);

  const [profile, setProfile] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);

  const listener = (...args) => {
    setMessages((oldMessages) => [...oldMessages, args[0]]);
  };

  const initMessages = async () => {
    const initialMessages = await getMessages(userId);
    setMessages(initialMessages);
  };

  const initProfile = async () => {
    const initialProfile = await getOtherProfile(userId);
    setProfile(initialProfile);
  };

  //make sure to "unlisten" when you leave or go back a page
  useEffect(() => {
    socket.on("private message", listener);
    initMessages();
    initProfile();
    //to make it unlisten when you leave the page
    return () => {
      socket.off("private message", listener);
    };
  }, []);

  //for scrolling to end
  const scrollRef = useRef(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          //for customizing header to make it a link to their profile
          title: "Message",
          headerTitle: (props) => (
            <Link href={`/user/${userId}`} style={{}}>
              <View>
                {profile && (
                  <Image
                    style={{ height: 13, width: 25, borderRadius: "100%" }}
                    source={profile.user.profilePicture}
                  />
                )}
                {profile && <Text style={{fontSize: 20}}>{profile.name}</Text>}
              </View>
            </Link>
          ),
        }}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        enabled
        keyboardVerticalOffset={91}
      >
        <ScrollView
          style={{
            marginHorizontal: 5,
            marginVertical: 5,
          }}
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current.scrollToEnd()}
        >
          {/* map thru old messages here */}
          {messages.map(({ id, text, senderId, createdAt }) => {
            return (
              <View key={id}>
                <View
                  key={id}
                  style={{
                    alignSelf:
                      senderId === authUser.id ? "flex-end" : "flex-start",
                    marginRight: senderId === authUser.id ? 0 : 30,
                    marginLeft: senderId === authUser.id ? 100 : 0,
                    backgroundColor:
                      senderId === authUser.id ? "lightblue" : "lightgrey",
                    marginVertical: 5,
                    borderBottomRightRadius: senderId === authUser.id ? 0 : 5,
                    borderBottomLeftRadius: senderId === authUser.id ? 5 : 0,
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                >
                  <Text
                    style={{
                      marginTop: 10,
                      marginBottom: 10,
                      marginHorizontal: 15,
                      fontSize: 16,

                      color: "white",
                    }}
                  >
                    {text}
                  </Text>
                  
                </View>
                <Text
                  style={{
                    marginVertical: 1,
                    marginHorizontal: 3,
                    color: "gray",
                    fontSize: 12,
                    alignSelf: "flex-end",
                  }}
                >
                  {Date(createdAt).toString().substring(0, 15)}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={{
              paddingTop: 15,
              paddingBottom: 15,
              paddingLeft: 10,
              paddingRight: 10,
              borderColor: "black",
              borderStyle: "solid",
              backgroundColor: "#CCC",
              borderRadius: 20,
              borderWidth: 0,
              marginLeft: 10,
              fontSize: 16,
              flex: 10,
            }}
            placeholder={`Message`}
            multiline
            value={text}
            onChangeText={(newText) => setText(newText)}
            //scroll the scroll view up when you click
            onPressOut={() => {
              setTimeout(() => scrollRef.current.scrollToEnd(), 50);
            }}
          />
          <TouchableOpacity
            style={{
              paddingLeft: 20,
              paddingRight: 20,
              alignItems: "center",
              justifyContent: "center",
            }}
            disabled={text ? false : true}
            onPress={() => {
              message(userId, text);
              setText("");
            }}
          >
            <ArrowUp></ArrowUp>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Message;
