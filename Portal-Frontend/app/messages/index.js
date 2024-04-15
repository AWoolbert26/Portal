import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";
import { getMessagedUsers } from "../../functions/message";
import { Link, Stack } from "expo-router";
import { Image } from "expo-image";

const Messages = () => {
  const [users, setUsers] = useState([]);

  const initUsers = async () => {
    const messagedUsers = await getMessagedUsers();
    console.log(messagedUsers);
    setUsers(messagedUsers);
  };

  useEffect(() => {
    initUsers();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          title: "Direct Messages",
        }}
      />
      <ScrollView style={{ flex: 1, padding: 10 }}>
        {users.map((user) => {
          return (
            <View
              style={{
                flex: 1,
                borderBottomWidth: 1,
                borderStyle: "solid",
                borderColor: "black",
                flexDirection: "row",
                alignItems: "center",
                paddingBottom: 2,
                paddingTop: 2,
              }}
              key={user.id}
            >
              <Link href={`/messages/${user.id}`} style={{ width: "100%" }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50, borderRadius: "100%" }}
                    source={{
                      url:
                        user.profilePicture ||
                        "https://tr.rbxcdn.com/38c6edcb50633730ff4cf39ac8859840/420/420/Hat/Png",
                    }}
                    resizeMode={"cover"}
                  />
                  <View
                    style={{
                      marginVertical: 10,
                      marginHorizontal: 10,
                      gap: 3,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20,
                        fontWeight: "700",
                      }}
                    >
                      {user.profile.name}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "300",
                      }}
                    >
                      {user.username}
                    </Text>
                  </View>
                </View>
              </Link>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Messages;
