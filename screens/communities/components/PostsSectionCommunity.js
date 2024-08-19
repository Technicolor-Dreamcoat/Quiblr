import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Animated,
  ScrollView,
} from "react-native";
import { StateContext } from "../../../StateContext";
import ItemSeparator from "../../../items/components/ItemSeparator";
import BlankItemSeparator from "../../../items/components/BlankItemSeparator";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import NoMoreContentNote from "../../../components/NoMoreContentNote";
import NoResultsCommunityView from "./NoResultsCommunityView";
import RightBarSection from "../../../sections/RightBarSection";
import LoadingMoreFooter from "../../../components/LoadingMoreFooter";

const PostsSectionCommunity = ({
  colors,
  currentInstance,
  sort,
  listing,
  showScrollToTopSettings,
  fontSize,
  showScrollBars,
  updateCommunity,
  showNSFWSettings,
  route,
}) => {
  const {
    centerPanelWidthMedium,
    centerPanelWidthNonDesktop,
    chosenFont_ExtraBold,
    client,
    communityPosts,
    didFirstLoad,
    fetchCommunity,
    fetchMoreCommunityPosts,
    headerHeight,
    height,
    IconRefresh,
    instanceDetail,
    isPWA,
    loadingCommunityPosts,
    loadingMoreCommunityPosts,
    noCommunityPostResults,
    PageWithHeaderPlaceholders,
    postDownVotes,
    postUpVotes,
    pwaHeight,
    renderCard,
    RenderHeaderCommunity,
    rightBarWidth,
    setLoadingCommunityPosts,
    showingResults,
    width,
  } = useContext(StateContext);
  const [scrollY] = useState(new Animated.Value(0));
  const [buttonVisible, setButtonVisible] = useState(false);
  const [pauseFetching, setPauseFetching] = useState(false);

  //ref to scroll flatlist to top
  const flatListRef = useRef(null);

  // api community call

  useEffect(() => {
    console.log("heyyy"),
      fetchCommunity(
        "https://" + decodeURIComponent(route.params.currentInstance),
        decodeURIComponent(route.params.communityName) +
          "@" +
          decodeURIComponent(route.params.communityInstance)
      );
  }, [
    route.params,
    sort,
    listing,
    showNSFWSettings,
    instanceDetail?.my_user?.local_user_view?.local_user?.show_nsfw,
  ]);

  //infinite scroll
  const getMoreCommunityPosts = () => {
    try {
      !loadingMoreCommunityPosts;
      !noCommunityPostResults &&
        !pauseFetching &&
        fetchMoreCommunityPosts("https://" + currentInstance);
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //scroll to top button
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

  //create header with sidebar
  const HeaderComponent = () => {
    return (
      <View style={{ paddingHorizontal: 8 }}>
        <RenderHeaderCommunity />
        <View
          style={{
            position: "absolute",
            top: 0,
            right: -width * rightBarWidth - 20,
          }}
        >
          <RightBarSection
            showInstanceDetail={true}
            showCommunityDetails={true}
            postDetail={communityPosts?.[0]}
            updateCommunity={updateCommunity}
            hideBanner={true}
          />
        </View>
      </View>
    );
  };

  if (loadingCommunityPosts) {
    return (
      <View
        scrollEnabled={false}
        style={[
          {
            height: isPWA ? height - pwaHeight : height,
            width,
            backgroundColor: colors.white,
            overflow: "hidden",
          },
        ]}
      >
        <View scrollEnabled={false} style={{ flexDirection: "row" }}>
          <View
            scrollEnabled={false}
            style={{
              width: "100%",
              justifyContent: "center",
              backgroundColor: colors.white,
            }}
          >
            <PageWithHeaderPlaceholders />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.white,
        }}
      >
        {
          //Community Posts
          !loadingCommunityPosts && (
            <View>
              {noCommunityPostResults &&
                !loadingCommunityPosts &&
                communityPosts?.length == 0 && (
                  <ScrollView
                    contentContainerStyle={{
                      padding: 20,
                      height,
                      width:
                        width <= 1000
                          ? centerPanelWidthNonDesktop
                          : centerPanelWidthMedium,
                    }}
                  >
                    <RenderHeaderCommunity />
                    <NoResultsCommunityView leftButtonHide={true} />
                  </ScrollView>
                )}
              {!loadingCommunityPosts && communityPosts?.length > 0 && (
                <FlatList
                  style={{
                    height: isPWA
                      ? height - headerHeight - pwaHeight
                      : height - headerHeight,
                  }}
                  onEndReached={getMoreCommunityPosts}
                  onEndReachedThreshold={0.5}
                  initialNumToRender={7}
                  onScroll={handleScroll}
                  ItemSeparatorComponent={
                    width < 400 ? BlankItemSeparator : ItemSeparator
                  }
                  ListHeaderComponent={<HeaderComponent />}
                  ListFooterComponent={
                    noCommunityPostResults && communityPosts?.length > 0 ? (
                      <NoMoreContentNote type={"posts"} />
                    ) : (
                      loadingMoreCommunityPosts && <LoadingMoreFooter />
                    )
                  }
                  ref={flatListRef}
                  contentContainerStyle={{
                    width:
                      width <= 1000
                        ? centerPanelWidthNonDesktop
                        : centerPanelWidthMedium,
                    paddingBottom: 30,
                  }}
                  data={communityPosts}
                  renderItem={(item) => renderCard(item)}
                  keyExtractor={(item) => item.post.id.toString()}
                  extraData={[
                    didFirstLoad,
                    loadingCommunityPosts,
                    client,
                    sort,
                    listing,
                    showingResults,
                    postUpVotes,
                    postDownVotes,
                  ]}
                  showsVerticalScrollIndicator={showScrollBars}
                />
              )}
            </View>
          )
        }

        {/* // Scroll to Top Button*/}
        {!loadingCommunityPosts && buttonVisible && showScrollToTopSettings && (
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
                  setLoadingCommunityPosts(true),
                  setTimeout(() => {
                    setLoadingCommunityPosts(false);
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
                onPress={() => updateCommunity()}
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
  }
};
const mapStateToProps = (state) => {
  return {
    sort: state.updateItem.reduxGlobal.sort,
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    instance: state.updateItem.reduxGlobal.instance,
    listing: state.updateItem.reduxGlobal.listing,
    showNSFWSettings: state.updateItem.reduxGlobal.showNSFWSettings,
    showScrollToTopSettings:
      state.updateItem.reduxGlobal.showScrollToTopSettings,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PostsSectionCommunity);

export default withColorScheme(ConnectedComponent);
