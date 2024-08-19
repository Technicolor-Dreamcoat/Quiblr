import { useState, useRef, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Pressable,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { StateContext } from "../../../StateContext";
import useLemmyApi from "../../../hooks/useLemmyApi";
import ItemSeparator from "../../../items/components/ItemSeparator";
import BlankItemSeparator from "../../../items/components/BlankItemSeparator";
import Voting from "../../../items/components/Voting";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import {
  extractWebsiteName,
  isImageUrl,
  RenderText,
  formatNumber,
} from "../../../actions";
import { useNavigation } from "@react-navigation/native";
import NoResultsSearch from "./NoResultsSearch";
import NoMoreContentNote from "../../../components/NoMoreContentNote";
import { Octicons } from "@expo/vector-icons";
import RightBarSection from "../../../sections/RightBarSection";
import LoadingMoreFooter from "../../../components/LoadingMoreFooter";

const PostsSectionSearch = ({
  colors,
  styles,
  sort,
  listing,
  blurNSFWSettings,
  fontSize,
  instance,
  searchValue,
  showScrollBars,
  showScrollToTopSettings,
}) => {
  const {
    centerPanelPadding,
    centerPanelWidthMedium,
    centerPanelWidthNonDesktop,
    chosenFont_ExtraBold,
    chosenFont_Regular,
    client,
    community,
    confirmedNsfw,
    didFirstLoad,
    fetchMoreSearchPosts,
    fetchMoreSearchCommunities,
    fetchMoreSearchUsers,
    fetchMoreSearchComments,
    fetchSearchPosts,
    flatListRefCommentsSearch,
    flatListRefCommunitySearch,
    flatListRefUserSearch,
    headerHeight,
    height,
    IconRefresh,
    isPWA,
    loading,
    loadingMoreSearch,
    loadingSearch,
    noSearchPostResults,
    noSearchCommunityResults,
    noSearchUserResults,
    noSearchCommentResults,
    postDownVotes,
    postUpVotes,
    PostPlaceholders,
    pwaHeight,
    renderCard,
    RenderHeaderSearch,
    rightBarWidth,
    searchComments,
    searchCommunities,
    searchPosts,
    searchUsers,
    setLoading,
    showingResults,
    searchNavigation,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [scrollY] = useState(new Animated.Value(0));
  const [buttonVisible, setButtonVisible] = useState(false);
  const [pauseFetching, setPauseFetching] = useState(false);

  //ref to scroll flatlist to top
  const flatListRef = useRef(null);

  //############################################
  //               NAVIGATION                 //
  //############################################
  //function if NSFW Community (navigation)
  const navigateNSFWCommunity = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.community.name);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.community.actor_id)
    );
    navigation.push("NsfwWarningCommunity", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  //function if NSFW Post (navigation)
  const navigateNSFWPost = (item) => {
    const encodedPostInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("NsfwWarningPost", {
      post_id: item.post.id,
      post_instance: encodedPostInstance,
      post_name: encodedPostName,
    });
  };

  //function for community view (navigation)
  const navigateCommunityView = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.community.name);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.community.actor_id)
    );
    navigation.push("CommunityView", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  //function for comments (navigation)
  const navigateComments = (item) => {
    const encodedInstance = encodeURIComponent(extractWebsiteName(instance));
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("Comments", {
      post_id: item.post.id,
      post_instance: encodedInstance,
      post_name: encodedPostName,
    });
  };

  //function to see user detail (navigation)
  const navigateUser = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedUserInstance = encodeURIComponent(
      extractWebsiteName(item?.person?.actor_id)
    );
    const encodeduserName = encodeURIComponent(item?.person?.name);
    navigation.push("User", {
      currentInstance: encodedCurrentInstance,
      userInstance: encodedUserInstance,
      userName: encodeduserName,
    });
  };

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

  //posts - api call for end of the page fetch
  const getMorePosts = () => {
    try {
      !loadingMoreSearch;
      !noSearchPostResults &&
        !pauseFetching &&
        fetchMoreSearchPosts(searchValue);
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //communities - api call for end of the page fetch
  const getMoreCommunities = () => {
    try {
      !loadingMoreSearch;
      !noSearchCommunityResults &&
        !pauseFetching &&
        fetchMoreSearchCommunities(searchValue);
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //users - api call for end of the page fetch
  const getMoreUsers = () => {
    try {
      !loadingMoreSearch;
      !noSearchUserResults &&
        !pauseFetching &&
        fetchMoreSearchUsers(searchValue);
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //comments - api call for end of the page fetch
  const getMoreComments = () => {
    try {
      !loadingMoreSearch;
      !noSearchCommentResults &&
        !pauseFetching &&
        fetchMoreSearchComments(searchValue);
    } catch (e) {
    } finally {
      setPauseFetching(true);
      setTimeout(() => {
        setPauseFetching(false);
      }, 500);
    }
  };

  //render user comments item for flatlist
  const RenderUserComments = ({ item }) => {
    const navigation = useNavigation();

    const { likeComment } = useLemmyApi();
    const [commentHovering, setCommentHovering] = useState(false);
    const [downArrowHovering, setDownArrowHovering] = useState(false);
    const [upArrowHovering, setUpArrowHovering] = useState(false);
    const [comment, setComment] = useState(item);

    // Function to toggle the vote property (comment)
    const toggleVote = (voteStatus, upOrDown) => {
      setComment((prevState) => ({
        ...prevState,
        my_vote: voteStatus,
        counts: {
          ...prevState.counts,
          score: prevState.counts.score + upOrDown,
        },
      }));
    };

    //api call to upvote comments
    const voteUpComment = async (item, voteScore, toggleVote) => {
      const score =
        item?.my_vote == -1 && voteScore == 1
          ? 2
          : item?.my_vote == 1 && voteScore == 0
          ? -1
          : !item?.my_vote && voteScore == 1
          ? 1
          : 0;

      try {
        const votedComment = await likeComment({
          comment_id: item.comment.id,
          score: voteScore,
        });
        toggleVote(
          votedComment?.comment_view?.my_vote
            ? votedComment?.comment_view?.my_vote
            : 0,
          score
        );
      } catch (e) {}
    };

    //api call to downvote comments
    const voteDownComment = async (item, voteScore, toggleVote) => {
      const score =
        item?.my_vote == 1 && voteScore == -1
          ? -2
          : item?.my_vote == -1 && voteScore == 0
          ? 1
          : !item?.my_vote && voteScore == -1
          ? -1
          : 0;

      try {
        const votedComment = await likeComment({
          comment_id: item.comment.id,
          score: voteScore,
        });
        toggleVote(
          votedComment?.comment_view?.my_vote
            ? votedComment?.comment_view?.my_vote
            : 0,
          score
        );
      } catch (e) {}
    };
    if (!comment) {
      return;
    } else {
      return (
        <Pressable
          onHoverIn={() => setCommentHovering(true)}
          onHoverOut={() => setCommentHovering(false)}
          key={comment.comment.id}
          activeOpacity={0.75}
          onPress={() =>
            comment?.post?.nsfw && !confirmedNsfw
              ? navigateNSFWPost(comment)
              : navigateComments(comment)
          }
          style={[
            styles.rootCommentContainer,
            {
              marginHorizontal: centerPanelPadding,
              backgroundColor: commentHovering
                ? colors.greyShade1
                : colors.white,
              borderRadius: 20,
              paddingVertical: 5,
              borderWidth: 2,
              borderColor: commentHovering ? colors.greyShade2 : "transparent",
            },
          ]}
        >
          <View>
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              <View //top bar
                style={styles.commentBar}
              >
                <View style={styles.centeredRow}>
                  <TouchableOpacity style={styles.centeredRow}>
                    {comment.creator.avatar ? (
                      <Image
                        source={{ uri: comment.creator.avatar }}
                        placeholder={{ uri: comment.creator.avatar }}
                        style={styles.commentAvatar}
                      />
                    ) : (
                      <View style={styles.commentAvatarPlaceholderContainer}>
                        <Octicons
                          size={16}
                          name={"person"}
                          color={colors.greyShade3}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View style={styles.row}>
                    <TouchableOpacity style={styles.centeredRow}>
                      {comment.creator.display_name ? (
                        <Text
                          style={[
                            styles.commentCreator,
                            {
                              color: colors.black,
                            },
                          ]}
                        >
                          {comment.creator.display_name}
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.commentCreator,
                            {
                              color: colors.black,
                            },
                          ]}
                        >
                          {comment.creator.name}
                        </Text>
                      )}
                    </TouchableOpacity>

                    <Text style={styles.postTime}></Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.commentOriginalPost,
                  {
                    backgroundColor: commentHovering
                      ? colors.greyShade2
                      : colors.greyShade1,
                    borderWidth: 2,
                    borderColor: commentHovering
                      ? colors.greyShade3
                      : colors.greyShade2,
                  },
                ]}
              >
                {isImageUrl(comment.post.thumbnail_url) && (
                  <Image
                    blurRadius={blurNSFWSettings && comment.post.nsfw && 80}
                    source={{ uri: comment.post.thumbnail_url }}
                    placeholder={{ uri: comment.post.thumbnail_url }}
                    style={styles.commentOriginalPostImage}
                  />
                )}
                {!isImageUrl(comment.post.thumbnail_url) &&
                  isImageUrl(comment.post.url) && (
                    <Image
                      blurRadius={blurNSFWSettings && comment.post.nsfw && 80}
                      source={{ uri: comment.post.url }}
                      placeholder={{ uri: comment.post.url }}
                      style={styles.commentOriginalPostImage}
                    />
                  )}
                <Text style={styles.commentOriginalPostText}>
                  {comment.post.name}
                </Text>
              </View>
              <View style={styles.paddingTopSmall}>
                <RenderText
                  body={comment.comment.content}
                  navigation={navigation}
                  colors={colors}
                  fontSize={fontSize}
                  instance={instance}
                />
              </View>
              <View //bottom bar
                style={[
                  styles.meta,
                  { justifyContent: "space-between", paddingHorizontal: 5 },
                ]}
              >
                <View />

                <Voting
                  setPostHovering={setCommentHovering}
                  downArrowHovering={downArrowHovering}
                  setDownArrowHovering={setDownArrowHovering}
                  upArrowHovering={upArrowHovering}
                  setUpArrowHovering={setUpArrowHovering}
                  voteDownAction={voteDownComment}
                  voteUpAction={voteUpComment}
                  item={comment}
                  toggleVote={toggleVote}
                  postOrCommentID={comment?.comment?.id}
                  backgroundColor={colors.greyMeta}
                  borderWidth={0}
                  borderRadius={100}
                  borderColor={colors.lightGreyShade4}
                />
              </View>
            </View>
          </View>
        </Pressable>
      );
    }
  };
  const userCommentsItem = ({ item, navigation }) => {
    return <RenderUserComments item={item} navigation={navigation} />;
  };

  //get profile from api
  const fetchProfile = async (currentInstance, user_name) => {
    setLoading(true);
    try {
      const fetchedUser = await getOtherUserDetails(currentInstance, {
        username: user_name,
      });
    } catch (e) {
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  //render All Communities item for flatlist
  const RenderUsers = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigateUser(item)}
          style={{
            backgroundColor: hovered ? colors.lightGreyShade2 : colors.white,
            borderColor: hovered ? colors.greyShade2 : "transparent",
            borderWidth: 2,
            height: 85,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            marginVertical: 5,
          }}
        >
          <View
            style={{
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.person.avatar ? (
              <Image
                source={{ uri: item.person.avatar }}
                placeholder={{ uri: item.person.avatar }}
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: "cover",
                  borderRadius: 100,
                  backgroundColor: colors.greyShade1,
                }}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.greyShade1,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Octicons
                  size={25}
                  name={"person"}
                  color={colors.greyShade3}
                  style={{}}
                />
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: colors.black,
                  fontSize: 14 + fontSize,
                }}
              >
                {item.person.name}
              </Text>
            </View>
            <View
              style={{
                right: 0,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
                gap: 5,
              }}
            >
              <Text
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 12 + fontSize,
                  },
                ]}
              >
                {formatNumber(item.counts.post_count)} Posts
              </Text>

              <Text
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 12 + fontSize,
                  },
                ]}
              >
                {formatNumber(item.counts.comment_count)} Comments
              </Text>
            </View>
            <View
              style={[
                styles.preventTouchableRow,
                {
                  backgroundColor: colors.greyShade1,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 100,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 12 + fontSize,
                  padding: 5,
                  paddingHorizontal: 10,
                  color: colors.greyShade4,
                  fontFamily: chosenFont_Regular,
                }}
              >
                {extractWebsiteName(item?.person?.actor_id)}
              </Text>
            </View>
          </View>
          <Octicons
            size={16}
            name={"chevron-right"}
            color={colors.greyShade3}
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      </Pressable>
    );
  };
  const renderUsers = ({ item }) => <RenderUsers item={item} />;

  //press community
  function pressCommunity(item) {
    item?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(item)
      : navigateCommunityView(item);
  }

  //render All Communities item for flatlist
  const RenderAllCommunity = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => pressCommunity(item)}
          style={{
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
            borderColor: hovered ? colors.greyShade2 : "transparent",
            borderWidth: 2,
            height: 85,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 10,
            marginVertical: 5,
          }}
        >
          <View
            style={{
              width: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {item.community.icon ? (
              <Image
                blurRadius={blurNSFWSettings && item.community.nsfw && 10}
                source={{ uri: item.community.icon }}
                placeholder={{ uri: item.community.icon }}
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: "cover",
                  borderRadius: 100,
                  backgroundColor: colors.greyShade2,
                }}
              />
            ) : (
              <View
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: colors.greyShade1,
                  borderRadius: 100,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Octicons size={23} name={"people"} color={colors.greyShade3} />
              </View>
            )}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text
                numberOfLines={1}
                style={{
                  fontFamily: chosenFont_ExtraBold,
                  color: colors.black,
                  fontSize: 14 + fontSize,
                }}
              >
                {item.community.title}
              </Text>

              {item.community.nsfw && (
                <Text
                  style={{
                    color: colors.red,
                    marginLeft: 5,
                    fontSize: 11 + fontSize,
                  }}
                >
                  NSFW
                </Text>
              )}
            </View>
            <View
              style={{
                right: 0,
                width: 130,
                flexDirection: "row",
                alignItems: "center",
                marginTop: 5,
              }}
            >
              <View style={{ width: 13, height: 13 }}>
                <Octicons size={13} name={"person"} color={colors.greyShade3} />
              </View>
              <Text
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 12 + fontSize,
                  },
                ]}
              >
                {formatNumber(item.counts.subscribers)}
              </Text>
              <View style={{ marginLeft: 10, width: 13, height: 13 }}>
                <Octicons size={13} name={"server"} color={colors.greyShade3} />
              </View>
              <Text
                style={[
                  styles.cardMeta,
                  {
                    paddingLeft: 3,
                    color: colors.greyShade3,
                    fontSize: 12 + fontSize,
                  },
                ]}
              >
                {extractWebsiteName(item.community.actor_id)}
              </Text>
            </View>
          </View>
          <Octicons
            size={16}
            name={"chevron-right"}
            color={colors.greyShade3}
            style={{ paddingRight: 10 }}
          />
        </TouchableOpacity>
      </Pressable>
    );
  };
  const renderAllCommunity = ({ item }) => <RenderAllCommunity item={item} />;

  //create header with sidebar
  const HeaderComponent = () => {
    return (
      <View>
        <RenderHeaderSearch />
        <View
          style={{
            position: "absolute",
            top: searchNavigation != "Posts" ? -5 : 0,
            right: -width * rightBarWidth - 20,
          }}
        >
          {(searchNavigation == "Communities" ||
            searchNavigation == "Users" ||
            searchNavigation == "Comments") && (
            <RightBarSection
              showInstanceDetail={true}
              showCommunityDetails={false}
            />
          )}
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}
    >
      {/* //Loading Placeholders */}
      {(loading || loadingSearch) && (
        <View
          style={{
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
        // Search Posts
        !loading && searchNavigation == "Posts" && (
          <View>
            {noSearchPostResults &&
              !loadingSearch &&
              searchPosts?.length == 0 && (
                <View>
                  <HeaderComponent />
                  <NoResultsSearch />
                </View>
              )}
            {!loadingSearch && searchPosts?.length > 0 && (
              <FlatList
                showsVerticalScrollIndicator={showScrollBars}
                style={{
                  height: isPWA
                    ? height - headerHeight - pwaHeight
                    : height - headerHeight,
                }}
                initialNumToRender={7}
                ItemSeparatorComponent={
                  width < 400 ? BlankItemSeparator : ItemSeparator
                }
                onScroll={handleScroll}
                ListHeaderComponent={<HeaderComponent />}
                ListFooterComponent={
                  noSearchPostResults && searchPosts?.length > 0 ? (
                    <NoMoreContentNote type={"posts"} />
                  ) : (
                    loadingMoreSearch && <LoadingMoreFooter />
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
                onEndReached={getMorePosts}
                onEndReachedThreshold={0.5}
                data={searchPosts}
                renderItem={(item) => renderCard(item)}
                keyExtractor={(item) => item.post.id.toString()}
                extraData={[
                  didFirstLoad,
                  loading,
                  client,
                  sort,
                  listing,
                  community,
                  showingResults,
                  searchPosts,
                  postUpVotes,
                  postDownVotes,
                ]}
              />
            )}
          </View>
        )
      }

      {/* // Scroll to Top Button */}
      {!loading &&
        buttonVisible &&
        searchNavigation == "Posts" &&
        showScrollToTopSettings && (
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
                  setLoading(true),
                  setTimeout(() => {
                    setLoading(false);
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
                onPress={() => fetchSearchPosts(searchValue)}
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

      {/* //Search-view Communities */}
      {searchNavigation == "Communities" && searchCommunities?.length == 0 ? (
        <View style={{ marginTop: 5 }}>
          <HeaderComponent />
          <NoResultsSearch />
        </View>
      ) : (
        searchNavigation == "Communities" && (
          <FlatList
            showsVerticalScrollIndicator={showScrollBars}
            ref={flatListRefCommunitySearch}
            style={{
              paddingTop: 5,
              height: isPWA
                ? height - headerHeight - pwaHeight
                : height - headerHeight,
            }}
            ListHeaderComponent={<HeaderComponent />}
            ListFooterComponent={
              noSearchCommunityResults && searchCommunities?.length > 0 ? (
                <NoMoreContentNote type={"communities"} />
              ) : (
                loadingMoreSearch && <LoadingMoreFooter />
              )
            }
            scrollEnabled={true}
            contentContainerStyle={{
              width:
                width <= 1000
                  ? centerPanelWidthNonDesktop
                  : centerPanelWidthMedium,
              paddingBottom: 30,
              paddingHorizontal: 5,
            }}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={getMoreCommunities}
            onEndReachedThreshold={0.5}
            data={searchCommunities}
            renderItem={(item) => renderAllCommunity(item)}
            keyExtractor={(item) => item.community?.actor_id}
          />
        )
      )}

      {/* //Search-view Comments */}
      {searchNavigation == "Comments" && searchComments?.length == 0 ? (
        <View style={{ marginVertical: 5 }}>
          <HeaderComponent />
          <NoResultsSearch />
        </View>
      ) : (
        searchNavigation == "Comments" && (
          <FlatList
            showsVerticalScrollIndicator={showScrollBars}
            ref={flatListRefCommentsSearch}
            style={{
              paddingTop: 5,
              height: isPWA
                ? height - headerHeight - pwaHeight
                : height - headerHeight,
            }}
            ListHeaderComponent={<HeaderComponent />}
            ListFooterComponent={
              noSearchCommentResults && searchComments?.length > 0 ? (
                <NoMoreContentNote type={"comments"} />
              ) : (
                loadingMoreSearch && <LoadingMoreFooter />
              )
            }
            scrollEnabled={true}
            contentContainerStyle={{
              width:
                width <= 1000
                  ? centerPanelWidthNonDesktop
                  : centerPanelWidthMedium,
              paddingBottom: 30,
            }}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={getMoreComments}
            onEndReachedThreshold={0.5}
            data={searchComments}
            renderItem={(item) => userCommentsItem(item, navigation)}
            keyExtractor={(item) => item?.comment?.id}
          />
        )
      )}
      {/* //Search-view Users */}
      {searchNavigation == "Users" && searchUsers?.length == 0 ? (
        <View style={{ marginTop: 5 }}>
          <HeaderComponent />
          <NoResultsSearch />
        </View>
      ) : (
        searchNavigation == "Users" && (
          <FlatList
            showsVerticalScrollIndicator={showScrollBars}
            ref={flatListRefUserSearch}
            style={{
              paddingTop: 5,
              height: isPWA
                ? height - headerHeight - pwaHeight
                : height - headerHeight,
            }}
            ListHeaderComponent={<HeaderComponent />}
            ListFooterComponent={
              noSearchUserResults && searchUsers?.length > 0 ? (
                <NoMoreContentNote type={"users"} />
              ) : (
                loadingMoreSearch && <LoadingMoreFooter />
              )
            }
            scrollEnabled={true}
            contentContainerStyle={{
              width:
                width <= 1000
                  ? centerPanelWidthNonDesktop
                  : centerPanelWidthMedium,
              paddingBottom: 30,
              paddingHorizontal: 5,
            }}
            ItemSeparatorComponent={ItemSeparator}
            onEndReached={getMoreUsers}
            onEndReachedThreshold={0.5}
            data={searchUsers}
            renderItem={(item) => renderUsers(item)}
            keyExtractor={(item) => item.person?.id.toString()}
          />
        )
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sort: state.updateItem.reduxGlobal.sort,
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    instance: state.updateItem.reduxGlobal.instance,
    listing: state.updateItem.reduxGlobal.listing,
    blurNSFWSettings: state.updateItem.reduxGlobal.blurNSFWSettings,
    showScrollToTopSettings:
      state.updateItem.reduxGlobal.showScrollToTopSettings,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PostsSectionSearch);

export default withColorScheme(ConnectedComponent);
