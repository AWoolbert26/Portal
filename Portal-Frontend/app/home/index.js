import React, { useEffect, useRef, useState } from "react";
import { View, SafeAreaView } from "react-native";
import { Stack } from "expo-router/stack";
import { Info } from "lucide-react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Link, router } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import CategoryMenu from "../../components/categoryMenu";
import { getPosts } from "../../functions/user";
import SinglePost from "../../components/singlePost";

const Home = () => {
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const statusBarBGColor = useRef("white");
  const [currentCategory, setCurrentCategory] = useState("Home");
  const [posts, setPosts] = useState();

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
    setPosts(await getPosts());
  };

  useEffect(() => {
    settingPosts();
  }, []);

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
      )}
      {/* footer */}
      <Footer />
    </SafeAreaView>
  );
};

export default Home;
