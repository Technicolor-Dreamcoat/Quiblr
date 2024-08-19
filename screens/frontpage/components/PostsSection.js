import { useState, useRef, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
} from "react-native";
import { StateContext } from "../../../StateContext";
import NoResults from "../../../components/NoResults";
import ItemSeparator from "../../../items/components/ItemSeparator";
import BlankItemSeparator from "../../../items/components/BlankItemSeparator";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import * as Animatable from "react-native-animatable";
import { LargeSpace } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import RightBarSection from "../../../sections/RightBarSection";
import LoadingMoreFooter from "../../../components/LoadingMoreFooter";

const PostsSection = ({
  colors,
  showScrollToTopSettings,
  showScrollBars,
  fontSize,
  instance,
}) => {
  const {
    changingInstance,
    centerPanelWidthMedium,
    centerPanelWidthNonDesktop,
    chosenFont_ExtraBold,
    fetchInitialPosts,
    fetchMorePosts,
    headerHeight,
    height,
    IconRefresh,
    isPWA,
    jwt,
    loadingMainPosts,
    loadingMorePosts,
    noFrontPagePostResults,
    PostPlaceholders,
    posts,
    pwaHeight,
    renderCard,
    RenderHeaderDefault,
    rightBarWidth,
    setLoadingMainPosts,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));
  const [buttonVisible, setButtonVisible] = useState(false);
  const [pauseFetching, setPauseFetching] = useState(false);

  //ref to scroll flatlist to top
  const flatListRef = useRef(null);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  useEffect(() => {
    // Create an event listener for scroll position changes
    scrollY.addListener(({ value }) => {
      if (value > 0) {
        // Show the button when the user scrolls down
        setButtonVisible(true);
      } else {
        // Hide the button when the user scrolls up
        setButtonVisible(false);
      }
    });
    // Clean up the listener when the component unmounts
    return () => {
      scrollY.removeAllListeners();
    };
  }, []);

  //normal post - infinite scroll
  const getMoreNormalPosts = () => {
    try {
      !loadingMainPosts &&
        !loadingMorePosts &&
        !noFrontPagePostResults &&
        !pauseFetching &&
        fetchMorePosts(instance);
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //create header with sidebar
  const HeaderComponent = () => {
    return (
      <View
        style={{
          zIndex: 100,

          width:
            width <= 1000 ? centerPanelWidthNonDesktop : centerPanelWidthMedium,
        }}
      >
        <RenderHeaderDefault />
        <View
          style={{
            position: "absolute",
            top: 0,
            zIndex: 100,
            right: -width * rightBarWidth - 20,
          }}
        >
          <RightBarSection
            showInstanceDetail={true}
            showCommunityDetails={false}
          />
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        //flexShrink: 1,
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {/* //Loading Placeholders */}
      {loadingMainPosts && (
        <View
          style={{
            overflow: "hidden",
            width:
              width <= 1000
                ? centerPanelWidthNonDesktop
                : centerPanelWidthMedium,
          }}
        >
          <PostPlaceholders />
        </View>
      )}

      {
        //normal posts
        !changingInstance && !loadingMainPosts && (
          <View>
            {posts?.length == 0 && (
              <ScrollView
                showsVerticalScrollIndicator={showScrollBars}
                contentContainerStyle={{
                  width:
                    width <= 1000
                      ? centerPanelWidthNonDesktop
                      : centerPanelWidthMedium,
                }}
              >
                <Animatable.View
                  animation={"fadeIn"}
                  duration={0.1}
                  delay={600}
                >
                  <RenderHeaderDefault />
                  <NoResults
                    image={require("../../../assets/Quiblr_Confused.png")}
                    text={"No Results"}
                    description={
                      "Such empty! We couldn't find any posts. You can change that!"
                    }
                    leftButtonAction={() => navigation.push("Quiblr")}
                    leftButtonText={"GO HOME"}
                    rightButtonAction={() =>
                      jwt
                        ? navigation.push("WritePost")
                        : navigation.push("Login")
                    }
                    rightButtonText={"WRITE POST"}
                  />

                  <LargeSpace />
                  <LargeSpace />
                </Animatable.View>
              </ScrollView>
            )}
            {posts?.length > 0 && (
              <View
                style={{
                  height: isPWA
                    ? height - headerHeight - pwaHeight
                    : height - headerHeight,
                }}
              >
                <FlatList
                  initialNumToRender={3}
                  showsVerticalScrollIndicator={showScrollBars}
                  ref={flatListRef}
                  onScroll={handleScroll}
                  ItemSeparatorComponent={
                    width < 400 ? BlankItemSeparator : ItemSeparator
                  }
                  ListHeaderComponent={<HeaderComponent />}
                  ListFooterComponent={
                    loadingMorePosts && (
                      <View
                        style={{
                          width:
                            width <= 1000
                              ? centerPanelWidthNonDesktop
                              : centerPanelWidthMedium,
                        }}
                      >
                        <LoadingMoreFooter />
                      </View>
                    )
                  }
                  onEndReached={getMoreNormalPosts}
                  onEndReachedThreshold={0.8}
                  contentContainerStyle={{
                    paddingBottom: 30,
                    width:
                      width <= 1000
                        ? centerPanelWidthNonDesktop
                        : centerPanelWidthMedium,
                  }}
                  data={posts}
                  renderItem={(item) => renderCard(item)}
                  keyExtractor={(item) => item?.post?.id?.toString()}
                />
              </View>
            )}
          </View>
        )
      }

      {/* // Scroll to Top Button */}
      {!loadingMainPosts && buttonVisible && showScrollToTopSettings && (
        <Animated.View
          style={{
            minWidth: 125,
            height: 55,
            borderRadius: 100,
            overflow: "hidden",
            position: "absolute",
            paddingHorizontal: 5,
            justifyContent: "center",
            alignItems: "center",
            right: width <= 1000 ? 30 : 125,
            top: height * 0.75,

            zIndex: 2,
            flexDirection: "row",
            gap: 5,

            opacity: scrollY.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 0.9],
              extrapolate: "clamp",
            }),
          }}
        >
          <View
            style={{
              borderRadius: 100,
              paddingHorizontal: 10,
              height: 40,
              backgroundColor: colors.white,
              shadowOpacity: 0.15,
              shadowRadius: 5,
              shadowOffset: {
                height: 3,
                width: 0,
              },
            }}
          >
            <TouchableOpacity
              onPress={() => (
                setLoadingMainPosts(true),
                setTimeout(() => {
                  setLoadingMainPosts(false);
                }, 500)
              )}
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <Text
                style={{
                  color: colors.greyShade5,
                  fontFamily: chosenFont_ExtraBold,
                  fontSize: 14 + fontSize,
                }}
              >
                Scroll to Top
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderRadius: 100,
              paddingHorizontal: 10,
              height: 40,
              width: 40,
              backgroundColor: colors.white,
              shadowOpacity: 0.15,
              shadowRadius: 5,
              shadowOffset: {
                height: 3,
                width: 0,
              },
            }}
          >
            <TouchableOpacity
              onPress={() => fetchInitialPosts(instance)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
            >
              <IconRefresh stroke={2.5} size={18} color={colors.greyShade5} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    instance: state.updateItem.reduxGlobal.instance,
    showScrollToTopSettings:
      state.updateItem.reduxGlobal.showScrollToTopSettings,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PostsSection);

export default withColorScheme(ConnectedComponent);
