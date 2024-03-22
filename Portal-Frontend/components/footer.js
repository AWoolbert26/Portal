import { useContext } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../app/auth/AuthContext";
import { router } from "expo-router";
import { deleteAuthUser } from "../functions/user";
import {
  UserCircle2,
  Home,
  Search,
  LogOut,
  PlusCircle,
  Inbox
} from "lucide-react-native";

const Footer = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);

  const logout = () => {
    setAuthUser(null);
    deleteAuthUser();
    router.replace("/");
  };

  const goToHome = () => {
    router.replace("/home");
  };

  const goToSearch = () => {
    router.replace("/search");
  };

  const goToProfile = () => {
    router.replace("/userProfile");
  };

  const goToMessages = () => {
      router.push("/messages");
  }

  const goToCreatePost = () => {
    console.log("Going to create post page");
    console.log(authUser);
    router.push("/createPost");
  };

  if (!authUser) {
    // Handle the case when there's no authenticated user
    return null; // Render nothing when there's no user
  }

  return (
    <View
      style={{
        flex: 1,
        position: "absolute",
        left: 20,
        right: 30,
        height:60,
        bottom: 0,
      }}
    >
      {/* <View
        style={{
          borderColor: "black",
          borderWidth: 0.5,
        }}
      /> */}
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          gap: 35,
        }}
      >
        <TouchableOpacity
          onPress={goToSearch}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Search color="black" size={30}/>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToHome}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Home color="black" size={30}/>
        </TouchableOpacity>

          <TouchableOpacity
            onPress={goToCreatePost}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PlusCircle
              color="black"
              size={30}
            />
          </TouchableOpacity>
        

        <TouchableOpacity
          onPress={goToProfile}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <UserCircle2
            color="black"
            size={30}
          />
        </TouchableOpacity>
        
        <TouchableOpacity
            onPress={goToMessages}
            style={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Inbox
              color="black"
              size={30}
            />
          </TouchableOpacity>

        <TouchableOpacity
          onPress={logout}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LogOut color="black" size={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
