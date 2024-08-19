import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import CommunityPosterTime from "../components/CommunityPosterTime";
import ReactPlayer from "react-player/lazy";
import Voting from "../components/Voting";
import NsfwTag from "../../components/NsfwTag";
import CommentButton from "../components/CommentButton";
import SavePost from "../components/SavePost";
import { StateContext } from "../../StateContext";
import SharePost from "../components/SharePost";
import { useNavigation } from "@react-navigation/native";
import { extractWebsiteName, isImageUrl, isVideo } from "../../actions";
import ZoomImage from "../components/zoomImage";
import MoreButton from "../components/MoreButton";
import * as Animatable from "react-native-animatable";

const RenderCard = ({
  item,
  fontSize,
  colors,
  styles,
  blurNSFWSettings,
  soundOnVideos,
  instance,
  dynamicImageSize,
  openInSeparateTab,
}) => {
  const {
    chosenFont_Bold,
    chosenFont_ExtraBold,
    confirmedNsfw,
    IconHandStop,
    IconUsers,
    jwt,
    voteDownPost,
    voteUpPost,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [postHovering, setPostHovering] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(0.7);
  const [shareHovering, setShareHovering] = useState(false);
  const [bookmarkHovering, setBookmarkHovering] = useState(false);
  const [downArrowHovering, setDownArrowHovering] = useState(false);
  const [upArrowHovering, setUpArrowHovering] = useState(false);
  const [commentHovering, setCommentHovering] = useState(false);
  const [post, setPost] = useState(item);
  const [showCopied, setShowCopied] = useState(false);
  const [showCopiedMore, setShowCopiedMore] = useState(false);

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

    openInSeparateTab
      ? Linking.openURL(
          window.location.href +
            "instance/" +
            encodedInstance +
            "/post/" +
            item.post.id +
            "/" +
            encodedPostName
        )
      : navigation.push("Comments", {
          post_id: item.post.id,
          post_instance: encodedInstance,
          post_name: encodedPostName,
        });
  };

  // Function to toggle the saved property
  const toggleSaved = (savedStatus) => {
    setPost((prevState) => ({
      ...prevState,
      saved: savedStatus,
    }));
  };

  // Function to toggle the vote property
  const toggleVote = (voteStatus, upOrDown) => {
    setPost((prevState) => ({
      ...prevState,
      my_vote: voteStatus,
      counts: {
        ...prevState.counts,
        score: prevState.counts.score + upOrDown,
      },
    }));
  };

  // //function to get image size
  // const getImageSize = (url) => {
  //   return new Promise((resolve, reject) => {
  //     Image.getSize(
  //       url,
  //       (width, height) => {
  //         resolve({ width, height });
  //       },
  //       reject
  //     );
  //   });
  // };
  //press community
  function pressCommunity(post) {
    post?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(post)
      : navigateCommunityView(post);
  }

  // //check if image is vertical
  // useEffect(() => {
  //   const fetchImageSize = async () => {
  //     try {
  //       const { width: imgWidth, height: imgHeight } = await getImageSize(
  //         post?.post?.thumbnail_url
  //       );

  //       setAspectRatio(imgHeight > imgWidth ? 0.7 : 1);
  //     } catch (error) {
  //       console.error("Error fetching image size:", error);
  //     }
  //   };

  //   post?.post?.thumbnail_url && fetchImageSize();
  // }, [post?.post?.thumbnail_url]);

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{
        marginBottom: width < 400 ? 3 : 5,
        marginTop: width < 400 ? 0 : 5,
        opacity: post?.post?.deleted ? 0.5 : 1,
      }}
      onPress={() =>
        post?.post?.nsfw && !confirmedNsfw
          ? navigateNSFWPost(post)
          : navigateComments(post)
      }
    >
      {post?.post?.deleted && (
        <View
          style={{
            paddingVertical: 2,
            backgroundColor: colors.lightRed,
            borderRadius: 100,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={[
              styles.postTime,
              {
                fontFamily: chosenFont_ExtraBold,
                color: colors.red,
              },
            ]}
          >
            DELETED
          </Text>
        </View>
      )}
      <View
        onMouseEnter={() => setPostHovering(true)}
        onMouseLeave={() => setPostHovering(false)}
        style={[
          styles.itemContainer,
          {
            transitionDuration: "150ms",
            width: "100%",
            zIndex: 1,
            padding: width < 400 ? 10 : 10,
            paddingBottom: width < 400 ? 10 : 15,
            borderRadius: 20,
            borderTopLeftRadius: post?.post?.deleted ? 0 : 20,
            borderTopRightRadius: post?.post?.deleted ? 0 : 20,

            borderWidth: 2,
            borderColor: postHovering
              ? colors.greyShade2
              : post?.post?.deleted
              ? colors.lightRed
              : "transparent",
            backgroundColor: post?.post?.featured_local
              ? colors.greyShade1
              : postHovering
              ? colors.greyShade1
              : colors.white,
          },
        ]}
      >
        <View style={[styles.mainInfos, { zIndex: 10 }]}>
          <View style={{ flex: 1 }}>
            <View style={[styles.postInfo, { paddingLeft: 0 }]}>
              <TouchableOpacity onPress={() => navigateCommunityView(post)}>
                {post?.community?.icon ? (
                  <Image
                    blurRadius={blurNSFWSettings && post?.community?.nsfw && 10}
                    source={{ uri: post?.community?.icon }}
                    style={[
                      styles.communityIcon,
                      {
                        backgroundColor: colors.lightGreyShade2,
                        width: 35,
                        height: 35,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.lightGreyShade2,
                      borderRadius: 100,
                      width: 35,
                      height: 35,
                      marginRight: 5,
                    }}
                  >
                    <IconUsers
                      size={23}
                      stroke={2.0}
                      color={colors.greyShade3}
                    />
                  </View>
                )}
              </TouchableOpacity>

              <CommunityPosterTime
                item={post}
                chosenFont_Bold={chosenFont_Bold}
                pressCommunity={pressCommunity}
                setPostHovering={setPostHovering}
                chosenFont_ExtraBold={chosenFont_ExtraBold}
              />
            </View>
          </View>
          {showCopiedMore && (
            <Animatable.View
              onAnimationEnd={() => setShowCopiedMore(false)}
              animation={"fadeOut"}
              delay={1000}
              style={{
                backgroundColor: colors.lightBlue,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                zIndex: 100,
              }}
            >
              <Text
                style={{
                  color: colors.blueShade2,
                  fontFamily: chosenFont_Bold,
                  fontSize: 13,
                }}
              >
                Copied!
              </Text>
            </Animatable.View>
          )}
          <View>
            <MoreButton
              post={post}
              toggleSaved={toggleSaved}
              setShowCopiedMore={setShowCopiedMore}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 5 }}>
          {post?.post?.nsfw && <NsfwTag />}
        </View>

        <Text
          style={[
            styles.itemText,
            {
              color: colors.greyShade5,
              fontFamily: chosenFont_ExtraBold,
              paddingTop: width < 400 ? 0 : 10,
              fontSize: 21 + fontSize,
              paddingLeft: 0,
              marginVertical: width < 400 ? 5 : 15,
            },
          ]}
        >
          {post?.post?.name}
        </Text>

        {isImageUrl(post?.post?.thumbnail_url) &&
          !isVideo(post?.post?.embed_video_url) && (
            <View
              style={{
                marginBottom: width < 400 ? 5 : 10,
                marginVertical: width < 400 ? 0 : 5,
                borderWidth: 1,
                borderColor: colors.greyShade2,
                borderRadius: 20,
              }}
            >
              {!blurNSFWSettings && (
                <ZoomImage
                  image={post?.post?.thumbnail_url}
                  setPostHovering={setPostHovering}
                />
              )}

              <Image
                blurRadius={blurNSFWSettings && post?.post?.nsfw && 80}
                resizeMode="contain"
                source={{
                  uri: post?.post?.thumbnail_url,
                }}
                style={[
                  styles.largeImageThumbnail,
                  {
                    aspectRatio: dynamicImageSize ? aspectRatio : 1.3,
                    // backgroundColor: "transparent",
                    backgroundColor: "black",
                    zIndex: 3,
                    borderRadius: 20,
                    // position: "absolute",
                    marginBottom: 0,
                    marginVertical: 0,
                  },
                ]}
              />
            </View>
          )}
        {!isImageUrl(post?.post?.thumbnail_url) &&
          isImageUrl(post?.post?.url) &&
          !isVideo(post?.post?.embed_video_url) && (
            <View
              style={{
                marginBottom: width < 400 ? 5 : 10,
                marginVertical: width < 400 ? 0 : 5,
                borderWidth: 1,
                borderColor: colors.greyShade2,
                borderRadius: 20,
              }}
            >
              {!blurNSFWSettings && (
                <ZoomImage
                  image={post?.post?.thumbnail_url}
                  setPostHovering={setPostHovering}
                />
              )}
              <Image
                blurRadius={blurNSFWSettings && post?.post?.nsfw && 80}
                resizeMode="contain"
                source={{
                  uri: post?.post?.url,
                }}
                style={[
                  styles.largeImageThumbnail,
                  {
                    aspectRatio: dynamicImageSize ? aspectRatio : 1.3,
                    // backgroundColor: "transparent",
                    backgroundColor: "black",
                    zIndex: 3,
                    borderRadius: 20,
                    // position: "absolute",
                    marginBottom: 0,
                    marginVertical: 0,
                  },
                ]}
              />
            </View>
          )}
        {isVideo(post?.post?.embed_video_url) && (
          <TouchableOpacity
            activeOpacity={1}
            disabled // Disable touch events for the wrapped Video component
            style={{
              width: "100%",
              alignItems: "center",
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {blurNSFWSettings && post?.post?.nsfw && (
              <View
                style={{
                  position: "absolute",
                  zIndex: 2,
                  height: "100%",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 5,
                  backgroundColor: colors.lightGreyShade4,
                }}
              >
                <IconHandStop
                  size={23}
                  stroke={2.0}
                  color={colors.greyShade4}
                />
                <Text
                  style={{
                    color: colors.greyShade4,
                    fontFamily: chosenFont_Bold,
                    fontSize: 14 + fontSize,
                  }}
                >
                  NSFW Content
                </Text>
              </View>
            )}
            <ReactPlayer
              style={{ alignSelf: "center" }}
              width={"100%"}
              playing={false}
              volume={null}
              muted={soundOnVideos ? false : true}
              controls
              url={post.post.embed_video_url}
            />
          </TouchableOpacity>
        )}
        {post?.post?.url && !isImageUrl(post?.post?.url) && (
          <Text
            numberOfLines={1}
            style={[
              styles.itemSource,
              {
                paddingHorizontal: width < 400 ? 0 : 0,
                marginBottom: width < 400 ? 5 : 15,
              },
            ]}
          >
            {"Source: " + extractWebsiteName(post?.post?.url)}
          </Text>
        )}
        <View
          style={[
            styles.meta,
            {
              marginTop: width < 400 ? 0 : 10,
            },
          ]}
        >
          {commentHovering && (
            <View
              style={{
                backgroundColor: colors.greyShade4,
                borderRadius: 10,
                position: "absolute",
                alignItems: "center",
                justifyContent: "center",
                padding: 10,
                zIndex: 100,
                bottom: 45,
                left: 0,
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontFamily: chosenFont_Bold,
                  fontSize: 13,
                }}
              >
                Comments
              </Text>
            </View>
          )}
          <CommentButton
            commentHovering={commentHovering}
            setCommentHovering={setCommentHovering}
            functionAction={() =>
              post?.post?.nsfw && !confirmedNsfw
                ? navigateNSFWPost(post)
                : navigateComments(post)
            }
            setPostHovering={setPostHovering}
            commentCount={post?.counts?.comments}
          />

          <View style={{ flexDirection: "row", gap: 5 }}>
            {showCopied && (
              <Animatable.View
                onAnimationEnd={() => setShowCopied(false)}
                animation={"fadeOut"}
                delay={1000}
                style={{
                  backgroundColor: colors.lightBlue,
                  borderRadius: 10,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  zIndex: 100,
                  bottom: 45,
                  right: 143,
                }}
              >
                <Text
                  style={{
                    color: colors.blueShade2,
                    fontFamily: chosenFont_Bold,
                    fontSize: 13,
                  }}
                >
                  Copied!
                </Text>
              </Animatable.View>
            )}
            {shareHovering && !showCopied && (
              <View
                style={{
                  backgroundColor: colors.greyShade4,
                  borderRadius: 10,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  zIndex: 100,
                  bottom: 45,
                  right: 143,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: chosenFont_Bold,
                    fontSize: 13,
                  }}
                >
                  Share
                </Text>
              </View>
            )}
            <SharePost
              setShareHovering={setShareHovering}
              shareHovering={shareHovering}
              setPostHovering={setPostHovering}
              item={post}
              setShowCopied={setShowCopied}
            />
            {bookmarkHovering && (
              <View
                style={{
                  backgroundColor: colors.greyShade4,
                  borderRadius: 10,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  zIndex: 100,
                  bottom: 45,
                  right: 95,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: chosenFont_Bold,
                    fontSize: 13,
                  }}
                >
                  {post?.saved ? "Unsave" : "Save"}
                </Text>
              </View>
            )}

            <SavePost
              bookmarkHovering={bookmarkHovering}
              setBookmarkHovering={setBookmarkHovering}
              setPostHovering={setPostHovering}
              post={post}
              toggleSaved={toggleSaved}
            />

            {(upArrowHovering || downArrowHovering) && !jwt && (
              <View
                style={{
                  backgroundColor: colors.greyShade4,
                  borderRadius: 10,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  zIndex: 100,
                  bottom: 45,
                  right: 0,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: chosenFont_Bold,
                    fontSize: 13,
                  }}
                >
                  Log in to vote
                </Text>
              </View>
            )}
            {upArrowHovering && jwt && (
              <View
                style={{
                  backgroundColor: colors.greyShade4,
                  borderRadius: 10,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  zIndex: 100,
                  bottom: 45,
                  right: 15,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: chosenFont_Bold,
                    fontSize: 13,
                  }}
                >
                  upvote
                </Text>
              </View>
            )}
            {downArrowHovering && jwt && (
              <View
                style={{
                  backgroundColor: colors.greyShade4,
                  borderRadius: 10,
                  position: "absolute",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  zIndex: 100,
                  bottom: 45,
                  right: 7,
                }}
              >
                <Text
                  style={{
                    color: colors.white,
                    fontFamily: chosenFont_Bold,
                    fontSize: 13,
                  }}
                >
                  downvote
                </Text>
              </View>
            )}
            <Voting
              setPostHovering={setPostHovering}
              downArrowHovering={downArrowHovering}
              setDownArrowHovering={setDownArrowHovering}
              upArrowHovering={upArrowHovering}
              setUpArrowHovering={setUpArrowHovering}
              voteDownAction={voteDownPost}
              voteUpAction={voteUpPost}
              item={post}
              toggleVote={toggleVote}
              postOrCommentID={post?.post?.id}
              backgroundColor={colors.greyMeta}
              borderWidth={0}
              borderRadius={100}
              borderColor={colors.lightGreyShade4}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
    blurNSFWSettings: state.updateItem.reduxGlobal.blurNSFWSettings,
    soundOnVideos: state.updateItem.reduxGlobal.soundOnVideos,
    instance: state.updateItem.reduxGlobal.instance,
    dynamicImageSize: state.updateItem.reduxGlobal.dynamicImageSize,
    openInSeparateTab: state.updateItem.reduxGlobal.openInSeparateTab,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(RenderCard);

export default withColorScheme(ConnectedComponent);
