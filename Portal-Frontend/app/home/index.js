import React, { useEffect, useRef, useState } from "react";
import { View, SafeAreaView, Text, Image } from "react-native";
import { Stack } from "expo-router/stack";
import { Info } from "lucide-react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Link, router } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import CategoryMenu from "../../components/categoryMenu";
import { getPosts, getTopUsers } from "../../functions/user";
import SinglePost from "../../components/singlePost";
import { Dimensions } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {Colors, Hint, Button, Assets, Incubator} from 'react-native-ui-lib';

const Home = () => {
  const ScreenHeight = Dimensions.get("window").height;
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const statusBarBGColor = useRef("white");
  const [currentCategory, setCurrentCategory] = useState("Home");
  const [posts, setPosts] = useState({});
  const [topUsers, setTopUsers] = useState({});
  const [isVisible, setIsVisible] = useState("true");

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

  const settingPosts = async () => {
    console.log(currentCategory);
    setPosts(await getPosts(currentCategory));
  };

  const gettingTopUsers = async () => {
    setTopUsers(await getTopUsers());
  };

  useEffect(() => {
    settingPosts();
  }, [currentCategory]);

  // is this the best way of doing this? (getting page to rerender on focus)
  useFocusEffect(
    React.useCallback(() => {
      settingPosts();
    }, [currentCategory])
  );

  useEffect(() => {
    if (!posts || posts.length == 0) {
      gettingTopUsers();
    }
  }, [posts]);

  const postRefs = useRef([]);
  const onViewableItemsChanged = useRef(({ changed }) => {
    changed.forEach((element) => {
      const cell = postRefs.current[element.item.id];
      if (cell) {
        if (element.isViewable) {
          cell.play();
        } else {
          cell.stop();
        }
      }
    });
  });

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
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <View style={{ flex: 1, alignSelf: "center" }}>
          <Header
            openCategoryMenu={openCategoryMenu}
            currentCategory={currentCategory}
          />
        </View>
        {/* shouldnt this be in the header component */}
        {currentCategory != "Home" && (
          <View style={{ marginRight: 10 }}>
            <Link
              href={{
                pathname: "/home/categorySummary",
                params: { categoryName: currentCategory },
              }}
              asChild
            >
              <TouchableOpacity>
                <Info size={35} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        )}
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
      {!categoryMenuOpen && posts && posts.length > 0 ? (
        <FlatList
          style={{ marginBottom: 47 }}
          data={posts}
          renderItem={({ item }) => (
            <SinglePost
              ref={(postRef) => (postRefs.current[item.id] = postRef)}
              post={item}
            />
          )}
          keyExtractor={(item) => item.id}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged.current}
          windowSize={3}
          removeClippedSubviews
          viewabilityConfig={{ itemVisiblePercentThreshold: 75 }}
        />
      ) : (
        <View
          style={{ flex: 1, justifyContent: "start", alignItems: "center" }}
        >
          {topUsers.length > 0 && (
            <View style={{ marginTop: ScreenHeight / 3 }}>
              <Text>Here Are Our Top Users:</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                {topUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      // backgroundColor: "black",
                    }}
                    onPress={() => router.push(`/user/${user.id}`)}
                  >
                    <Image
                      source={{
                        uri: user.profilePicture,
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
                    <Text style={{ marginLeft: 10, fontSize: 25 }}>
                      {user.username}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
      {/* footer */}
      <Footer />
    </SafeAreaView>
  );
};

export default Home;
