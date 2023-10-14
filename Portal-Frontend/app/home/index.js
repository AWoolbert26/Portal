import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Text, View, SafeAreaView, StatusBar, Touchable } from "react-native";
import { Stack } from "expo-router/stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Info } from 'lucide-react-native'
import {
  faMagnifyingGlass,
  faCircle,
  faUser,
  faCaretDown,
  faSignOut,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { getInterests, deleteAuthUser } from "../../functions/user";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import CategoryMenu from "../../components/categoryMenu";

const Home = () => {
  const [interests, setInterests] = useState({});

  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const statusBarBGColor = useRef("white");
  const [currentCategory, setCurrentCategory] = useState("Home");

  const getUserInterests = async () => {
    try {
      const gotInterests = await getInterests();
      setInterests(gotInterests);
    } catch (err) {
      console.log(err);
    }
  };
  const goToDescription = () => {
    router.push("/home/categorySummary");
  };
  const openCategoryMenu = () => {
    setCategoryMenuOpen(true);
    statusBarBGColor.current = "black";
  };
  const close = () => {
    setCategoryMenuOpen(false);
    statusBarBGColor.current = "white";
  };

  // need to change status bar
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: statusBarBGColor.current }}
    >
      {categoryMenuOpen && (
        <CategoryMenu close={close} setCurrentCategory={setCurrentCategory} />
      )}
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{flex:1, flexDirection:'row', justifyContent:'flex-end', marginTop: 20}}>
      <View style={{ flex: 1 }}></View>
        <View style={{flex:2}}>
          <Header
            openCategoryMenu={openCategoryMenu}
            currentCategory={currentCategory}
          />
        </View>
      <View style={{flex: 1, flexDirection:'row', justifyContent:'center'}}>
        <TouchableOpacity onPress={goToDescription}>
          <Info size={35} color="#000"/>
        </TouchableOpacity>
        </View>
      </View>
      {/* page */}
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        {interests.categories != null &&
          interests.categories.map((category) => {
            return (
              <View key={category.id}>
                <Text style={{ fontSize: 20 }}>{category.name}</Text>
              </View>
            );
          })}
      </View>
      {/* footer (need to make global) */}
      <Footer />
    </SafeAreaView>
  );
};

export default Home;
