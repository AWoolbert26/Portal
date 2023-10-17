import React, { useEffect, useRef, useState } from "react";
import { Text, View, SafeAreaView, Image } from "react-native";
import { Stack } from "expo-router/stack";
import { Info } from "lucide-react-native";
import {
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native-gesture-handler";
import { getCategories, deleteAuthUser } from "../../functions/user";
import { Link, router } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import CategoryMenu from "../../components/categoryMenu";
import { getPosts } from "../../functions/user";
import { Video, ResizeMode } from "expo-av";
import Constants from "expo-constants";

const Home = () => {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const statusBarBGColor = useRef("white");
  const [currentCategory, setCurrentCategory] = useState("Home");
  const [posts, setPosts] = useState();

  const goToDescription = () => {
    router.push("/home/categorySummary");
  };
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

  const settingPosts = async () => {
    setPosts(await getPosts());
  };

  useEffect(() => {
    settingPosts();
  }, []);

  const video = React.useRef(null);

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
          <Link
            href={{
              pathname: "/home/categorySummary",
              params: { categoryName: currentCategory },
            }}
            asChild
          >
            {currentCategory != "Home" && (
              <TouchableOpacity>
                <Info size={35} color="#000" />
              </TouchableOpacity>
            )}
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
      {!categoryMenuOpen && posts && (
        // should use flatlist instead
        <ScrollView style={{ marginBottom: 50 }}>
          {/* single post */}
          {posts.map((post) => {
            return (
              <View key={post.id} style={{}}>
                {/* background video */}
                <Video
                  ref={video}
                  source={{
                    uri: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
                  }}
                  style={{
                    width: "100%",
                    // Without height undefined it won't work
                    height: undefined,
                    // figure out your image aspect ratio
                    aspectRatio: 9 / 11,
                  }}
                  shouldPlay={true}
                  isLooping={true}
                  resizeMode="cover"
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
                  <Text style={{ marginLeft: 7, color: "white" }}>
                    {post.user.username}
                  </Text>
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
                    {post.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
      {/* footer */}
      <Footer />
    </SafeAreaView>
  );
};

export default Home;
