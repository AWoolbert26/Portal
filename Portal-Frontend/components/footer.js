import { useContext } from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../app/auth/AuthContext";
import { router } from "expo-router";
import { deleteAuthUser } from "../functions/user";
import { UserCircle2, Home, Search, LogOut, PlusCircle } from "lucide-react-native";

const Footer = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);

  const logout = () => {
    setAuthUser(null);
    deleteAuthUser();
    router.replace("/");
  };

  const goToHome = () => {
    router.push("/home");
  };

  const goToSearch = () => {
    router.push("/search");
  };

  const goToProfile = () => {
    router.push("/userProfile");
  };

  const goToCreatePost = () => {
    console.log("Going to create post page");
    console.log(authUser);
    router.push("/createPost");
  };

  if (authUser === null) {
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
        height: 70,
        bottom: 30,
        borderRadius: 30,
        backgroundColor: "gainsboro",
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
          marginTop: 20,
          gap: 35,
        }}
      >
        <TouchableOpacity onPress={goToSearch}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Search color="darkslategray" size={30} style={{marginBottom: 5}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToHome}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <Home color="darkslategray" size={30} style={{marginBottom: 5}}/>
        </TouchableOpacity>

        {authUser.type === 1 && (
          <TouchableOpacity onPress={goToCreatePost}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <PlusCircle color="darkslategray" size={30} style={{marginBottom: 5}}/>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={goToProfile}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}
          >
          <UserCircle2 color="darkslategray" size={30} style={{marginBottom: 5}}/>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
          <LogOut color="darkslategray" size={30} style={{marginBottom: 5}}/>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={() => router.push("/user/10")}>
          <LogOut color="#000" size={35} />
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Footer;
