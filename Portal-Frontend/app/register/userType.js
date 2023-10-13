import React, { useContext, useState } from "react";
import { Text, View, SafeAreaView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router/stack";
import { AuthContext } from "../auth/AuthContext";
import { router } from "expo-router";
import { updateUserType } from "../functions/user";

const initProfile = () => {
  const { authUser } = useContext(AuthContext);
  if (authUser === null) {
    router.replace("/login");
  }

  const [selectedNumber, setSelectedNumber] = useState(0); //0 for user, 1 for creator, 3 for not sure, 2 for company
  const selectUser = () => {
    setSelectedNumber(0);
  };
  const selectCreator = () => {
    setSelectedNumber(1);
  };
  const selectCompany = () => {
    setSelectedNumber(2);
  };
  const selectNotSure = () => {
    setSelectedNumber(3);
  };

  const submit = async () => {
    if (selectedNumber !== 3 && selectedNumber !== 0) {
      //if 0 or 3, it will stay as 0 (default)
      console.log(selectedNumber);
      await updateUserType(selectedNumber);
    }
    router.push("/register/interests");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <Text
        style={{
          flex: 1,
          textAlign: "center",
          marginTop: 24,
          fontSize: 28,
          fontWeight: "700",
          height: "auto",
          textAlignVertical: "center",
        }}
      >
        Which best describes you?
      </Text>
      <View
        style={{
          flex: 15,
          marginLeft: 15,
          marginRight: 15,
          alignItems: "flex-start",
        }}
      >
        {/* user desc */}
        <Text style={{ marginBottom: 5, fontWeight: "700" }}>User</Text>
        <TouchableOpacity
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            width: "100%",
            justifyContent: "center",
            marginBottom: 10,
            borderColor: selectedNumber === 0 ? "#5481C6" : "black",
          }}
          onPress={selectUser}
        >
          <Text
            style={{
              margin: 8,
              color: selectedNumber === 0 ? "#5481C6" : "black",
            }}
          >
            I want to discover my future career.
          </Text>
        </TouchableOpacity>
        {/* creator desc */}
        <Text style={{ marginBottom: 5, fontWeight: "700" }}>Creator</Text>
        <TouchableOpacity
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            borderColor: selectedNumber === 1 ? "#5481C6" : "black",
            marginBottom: 20,
          }}
          onPress={selectCreator}
        >
          <Text
            style={{
              margin: 8,
              flexWrap: "wrap",
              color: selectedNumber === 1 ? "#5481C6" : "black",
            }}
          >
            I want to create videos about my work to help others discover their
            future career
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            borderColor: selectedNumber === 2 ? "#5481C6" : "black",
            marginBottom: 20,
          }}
          onPress={selectCompany}
        >
          <Text
            style={{
              margin: 8,
              flexWrap: "wrap",
              color: selectedNumber === 2 ? "#5481C6" : "black",
            }}
          >
            Company
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            borderStyle: "solid",
            borderWidth: 1,
            width: "100%",
            justifyContent: "center",
            flexDirection: "row",
            borderColor: selectedNumber === 3 ? "#5481C6" : "black",
            marginBottom: 20,
          }}
          onPress={selectNotSure}
        >
          <Text
            style={{
              margin: 8,
              flexWrap: "wrap",
              color: selectedNumber === 3 ? "#5481C6" : "black",
            }}
          >
            I'm not sure
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: "60%",
            alignItems: "center",
            backgroundColor: "black",
            alignSelf: "center",
            marginTop: "auto",
            borderRadius: 10,
          }}
          onPress={submit}
        >
          <Text
            style={{
              color: "white",
              fontWeight: "700",
              paddingVertical: 20,
              fontSize: 20,
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default initProfile;
