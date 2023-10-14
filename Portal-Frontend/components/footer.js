import { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faCircle,
  faUser,
  faPlusCircle,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../app/auth/AuthContext";
import { router } from "expo-router";
import { deleteAuthUser } from "../functions/user";
import { User, Home, Search, LogOut } from 'lucide-react-native'

const Footer = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);
  if (authUser === null) {
    router.replace("/");
  }

  const logout = () => {
    setAuthUser(null);
    deleteAuthUser();
    router.replace("/");
  };

  const goToHome = () => {
    router.push("/home");
  };

  const goToProfile = () => {
    router.push("/userProfile");

  };
  
  const goToCreatePost = () => {
    console.log("Going to create post page");
    console.log(authUser);
  };
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 30,
      }}
    >
      <View
        style={{
          borderColor: "black",
          borderWidth: 0.5,
        }}
      />
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          marginTop: 20,
          gap: 35,
        }}
      >
        <Search color="#000" size={35}/>
        <TouchableOpacity onPress={goToHome}>
          <Home color="#000" size={35}/>
        </TouchableOpacity>
        {authUser && authUser.type === 1 && (
          <TouchableOpacity onPress={goToCreatePost}>
            <FontAwesomeIcon icon={faPlusCircle} size={35} />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={goToProfile}>
          <User color="#000" size={35}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={logout}>
          <LogOut color="#000" size={35}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Footer;
