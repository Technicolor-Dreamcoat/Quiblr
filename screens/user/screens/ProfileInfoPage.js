import React, { useState, useContext } from "react";
import { View, Text, FlatList, Platform } from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import {
  extractDate,
  extractWebsiteName,
  formatNumber,
} from "../../../actions";
import { SmallSpace } from "../../../constants";
import { StateContext } from "../../../StateContext";
import ItemSeparator from "../../../items/components/ItemSeparator";
import BlankItemSeparator from "../../../items/components/BlankItemSeparator";
import { useNavigation } from "@react-navigation/native";
import NoResults from "../../../components/NoResults";
import HeaderSection from "../../../sections/HeaderSection";
import LeftBarList from "../../../sections/LeftBarList";
import PageTitle from "../../../components/PageTitle";
import BlankBarSection from "../../../sections/BlankBarSection";
import LoadingMoreFooter from "../../../components/LoadingMoreFooter";
import NoMoreContentNote from "../../../components/NoMoreContentNote";
import UserComments from "../components/UserComments";
import AllOverlays from "../../../overlays/AllOverlays";
import GenericButton from "../../../components/GenericButton";
import SimpleFilterButton from "../../../components/SimpleFilterButton";
const ProfileInfoPage = ({
  colors,
  styles,
  showNSFWSettings,
  route,
  showScrollBars,
}) => {
  const {
    centerPanelPadding,
    centerPanelWidthMedium,
    centerPanelWidthNonDesktop,
    getOtherUserDetails,
    headerHeight,
    height,
    IconCalendarEvent,
    isPWA,
    jwt,
    PageWithHeaderPlaceholders,
    pwaHeight,
    renderCard,
    signedInUserInfo,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [postsCommunitiesSaved, setPostsCommunitiesSaved] = useState("Posts");
  const [userDetails, setUserDetails] = useState("");
  const [userPosts, setUserPosts] = useState([]);
  const [userComments, setUserComments] = useState([]);
  const [loadingUserDetail, setLoadingUserDetail] = useState(true);
  const [loadingMoreUserDetail, setLoadingMoreUserDetail] = useState(true);
  const [userPostPage, setUserPostPage] = useState(1);
  const [userCommentPage, setUserCommentPage] = useState(1);
  const [pauseFetching, setPauseFetching] = useState(false);
  const [noUserCommentResults, setNoUserCommentResults] = useState(false);
  const [noUserPostResults, setNoUserPostResults] = useState(false);

  //get user profile from api
  const fetchProfile = async (currentInstance, user_name) => {
    setLoadingUserDetail(true);
    try {
      const fetchedUser = await getOtherUserDetails(currentInstance, {
        username: user_name,
      });
      setUserDetails(fetchedUser?.person_view);
      setUserPosts((prevPosts) => {
        return [...prevPosts, ...fetchedUser?.posts];
      });
      setUserComments((prevPosts) => {
        return [...prevPosts, ...fetchedUser?.comments];
      });
      setLoadingUserDetail(false);
      setUserPostPage(userPostPage + 1);
      setUserCommentPage(userPostPage + 1);
    } catch (e) {
      setLoadingUserDetail(false);
    } finally {
    }
  };
  //get user posts from api
  const fetchMoreProfilePosts = async (
    currentInstance,
    user_name,
    userPostPage
  ) => {
    setLoadingMoreUserDetail(true);
    try {
      const fetchedUser = await getOtherUserDetails(currentInstance, {
        username: user_name,
        page: userPostPage,
      });
      setUserPosts((prevPosts) => {
        const newposts = [...prevPosts, ...fetchedUser?.posts];
        return jwt
          ? newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
            )
          : !showNSFWSettings
          ? newposts
              .filter(
                (post, index, self) =>
                  index === self.findIndex((t) => t.post.id === post.post.id) //no duplicate id
              )
              .filter((post) => !post.post.nsfw) //no nsfw
          : newposts.filter(
              (post, index, self) =>
                index === self.findIndex((t) => t.post.id === post.post.id)
            ); //no duplicate id
      });
      fetchedUser?.posts == 0 && setNoUserPostResults(true);
    } catch (e) {
    } finally {
      setUserPostPage(userPostPage + 1);
      setLoadingMoreUserDetail(false);
    }
  };

  //get user comments from api
  const fetchMoreProfileComments = async (
    currentInstance,
    user_name,
    userCommentPage
  ) => {
    setLoadingMoreUserDetail(true);
    try {
      const fetchedUser = await getOtherUserDetails(currentInstance, {
        username: user_name,
        page: userCommentPage,
      });
      setUserComments((prevPosts) => {
        const newposts = [...prevPosts, ...fetchedUser?.comments];
        return newposts.filter(
          (comment, index, self) =>
            index === self.findIndex((t) => t.comment.id === comment.comment.id) //no duplicate id
        );
      });
      fetchedUser?.comments == 0 && setNoUserCommentResults(true);
    } catch (e) {
    } finally {
      setUserCommentPage(userCommentPage + 1);
      setLoadingMoreUserDetail(false);
    }
  };

  //api call on open
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      setUserPosts([]);
      setUserComments([]);
      setPostsCommunitiesSaved("Posts");
      fetchProfile(
        "https://" + decodeURIComponent(route?.params?.currentInstance),
        decodeURIComponent(route?.params?.userName) +
          "@" +
          decodeURIComponent(route?.params?.userInstance)
      );
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [route.params]);

  //posts -- infinite scroll
  const getMoreUserPosts = () => {
    try {
      !loadingMoreUserDetail;
      !noUserPostResults &&
        !pauseFetching &&
        fetchMoreProfilePosts(
          "https://" + decodeURIComponent(route?.params?.currentInstance),
          decodeURIComponent(route?.params?.userName) +
            "@" +
            decodeURIComponent(route?.params?.userInstance),
          userPostPage
        );
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //comments -- infinite scroll
  const getMoreUserComments = () => {
    try {
      !loadingMoreUserDetail;
      !noUserCommentResults &&
        !pauseFetching &&
        fetchMoreProfileComments(
          "https://" + decodeURIComponent(route?.params?.currentInstance),
          decodeURIComponent(route?.params?.userName) +
            "@" +
            decodeURIComponent(route?.params?.userInstance),
          userCommentPage
        );
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  const userCommentsItem = ({ item, navigation }) => {
    return <UserComments item={item} navigation={navigation} />;
  };

  //flatlist header component
  const HeaderComponent = () => {
    return (
      <View
        style={{
          width:
            width <= 1000
              ? centerPanelWidthNonDesktop - centerPanelPadding * 2
              : centerPanelWidthMedium - centerPanelPadding * 2,
        }}
      >
        <View
          style={{
            width: "100%",
          }}
        >
          <PageTitle text={"User Detail"} />

          {userDetails?.person?.banner && (
            <View
              style={{
                height: 150,
                width: "100%",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                borderWidth: 3,
                borderBottomWidth: 0,
                borderColor: colors.greyShade2,
              }}
            >
              {userDetails?.person?.bot_account && (
                <View //bot
                  style={[
                    styles.botContainer,
                    { left: 10, top: 10, marginTop: 0, marginLeft: 0 },
                  ]}
                >
                  <Text style={styles.botText}>Bot</Text>
                </View>
              )}
              <Image
                style={{
                  borderTopLeftRadius: 7,
                  borderTopRightRadius: 7,
                  width: "100%",
                  height: 150,
                }}
                resizeMode={"cover"}
                source={{
                  uri: userDetails?.person?.banner,
                }}
                placeholder={{
                  uri: userDetails?.person?.banner,
                }}
              />
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              backgroundColor: colors.greyShade1,
              paddingLeft: 15,
              paddingVertical: 15,
              borderTopWidth: userDetails?.person?.banner ? 0 : 3,
              borderWidth: 3,
              borderColor: colors.greyShade2,
              borderRadius: 10,
              borderTopLeftRadius: userDetails?.person?.banner ? 0 : 10,
              borderTopRightRadius: userDetails?.person?.banner ? 0 : 10,
            }}
          >
            {!userDetails?.person?.banner &&
              userDetails?.person?.bot_account && (
                <View //bot
                  style={[
                    styles.botContainer,
                    { right: 10, top: 10, marginTop: 0, marginLeft: 0 },
                  ]}
                >
                  <Text style={styles.botText}>Bot</Text>
                </View>
              )}
            {userDetails?.person?.avatar && (
              <Image
                style={{ borderRadius: 10, width: 50, height: 50 }}
                source={{
                  uri: userDetails?.person?.avatar,
                }}
                placeholder={{
                  uri: userDetails?.person?.avatar,
                }}
              />
            )}
            <View
              style={{
                paddingLeft: 10,
                width: "80%",
                gap: 5,
              }}
            >
              <Text style={[styles.filterHeader, { color: colors.greyShade5 }]}>
                {userDetails?.person?.name}
              </Text>
              {userDetails?.person?.display_name && (
                <Text
                  style={[
                    styles.cardMeta,
                    {
                      color: colors.greyShade3,
                      fontSize: 13,
                      fontStyle: "italic",
                    },
                  ]}
                >
                  Display Name: {userDetails?.person?.display_name}
                </Text>
              )}
              <View style={styles.preventTouchableRow}>
                <View
                  style={{
                    alignItems: "center",
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    maxWidth: 275,
                    borderRadius: 5,
                    backgroundColor: colors.greyShade2,
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.cardMeta,
                      { color: colors.greyShade4, fontSize: 13 },
                    ]}
                  >
                    {extractWebsiteName(userDetails?.person?.actor_id)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  right: 0,
                  width: 130,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <IconCalendarEvent
                  size={14}
                  stroke={2.0}
                  color={colors.greyShade4}
                  style={{ marginLeft: 0 }}
                />
                <Text
                  style={[
                    styles.cardMeta,
                    { color: colors.greyShade4, fontSize: 13 },
                  ]}
                >
                  {extractDate(userDetails?.person?.published)}
                </Text>
              </View>
              <View
                style={{
                  right: 0,
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    styles.cardMeta,
                    { color: colors.greyShade4, fontSize: 13 },
                  ]}
                >
                  {formatNumber(userDetails?.counts?.post_count)} Posts
                </Text>
                <Text
                  style={[
                    styles.cardMeta,
                    {
                      color: colors.greyShade4,
                      fontSize: 13,
                      marginLeft: 10,
                    },
                  ]}
                >
                  {formatNumber(userDetails?.counts?.comment_count)} Comments
                </Text>
              </View>
              {userDetails?.person?.id ==
                signedInUserInfo?.person_view?.person?.id && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <GenericButton
                    text={"ACCOUNT SETTINGS"}
                    noText={false}
                    disabled={false}
                    includeBorder={false}
                    textColor={"white"}
                    cancelButton={false}
                    background={colors.blueShade2}
                    size={"small"}
                    shadowColor={colors.blueShade3}
                    action={() => navigation.push("ProfileSettings")}
                    includeIcon={false}
                    icon={"pencil"}
                    loadingIndicator={false}
                    tall={false}
                  />
                </View>
              )}
            </View>
          </View>
        </View>
        <SmallSpace />
        <View //Posts, Comments
          style={{
            flexDirection: width > 300 && "row",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
            marginBottom: 10,
            gap: 5,
          }}
        >
          <SimpleFilterButton
            viewOptions={postsCommunitiesSaved}
            setViewOptions={setPostsCommunitiesSaved}
            selectedOption={"Posts"}
          />
          <SimpleFilterButton
            viewOptions={postsCommunitiesSaved}
            setViewOptions={setPostsCommunitiesSaved}
            selectedOption={"Comments"}
          />
        </View>
      </View>
    );
  };

  if (loadingUserDetail) {
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
        <HeaderSection />
        <View scrollEnabled={false} style={{ flexDirection: "row" }}>
          <BlankBarSection />
          <LeftBarList />
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
          backgroundColor: colors.white,
          height: "100%",
          paddingTop: 0,
        }}
        showsVerticalScrollIndicator={false}
      >
        <AllOverlays />
        <HeaderSection />
        <View style={{ flexDirection: "row" }}>
          <BlankBarSection />
          <LeftBarList />

          <View
            style={{
              flex: 1,
              height: isPWA
                ? height - headerHeight - pwaHeight
                : height - headerHeight,
            }}
          >
            {postsCommunitiesSaved == "Posts" &&
              (userPosts?.length == 0 ? (
                <NoResults
                  image={require("../../../assets/Quiblr_Confused.png")}
                  text={"No Posts"}
                  description={
                    "Nothing to see, move along! We couldn't find any posts from this user"
                  }
                  leftButtonHide={true}
                  leftButtonAction={() => navigation.push("Quiblr")}
                  leftButtonText={"GO HOME"}
                  rightButtonHide={true}
                  rightButtonAction={() =>
                    jwt
                      ? navigation.push("WritePost")
                      : navigation.push("Login")
                  }
                  rightButtonText={"WRITE POST"}
                />
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={showScrollBars}
                  initialNumToRender={7}
                  ListHeaderComponent={<HeaderComponent />}
                  ListFooterComponent={
                    noUserPostResults && userPosts?.length > 0 ? (
                      <NoMoreContentNote type={"posts"} />
                    ) : (
                      loadingMoreUserDetail && <LoadingMoreFooter />
                    )
                  }
                  ItemSeparatorComponent={
                    width < 400 ? BlankItemSeparator : ItemSeparator
                  }
                  contentContainerStyle={{
                    width:
                      width <= 1000
                        ? centerPanelWidthNonDesktop
                        : centerPanelWidthMedium,
                    paddingHorizontal: centerPanelPadding,
                  }}
                  data={userPosts}
                  onEndReached={getMoreUserPosts}
                  onEndReachedThreshold={0.5}
                  renderItem={(item) => renderCard(item)}
                  keyExtractor={(item) => item?.post?.id?.toString()}
                />
              ))}

            {postsCommunitiesSaved == "Comments" &&
              (userComments?.length == 0 ? (
                <NoResults
                  image={require("../../../assets/Quiblr_Confused.png")}
                  text={"No Comments"}
                  description={
                    "Not much of a talker! We couldn't find any comments from this user"
                  }
                  leftButtonHide={true}
                  leftButtonAction={() => navigation.push("Quiblr")}
                  leftButtonText={"GO HOME"}
                  rightButtonHide={true}
                  rightButtonAction={() =>
                    jwt
                      ? navigation.push("WritePost")
                      : navigation.push("Login")
                  }
                  rightButtonText={"WRITE POST"}
                />
              ) : (
                <FlatList
                  showsVerticalScrollIndicator={showScrollBars}
                  ListHeaderComponent={<HeaderComponent />}
                  ListFooterComponent={
                    noUserCommentResults && userComments?.length > 0 ? (
                      <NoMoreContentNote type={"comments"} />
                    ) : (
                      loadingMoreUserDetail && <LoadingMoreFooter />
                    )
                  }
                  ItemSeparatorComponent={ItemSeparator}
                  onEndReached={getMoreUserComments}
                  onEndReachedThreshold={0.5}
                  contentContainerStyle={{
                    width:
                      width <= 1000
                        ? centerPanelWidthNonDesktop
                        : centerPanelWidthMedium,
                    paddingHorizontal: centerPanelPadding,
                  }}
                  data={userComments}
                  renderItem={(item) => userCommentsItem(item, navigation)}
                  keyExtractor={(item) => item?.comment?.id?.toString()}
                />
              ))}
          </View>

          <BlankBarSection />
        </View>
      </View>
    );
  }
};
const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    fontSize: state.updateItem.reduxGlobal.fontSize,
    instance: state.updateItem.reduxGlobal.instance,
    showNSFWSettings: state.updateItem.reduxGlobal.showNSFWSettings,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ProfileInfoPage);

export default withColorScheme(ConnectedComponent);
