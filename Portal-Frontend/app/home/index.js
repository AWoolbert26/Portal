import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import {
  Text,
  View,
  SafeAreaView,
  StatusBar,
  Touchable,
  Image,
} from "react-native";
import { Stack } from "expo-router/stack";
import { Info } from "lucide-react-native";
import { getCategories, deleteAuthUser } from "../../functions/user";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { Link, router } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import CategoryMenu from "../../components/categoryMenu";

const Home = () => {
  const [categories, setCategories] = useState({});

  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const statusBarBGColor = useRef("white");
  const [currentCategory, setCurrentCategory] = useState("Home");

  const getUserCategories = async () => {
    try {
      const gotCategories = await getCategories();
      setCategories(gotCategories);
    } catch (err) {
      console.log(err);
    }
  };

  getUserCategories();

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <View style={{ flex: 1 }}></View>
        <View style={{ flex: 2 }}>
          <Header
            openCategoryMenu={openCategoryMenu}
            currentCategory={currentCategory}
          />
        </View>
        <View
          style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}
        >
          <Link href={{ pathname: "/home/categorySummary", params: { categoryName: currentCategory }}} asChild>
          { currentCategory != "Home" &&
          <TouchableOpacity>
            <Info size={35} color="#000" />
          </TouchableOpacity>
          }
          </Link>
        </View>
      </View>
      {/* page */}
      {/* <View style={{ flexDirection: "row", alignSelf: "center" }}>
        will need to print these out under the header
        {categories.categories != null &&
          categories.categories.map((category) => {
            return (
              <View key={category.id}>
                <Text style={{ fontSize: 20 }}>{category.name}</Text>
              </View>
            );
          })}
      </View> */}
      {/* posts */}
      {!categoryMenuOpen && (
        <ScrollView style={{ marginBottom: 50 }}>
          {/* single post */}
          <View style={{}}>
            {/* background image */}
            <Image
              source={{
                uri: "https://static1.srcdn.com/wordpress/wp-content/uploads/2023/04/shark-tale-oscar-what-kind-fish.jpg?q=50&fit=contain&w=1140&h=&dpr=1.5",
              }}
              style={{
                width: "100%",
                // Without height undefined it won't work
                height: undefined,
                // figure out your image aspect ratio
                aspectRatio: 9 / 11,
                resizeMode: "stretch",
              }}
            />
            {/* user stuff at top */}
            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 7,
                marginTop: 7,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
              }}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
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
              <Text style={{ marginLeft: 7, color: "white" }}>Vicky</Text>
            </View>
            {/* caption */}
            <View
              style={{
                position: "absolute",
                marginTop: "115%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Post Caption: Hello guys its me Victor, please work for me
              </Text>
            </View>
          </View>
          {/* another post */}
          <View style={{}}>
            {/* background image */}
            <Image
              source={{
                uri: "https://carboncostume.com/wordpress/wp-content/uploads/2015/10/fatalbert.jpg",
              }}
              style={{
                width: "100%",
                // Without height undefined it won't work
                height: undefined,
                // figure out your image aspect ratio
                aspectRatio: 9 / 11,
                resizeMode: "stretch",
              }}
            />
            {/* user stuff at top */}
            <View
              style={{
                position: "absolute",
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 7,
                marginTop: 7,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
              }}
            >
              <Image
                source={{
                  uri: "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png",
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
              <Text style={{ marginLeft: 7, color: "white" }}>Mustafa</Text>
            </View>
            {/* caption */}
            <View
              style={{
                position: "absolute",
                marginTop: "115%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                width: "100%",
              }}
            >
              <Text
                style={{
                  color: "white",
                }}
              >
                Post Caption: Hey hey hey Mustafa here, take this job please
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
      {/* footer */}
      <Footer />
    </SafeAreaView>
  );
};

export default Home;
