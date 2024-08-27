import React, {
  useEffect,
  useState,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { updateItem } from "../../../redux/actions";
import PostAndReply from "../../../components/PostAndReply";
import SavePost from "../../../items/components/SavePost";
import ReactPlayer from "react-player/lazy";
import EditableWritePostPage from "../../writePost/screens/EditableWritePostPage";
import Voting from "../../../items/components/Voting";
import { connect } from "react-redux";
import { Overlay } from "react-native-elements";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import Animated from "react-native-reanimated";
import Comments from "../components/Comments";
import * as Animatable from "react-native-animatable";
import { useFocusEffect } from "@react-navigation/native";

import {
  extractWebsiteName,
  isImageUrl,
  isVideo,
  getTimeDifference,
  RenderText,
  externalURL,
  makeColorLighter,
  getTimeDifferenceNoUnits,
} from "../../../actions";
import { makeCommentsHierarchy } from "../../../utils/makeCommentsHierarchy";
import SharePost from "../../../items/components/SharePost";
import { SmallSpace } from "../../../constants";
import HeaderSection from "../../../sections/HeaderSection";
import LeftBarList from "../../../sections/LeftBarList";
import BlankBarSection from "../../../sections/BlankBarSection";
import PageTitle from "../../../components/PageTitle";
import RightBarSection from "../../../sections/RightBarSection";
import SearchDropdownSection from "../../search/components/SearchDropdownSection";
import GenericButton from "../../../components/GenericButton";

const SpecificCommentPage = ({
  styles,
  colors,
  navigation,
  fontSize,
  instance,
  soundOnVideos,
  route,
}) => {
  const {
    centerPanelPadding,
    centerPanelWidthMedium,
    centerPanelWidthNonDesktop,
    chosenFont_Bold,
    chosenFont_ExtraBold,
    chosenFont_Regular,
    comments,
    CommentsPlaceholders,
    confirmedNsfw,
    createComment,
    currentUserInfo,
    deleteComment,
    deleteSelectedPost,
    dispatch,
    editComment,
    getComment,
    getSingleCommentThread,
    getPost,
    height,
    IconActivity,
    IconAlertTriangle,
    IconArrowBigDown,
    IconArrowBigUp,
    isPWA,
    jwt,
    luckyResults,
    overlayHeight,
    overlayRadius,
    overlayWidth,
    pwaHeight,
    rightBarWidth,
    scrollViewRef,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    setComments,
    voteDownPost,
    voteUpPost,
    width,
  } = useContext(StateContext);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const videoRef = React.useRef(null);
  const [postComment, setPostComment] = useState("");
  const refPostComment = useRef(postComment);
  const [commentToEdit, setCommentToEdit] = useState("");
  const refCommentToEdit = useRef(commentToEdit);
  const [commentToEditContent, setCommentToEditContent] = useState("");
  const refCommentToEditContent = useRef(commentToEditContent);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [commentToReply, setCommentToReply] = useState("");
  const refCommentToReply = useRef(commentToReply);
  const [originalReplyContent, setOriginalReplyContent] = useState("");
  const [commentReplyContent, setCommentReplyContent] = useState("");
  const refCommentReplyContent = useRef(commentReplyContent);
  const [writeComment, setWriteComment] = useState(false);
  const [postHovering, setPostHovering] = useState(false);
  const [communityHovering, setCommunityHovering] = useState(false);
  const [userHovering, setUserHovering] = useState(false);
  const [sameInstance, setSameInstance] = useState(false);
  const [downArrowHovering, setDownArrowHovering] = useState(false);
  const [upArrowHovering, setUpArrowHovering] = useState(false);
  const [deletePostConfirmation, setDeletePostConfirmation] = useState(false);
  const [post, setPost] = useState("");
  const [showEditPost, setShowEditPost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDeleteComment, setLoadingDeleteComment] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [hoveredSwitchInstance, setHoveredSwitchInstance] = useState(false);
  const [hoveredEdit, setHoveredEdit] = useState(false);
  const [hoveredDelete, setHoveredDelete] = useState(false);
  const [hoveredTrending, setHoveredTrending] = useState(false);
  const [showFullPost, setShowFullPost] = useState(false);
  const [hoveredViewAllComments, setHoveredViewAllComments] = useState(false);

  useEffect(() => {
    refPostComment.current = postComment;
    refCommentToEditContent.current = commentToEditContent;
    refCommentToEdit.current = commentToEdit;
    refCommentToReply.current = commentToReply;
    refCommentReplyContent.current = commentReplyContent;
  });

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

  //function to see user detail (navigation)
  const navigateUser = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedUserInstance = encodeURIComponent(
      extractWebsiteName(item?.creator?.actor_id)
    );
    const encodeduserName = encodeURIComponent(item?.creator?.name);
    navigation.push("User", {
      currentInstance: encodedCurrentInstance,
      userInstance: encodedUserInstance,
      userName: encodeduserName,
    });
  };

  //function for full image (navigation)
  const navigateFullImage = (item) => {
    navigation.push("FullImage", {
      imageUrl: item?.post?.url,
    });
  };

  // Function to toggle the saved property
  const toggleSaved = (savedStatus) => {
    setPost((prevState) => ({
      ...prevState,
      saved: savedStatus,
    }));
  };

  // Function to toggle the vote property (post)
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

  //press community
  function pressCommunity(item) {
    item?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(item)
      : navigateCommunityView(item);
  }

  //api call to get post detail on open
  const getPostInfo = async (postId, instanceURL) => {
    try {
      await getPost(postId, "https://" + instanceURL).then((result) =>
        setPost(result.post_view)
      );
    } catch (e) {}
  };

  //api call to get post detail on open
  const getCommentInfo = async (commentId, instanceURL) => {
    try {
      await getComment(commentId, "https://" + instanceURL).then((result) =>
        getPostInfo(
          result.comment_view.post.id,
          extractWebsiteName(route.params.comment_instance)
        )
      );
    } catch (e) {}
  };

  //api call to get comments
  const fetchInitialComments = async (commentId, postInstance) => {
    setCommentsLoading(true);
    setComments([]);
    try {
      const fetchedComments = await getSingleCommentThread(
        commentId,
        "https://" + postInstance,
        10
      );

      const hierarchy = makeCommentsHierarchy(fetchedComments.comments);
      setComments(hierarchy);
    } catch (e) {
    } finally {
      setTimeout(() => {
        setCommentsLoading(false);
      }, 700);
    }
  };

  //api call to get post details and comments
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      getCommentInfo(
        parseInt(route.params.comment_id),
        decodeURIComponent(route.params.comment_instance)
      );
      fetchInitialComments(
        parseInt(route.params.comment_id),
        decodeURIComponent(route.params.comment_instance)
      );
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }, [route.params, jwt])
  );

  //Delete post
  const deletePostFunction = () => {
    setLoadingDelete(true),
      deleteSelectedPost(parseInt(route.params.comment_id)),
      getPostInfo(
        parseInt(route.params.comment_id),
        decodeURIComponent(route.params.comment_instance)
      ),
      setDeletePostConfirmation(false),
      setTimeout(() => {
        setLoadingDelete(false);
      }, 1000);
  };

  useEffect(() => {
    setSameInstance(
      "https://" + decodeURIComponent(route.params.comment_instance) == instance
    );
  }, []);

  //############################################
  //           Define API Functions           //
  //############################################

  //api comment for main post
  const createMainPostComment = async (postOrReply) => {
    const decodePostInstance = decodeURIComponent(
      route.params.comment_instance
    );

    try {
      await createComment({
        post_id: parseInt(post?.post?.id),
        content: postOrReply,
      });
      setPostComment("");
      fetchInitialComments(
        parseInt(route.params.comment_id),
        decodePostInstance
      );
      setWriteComment(false);
    } catch (e) {}
  };

  //api comment for comment reply
  const createReplyComment = async (postOrReply) => {
    const decodePostInstance = decodeURIComponent(
      route.params.comment_instance
    );
    try {
      const createdComment = await createComment({
        post_id: parseInt(post?.post.id),
        content: postOrReply,
        parent_id: refCommentToReply.current,
      });
      setCommentToReply("");
      setCommentReplyContent("");
      setOriginalReplyContent("");
      fetchInitialComments(
        parseInt(route.params.comment_id),
        decodePostInstance
      );
    } catch (e) {}
  };

  //api edit comment
  const editYourComment = async (postOrReply) => {
    const decodePostInstance = decodeURIComponent(
      route.params.comment_instance
    );
    try {
      const createdComment = await editComment({
        comment_id: refCommentToEdit.current,
        content: postOrReply,
      });
      fetchInitialComments(
        parseInt(route.params.comment_id),
        decodePostInstance
      );
      setCommentToEdit("");
    } catch (e) {}
  };

  //api comment for main post
  const deleteYourComment = async () => {
    setLoadingDeleteComment(true);
    const decodePostInstance = decodeURIComponent(
      route.params.comment_instance
    );
    try {
      const deletedComment = await deleteComment({
        comment_id: refCommentToEdit.current,
        deleted: true,
      });
      setCommentToEdit("");
      setDeleteConfirmation(false);
      fetchInitialComments(
        parseInt(route.params.comment_id),
        decodePostInstance
      );
      setLoadingDeleteComment(false);
    } catch (e) {}
  };

  //create the Post Activity Score
  const activityScore =
    (post?.counts?.upvotes -
      post?.counts?.downvotes +
      post?.counts?.comments * 2) /
    getTimeDifferenceNoUnits(post?.post);

  const renderComments = (comments, level = 0) => {
    return comments?.map((item) => (
      <Comments
        item={item}
        level={level}
        commentToEdit={commentToEdit}
        setCommentToEdit={setCommentToEdit}
        post={post}
        sameInstance={sameInstance}
        renderComments={renderComments}
        setCommentToEditContent={setCommentToEditContent}
        setCommentToReply={setCommentToReply}
        setOriginalReplyContent={setOriginalReplyContent}
      />
    ));
  };

  //press View All Comments
  const navigateComments = (item) => {
    const encodedInstance = encodeURIComponent(extractWebsiteName(instance));
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("Comments", {
      post_id: item.post.id,
      post_instance: encodedInstance,
      post_name: encodedPostName,
    });
  };

  // Use useEffect to scroll to the bottom once the component is mounted
  useEffect(() => {
    commentToReply && scrollViewRef.current.scrollToEnd({ animated: false });
  }, [commentToReply]);

  //ref for scrollview
  const mainScrollViewRef = useRef();

  //press show/hide full post
  const pressShowFullPost = () => {
    mainScrollViewRef.current.scrollTo({ y: 0, animated: false });
    setShowFullPost(!showFullPost);
  };

  //switch to this instance
  const switchToThisInstance = () => {
    try {
      dispatch(
        updateItem(
          "instance",
          "https://" + window.location.href.match(/\/([^\/]+)\/post/)[1]
        )
      );
    } catch (e) {
      //alert(e);
    }
  };
  if (!post || loading) {
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
            <CommentsPlaceholders />
          </View>
        </View>
      </View>
    );
  } else {
    return (
      <View
        scrollEnabled={false}
        style={[
          styles.mainPage_Container,
          { height: isPWA ? height - pwaHeight : height, overflow: "hidden" },
        ]}
      >
        <HeaderSection />
        {(searchText?.trim().length > 0 || luckyResults?.length > 4) &&
          (searchIsFocused || searchDropdownHovering) &&
          width > 1000 && <SearchDropdownSection />}
        <Overlay //Edit Post
          isVisible={showEditPost}
          onBackdropPress={() => setShowEditPost(false)}
          fullScreen={false}
          animationType={"fade"}
          backdropStyle={{
            backgroundColor: width < 525 ? colors.white : "rgba(0,0,0,.4)",
          }}
          overlayStyle={{
            width: overlayWidth,
            height: width < 525 ? "100%" : overlayHeight,
            borderRadius: overlayRadius,
            justifyContent: "center",
            overflow: "hidden",
            backgroundColor: colors.white,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: colors.white,
            }}
          >
            <SmallSpace />
            <TouchableOpacity
              onPress={() => setShowEditPost(false)}
              style={[
                styles.xButtonContainer,
                { position: "absolute", zIndex: 2, top: 10, right: 10 },
              ]}
            >
              <Text style={styles.xButtonText}>X</Text>
            </TouchableOpacity>
            <EditableWritePostPage
              post_id={post?.post?.id}
              refreshPostDetail={() =>
                getPostInfo(
                  parseInt(route.params.post_id),
                  decodeURIComponent(route.params.comment_instance)
                )
              }
              setShowEditPost={setShowEditPost}
              nsfwTrueFalse_imported={post.post.nsfw}
              linkInput_imported={
                post?.post?.url && !isImageUrl(post.post.url)
                  ? post.post.url
                  : post.post.thumbnail_url
                  ? post.post.thumbnail_url
                  : post.post.embed_video_url
                  ? post.post.embed_video_url
                  : ""
              }
              bodyInput_imported={post.post.body ? post.post.body : ""}
              titleInput_imported={post.post.name}
              communityInput_imported={post.community.title}
              fullSelectedCommunity_imported={post.community.id}
              writeLinkImage_imported={
                isImageUrl(post.post.url) || isImageUrl(post.post.thumbnail_url)
                  ? "Image"
                  : post.post.url || post.post.embed_video_url
                  ? "Link"
                  : "Write"
              }
            />
          </ScrollView>
        </Overlay>

        <Overlay //Edit Comment
          isVisible={commentToEdit}
          onBackdropPress={() => setCommentToEdit("")}
          fullScreen={false}
          animationType={"fade"}
          overlayStyle={{
            padding: 0,
            width: overlayWidth,
            borderRadius: overlayRadius,
            height: width < 525 ? "100%" : 600,
            overflow: "hidden",
            backgroundColor: colors.white,
            zIndex: 2,
          }}
        >
          <View style={styles.space} />

          <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
            <View style={styles.spaceSmall} />
            <Text style={styles.loginPageTitle}>Edit Comment</Text>
            <TouchableOpacity
              onPress={() => setCommentToEdit("")}
              style={[
                styles.xButtonContainer,
                { position: "absolute", zIndex: 2, top: 10, right: 10 },
              ]}
            >
              <Text style={styles.xButtonText}>X</Text>
            </TouchableOpacity>
            <View style={styles.space} />

            <PostAndReply
              placeholder={"Edit a comment..."}
              addDelete={true}
              existingText={commentToEditContent}
              postAction={editYourComment}
              actionButtonText={"Edit"}
              chosenFont_ExtraBold={chosenFont_ExtraBold}
              deleteAction={deleteYourComment}
              loadingDelete={loadingDeleteComment}
              inputHeight={170}
              autoFocus={true}
            />
          </View>
        </Overlay>

        <Overlay //Reply to Comment
          isVisible={commentToReply}
          onBackdropPress={() => setCommentToReply("")}
          fullScreen={false}
          animationType={"fade"}
          overlayStyle={{
            padding: 0,
            width: overlayWidth,
            borderRadius: overlayRadius,
            height: width < 525 ? "100%" : overlayHeight,
            overflow: "hidden",
            backgroundColor: colors.white,
            zIndex: 2,
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View style={styles.space} />

            <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
              <TouchableOpacity
                onPress={() => setCommentToReply("")}
                style={[
                  styles.xButtonContainer,
                  { position: "absolute", zIndex: 2, top: 10, right: 10 },
                ]}
              >
                <Text style={styles.xButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.spaceSmall} />
              <Text style={styles.loginPageTitle}>Comment Reply</Text>
              <View style={styles.space} />
              {commentToReply && (
                <View //original comment content
                  style={{
                    padding: 10,
                    borderLeftWidth: 5,
                    marginBottom: 20,
                    borderColor: colors.blue,
                    backgroundColor: colors.lightGreyShade2,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                  }}
                >
                  <RenderText
                    body={originalReplyContent}
                    navigation={navigation}
                    colors={colors}
                    fontSize={fontSize}
                    instance={instance}
                  />
                </View>
              )}
              <PostAndReply
                placeholder={"Reply to a comment..."}
                addDelete={false}
                existingText={""}
                postAction={createReplyComment}
                actionButtonText={"Reply"}
                chosenFont_ExtraBold={chosenFont_ExtraBold}
                deleteAction={deleteYourComment}
                inputHeight={170}
                autoFocus={true}
              />
            </View>
          </ScrollView>
        </Overlay>

        <Overlay //Write a Comment
          isVisible={writeComment}
          onBackdropPress={() => setWriteComment(false)}
          fullScreen={false}
          animationType={"fade"}
          overlayStyle={{
            padding: 0,
            width: overlayWidth,
            borderRadius: overlayRadius,
            height: width < 525 ? "100%" : overlayHeight,
            overflow: "hidden",
            backgroundColor: colors.white,
            zIndex: 2,
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View style={styles.space} />

            <View style={{ paddingHorizontal: 25, paddingVertical: 10 }}>
              <TouchableOpacity
                onPress={() => setWriteComment(false)}
                style={[
                  styles.xButtonContainer,
                  { position: "absolute", zIndex: 2, top: 10, right: 10 },
                ]}
              >
                <Text style={styles.xButtonText}>X</Text>
              </TouchableOpacity>
              <View style={styles.spaceSmall} />
              <Text style={styles.loginPageTitle}>Comment</Text>
              <View style={styles.space} />
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: colors.lightGreyShade2,
                  borderRadius: 10,
                  padding: 10,
                }}
              >
                <View style={{ width: "70%", justifyContent: "center" }}>
                  <Text //title
                    style={[
                      styles.itemText,
                      {
                        paddingHorizontal: 0,
                        color: colors.black,
                        fontSize: 18,
                        fontFamily: chosenFont_Regular,
                      },
                    ]}
                  >
                    {post.post.name}
                  </Text>
                </View>
                <View
                  style={{
                    width:
                      !isImageUrl(post.post.thumbnail_url) &&
                      !isImageUrl(post.post.url) &&
                      !isVideo(post.post.embed_video_url)
                        ? "0%"
                        : "30%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isImageUrl(post.post.thumbnail_url) &&
                    !isVideo(post.post.embed_video_url) && (
                      <Animated.Image
                        sharedTransitionTag="fullImage"
                        resizeMode="contain"
                        source={{
                          uri: post.post.thumbnail_url,
                        }}
                        placeholder={{
                          uri: post.post.thumbnail_url,
                        }}
                        style={[
                          styles.largeImageThumbnail,
                          { width: "80%", borderRadius: 10, marginBottom: 0 },
                        ]}
                      />
                    )}
                  {!isImageUrl(post.post.thumbnail_url) &&
                    isImageUrl(post.post.url) &&
                    !isVideo(post.post.embed_video_url) && (
                      <Animated.Image
                        sharedTransitionTag="fullImage"
                        source={{
                          uri: post.post.url,
                        }}
                        placeholder={{
                          uri: post.post.url,
                        }}
                        resizeMode="contain"
                        style={[
                          styles.largeImageThumbnail,
                          { width: "80%", borderRadius: 10, marginBottom: 0 },
                        ]}
                      />
                    )}
                  {isVideo(post.post.embed_video_url) && (
                    <TouchableOpacity
                      disabled // Disable touch events for the wrapped Video component
                      style={[
                        styles.largeVideo,
                        {
                          overflow: "hidden",
                          justifyContent: "center",
                          width: "80%",
                          borderRadius: 10,
                          marginBottom: 0,
                        },
                      ]}
                    >
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
                </View>
              </View>
              <View style={styles.spaceSmall} />
              <PostAndReply
                placeholder={"Leave a comment..."}
                addDelete={false}
                existingText={""}
                postAction={createMainPostComment}
                actionButtonText={"Comment"}
                chosenFont_ExtraBold={chosenFont_ExtraBold}
                deleteAction={deleteYourComment}
                inputHeight={170}
                autoFocus={true}
              />
            </View>
          </ScrollView>
        </Overlay>

        <View
          scrollEnabled={false}
          style={{
            flexDirection: "row",
            width: "100%",
            height: "100%",
          }}
        >
          <BlankBarSection />
          <LeftBarList />

          <ScrollView
            ref={mainScrollViewRef}
            style={{
              width:
                width <= 1000
                  ? centerPanelWidthNonDesktop
                  : centerPanelWidthMedium,
            }}
            scrollEventThrottle={16}
            contentContainerStyle={{
              paddingHorizontal: centerPanelPadding,
              width:
                width <= 1000
                  ? centerPanelWidthNonDesktop
                  : centerPanelWidthMedium,
            }}
            showsVerticalScrollIndicator={false}
          >
            <View scrollEnabled={false} style={{ flexDirection: "row" }}>
              <View
                style={{
                  marginRight: 20,
                  width: "100%",
                }}
              >
                <View
                  style={[
                    styles.row,
                    {
                      alignItems: "center",
                      marginBottom: 5,
                      paddingLeft: 10,
                    },
                  ]}
                >
                  <PageTitle text={"Comments"} />
                </View>
                {post.post.deleted && (
                  <View
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      borderColor: colors.red,
                      backgroundColor: colors.lightRed,
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={[styles.smallSectionTitles, { color: colors.red }]}
                    >
                      This post has been deleted
                    </Text>
                  </View>
                )}
                {!sameInstance && jwt && (
                  <View style={styles.diffInstanceErrorContainer}>
                    <View style={{ width: 20, height: 20 }}>
                      <IconAlertTriangle
                        size={20}
                        stroke={2.0}
                        color={colors.greyShade4}
                      />
                    </View>

                    <Text style={styles.diffInstanceErrorText}>
                      This post is on a different instance and is only available
                      in view-mode.
                    </Text>
                    {!jwt && (
                      <Pressable
                        onHoverIn={() => setHoveredSwitchInstance(true)}
                        onHoverOut={() => setHoveredSwitchInstance(false)}
                      >
                        <Text
                          style={[
                            styles.blueText,
                            {
                              color: hoveredSwitchInstance
                                ? colors.blueShade1
                                : colors.blueShade2,
                              fontFamily: chosenFont_ExtraBold,
                            },
                          ]}
                          onPress={() => switchToThisInstance()}
                        >
                          Switch to this Instance
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
                <View
                  style={[
                    styles.itemContainer,
                    {
                      padding: 10,
                      paddingBottom: 0,
                      width: "100%",
                    },
                  ]}
                >
                  {post.post.nsfw && (
                    <View //nsfw
                      style={[
                        styles.nsfwContainer,
                        { position: "absolute", right: 20 },
                      ]}
                    >
                      <Text style={styles.nsfwText}>NSFW</Text>
                    </View>
                  )}

                  <View //post meta
                    style={[styles.mainInfos, { width: "100%" }]}
                  >
                    <View style={styles.fullWidth}>
                      <View
                        style={[
                          styles.postInfo,
                          { paddingLeft: 0, width: "100%" },
                        ]}
                      >
                        {post.community.icon && (
                          <TouchableOpacity
                            onPress={() => pressCommunity(post)}
                          >
                            <Image
                              source={{ uri: post.community.icon }}
                              placeholder={{ uri: post.community.icon }}
                              style={[
                                styles.communityIcon,
                                { height: 40, width: 40 },
                              ]}
                            />
                          </TouchableOpacity>
                        )}
                        <View style={styles.fullWidth}>
                          <View
                            style={[
                              styles.preventTouchableRow,
                              {
                                maxWidth: "90%",
                                flexDirection: "row",
                              },
                            ]}
                          >
                            <Pressable
                              onHoverIn={() => setCommunityHovering(true)}
                              onHoverOut={() => setCommunityHovering(false)}
                              onPress={() => pressCommunity(post)}
                              style={{
                                maxWidth: "100%",
                              }}
                            >
                              <View
                                style={[
                                  styles.preventTouchableRow,
                                  {
                                    maxWidth: "100%",
                                  },
                                ]}
                              >
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={{
                                    fontFamily: chosenFont_ExtraBold,
                                    color: colors.greyShade5,
                                    fontSize: 16 + fontSize * 0.4,
                                    textDecorationLine:
                                      communityHovering && "underline",
                                  }}
                                >
                                  {post.community.title}
                                </Text>
                              </View>
                            </Pressable>
                          </View>

                          <View style={styles.centeredRow}>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={{
                                color: colors.greyShade3,
                                fontFamily: chosenFont_Bold,
                                fontSize: 14 + fontSize * 0.4,
                              }}
                            >
                              {getTimeDifference(post.post)}
                            </Text>
                            <Text style={styles.metaDataSpacer}>·</Text>
                            {post.creator.display_name ? (
                              <Pressable
                                onHoverIn={() => {
                                  setUserHovering(true);
                                }}
                                onHoverOut={() => setUserHovering(false)}
                                onPress={() => navigateUser(post)}
                              >
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={{
                                    color: colors.greyShade3,
                                    fontFamily: chosenFont_Bold,
                                    fontSize: 14 + fontSize * 0.4,
                                    textDecorationLine:
                                      userHovering && "underline",
                                  }}
                                >
                                  {post.creator.display_name}
                                </Text>
                              </Pressable>
                            ) : (
                              <Pressable
                                onHoverIn={() => {
                                  setUserHovering(true);
                                }}
                                onHoverOut={() => setUserHovering(false)}
                                onPress={() => navigateUser(post)}
                              >
                                <Text
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                  style={{
                                    color: colors.greyShade3,
                                    fontFamily: chosenFont_Bold,
                                    fontSize: 14 + fontSize * 0.4,
                                    textDecorationLine:
                                      userHovering && "underline",
                                  }}
                                >
                                  {post.creator.name}
                                </Text>
                              </Pressable>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {post?.creator.id ==
                    currentUserInfo?.person_view?.person?.id &&
                    !post.post.deleted && (
                      <View //post stats
                        style={{
                          flex: 1,
                          marginTop: 10,
                          borderRadius: 10,
                          backgroundColor: colors.greyShade1,
                          borderWidth: 2,
                          borderColor: colors.greyShade2,
                          alignItems: "center",
                          padding: 10,
                          paddingBottom: 5,
                        }}
                      >
                        {deletePostConfirmation ? (
                          <Text
                            style={[
                              styles.smallSectionTitles,
                              { color: colors.black },
                            ]}
                          >
                            Are you sure you want to delete this post?
                          </Text>
                        ) : (
                          <Text style={styles.smallSectionTitles}>
                            THIS IS ONLY VISIBLE TO YOU
                          </Text>
                        )}

                        <ScrollView
                          horizontal
                          style={styles.fullWidth}
                          contentContainerStyle={{
                            paddingTop: 10,
                            width: "100%",
                            gap: 10,
                            justifyContent:
                              width <= 530
                                ? "flex-start"
                                : width <= 1000
                                ? "center"
                                : width <= 1055
                                ? "flex-start"
                                : "center",
                          }}
                        >
                          {!deletePostConfirmation && (
                            <Pressable //edit
                              onHoverIn={() => setHoveredEdit(true)}
                              onHoverOut={() => setHoveredEdit(false)}
                              style={styles.radiusSmall}
                            >
                              <TouchableOpacity
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: 8,
                                  paddingHorizontal: 20,
                                  borderRadius: 10,
                                  gap: 5,
                                  alignItems: "center",
                                  backgroundColor: hoveredEdit
                                    ? colors.blueShade1
                                    : colors.blueShade2,
                                  shadowColor: colors.blueShade3,
                                  shadowOpacity: 1,
                                  shadowRadius: 0,
                                  shadowOffset: {
                                    height: 4,
                                    width: 0,
                                  },
                                }}
                                onPress={() => setShowEditPost(true)}
                              >
                                <Text
                                  style={[
                                    styles.voteCount,
                                    {
                                      fontSize: 14 + fontSize,
                                      paddingLeft: 0,
                                      color: "white",
                                    },
                                  ]}
                                >
                                  Edit
                                </Text>
                              </TouchableOpacity>
                            </Pressable>
                          )}
                          {!deletePostConfirmation && (
                            <Pressable //delete
                              onHoverIn={() => setHoveredDelete(true)}
                              onHoverOut={() => setHoveredDelete(false)}
                              style={styles.radiusSmall}
                            >
                              <TouchableOpacity
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: 8,
                                  paddingHorizontal: 20,
                                  borderRadius: 10,
                                  gap: 5,
                                  alignItems: "center",
                                  backgroundColor: hoveredDelete
                                    ? makeColorLighter(colors.red)
                                    : colors.red,
                                  shadowColor: colors.darkRed,
                                  shadowOpacity: 1,
                                  shadowRadius: 0,
                                  shadowOffset: {
                                    height: 4,
                                    width: 0,
                                  },
                                }}
                                onPress={() => setDeletePostConfirmation(true)}
                              >
                                <Text
                                  style={[
                                    styles.voteCount,
                                    {
                                      fontSize: 14 + fontSize,
                                      paddingLeft: 0,
                                      color: "white",
                                    },
                                  ]}
                                >
                                  Delete
                                </Text>
                              </TouchableOpacity>
                            </Pressable>
                          )}
                          {!deletePostConfirmation && width > 400 && (
                            <View //votes
                              style={[
                                styles.centeredRow,
                                {
                                  backgroundColor: colors.white,
                                  borderRadius: 10,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderWidth: 2,
                                  borderColor: colors.greyShade2,
                                  paddingHorizontal: 5,
                                  paddingVertical: 5,
                                },
                              ]}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  borderRightWidth: 2,
                                  borderColor: colors.greyShade2,
                                  gap: 5,
                                  alignItems: "center",
                                  paddingHorizontal: 10,

                                  justifyContent: "center",
                                }}
                              >
                                <IconArrowBigUp
                                  size={25}
                                  stroke={2.0}
                                  color={colors.greyShade3}
                                  opacity={0.7}
                                />
                                <Text
                                  style={[
                                    styles.voteCount,
                                    {
                                      fontSize: 14 + fontSize,
                                      paddingLeft: 0,
                                      color: colors.greyShade3,
                                      fontFamily: chosenFont_ExtraBold,
                                    },
                                  ]}
                                >
                                  {post?.counts?.upvotes}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  paddingHorizontal: 10,
                                  gap: 5,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <IconArrowBigDown
                                  size={25}
                                  stroke={2.0}
                                  color={colors.greyShade3}
                                  opacity={0.7}
                                />
                                <Text
                                  style={[
                                    styles.voteCount,
                                    {
                                      fontSize: 14 + fontSize,
                                      paddingLeft: 0,
                                      color: colors.greyShade3,
                                      fontFamily: chosenFont_ExtraBold,
                                    },
                                  ]}
                                >
                                  -{post?.counts?.downvotes}
                                </Text>
                              </View>
                            </View>
                          )}

                          {!deletePostConfirmation && post && (
                            <Pressable //trending
                              onHoverIn={() => setHoveredTrending(true)}
                              onHoverOut={() => setHoveredTrending(false)}
                            >
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.push("LearnMorePostActivity")
                                }
                                style={{
                                  flexDirection: "row",
                                  paddingVertical: 5,
                                  paddingHorizontal: 10,
                                  borderRadius: 10,
                                  gap: 5,
                                  alignItems: "center",
                                  backgroundColor: colors.white,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderWidth: 2,
                                  borderColor: hoveredTrending
                                    ? colors.greyShade3
                                    : colors.greyShade2,
                                }}
                              >
                                <IconActivity
                                  size={25}
                                  stroke={2.0}
                                  color={
                                    hoveredTrending
                                      ? colors.greyShade4
                                      : colors.greyShade3
                                  }
                                  opacity={0.7}
                                />
                                <Text
                                  style={[
                                    styles.voteCount,
                                    {
                                      fontSize: 14 + fontSize,
                                      paddingLeft: 0,
                                      color: hoveredTrending
                                        ? colors.greyShade4
                                        : colors.greyShade3,
                                      fontFamily: chosenFont_ExtraBold,
                                    },
                                  ]}
                                >
                                  {getTimeDifferenceNoUnits(post.post) <= 5
                                    ? "Slowly rising!"
                                    : activityScore > 2
                                    ? "You're trending!"
                                    : activityScore > 1
                                    ? "On the rise!"
                                    : activityScore > 0.5
                                    ? "Slowly rising!"
                                    : activityScore > 0.1
                                    ? "Some activity"
                                    : activityScore < 0
                                    ? "Going down"
                                    : "No Activity"}
                                </Text>
                              </TouchableOpacity>
                            </Pressable>
                          )}
                          {deletePostConfirmation && (
                            <View
                              style={{
                                flexDirection: "row",
                                paddingVertical: 10,
                                gap: 10,
                              }}
                            >
                              <GenericButton
                                text={"CANCEL"}
                                noText={false}
                                disabled={loadingDelete}
                                includeBorder={true}
                                textColor={colors.greyShade3}
                                cancelButton={true}
                                background={colors.red}
                                size={"small"}
                                shadowColor={colors.greyShade3}
                                action={() => setDeletePostConfirmation(false)}
                                includeIcon={false}
                                icon={"pencil"}
                                loadingIndicator={false}
                                tall={false}
                              />
                              <GenericButton
                                text={"DELETE"}
                                noText={false}
                                disabled={loadingDelete}
                                includeBorder={false}
                                textColor={"white"}
                                cancelButton={false}
                                background={colors.red}
                                size={"small"}
                                shadowColor={colors.darkRed}
                                action={() => deletePostFunction()}
                                includeIcon={false}
                                icon={"pencil"}
                                loadingIndicator={loadingDelete}
                                tall={false}
                              />
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  <TouchableOpacity
                    disabled={
                      isImageUrl(post.post.url) || !post?.post?.url?.length > 0
                    }
                    onPress={() => externalURL(post.post.url)}
                  >
                    <Text //title
                      style={[
                        styles.itemText,
                        {
                          paddingHorizontal: 0,
                          color: colors.black,
                          fontSize: 25,
                          fontFamily: chosenFont_ExtraBold,
                        },
                      ]}
                    >
                      {post.post.name}
                    </Text>
                    {isImageUrl(post.post.thumbnail_url) &&
                      !isVideo(post.post.embed_video_url) && (
                        <TouchableOpacity
                          disabled={!isImageUrl(post.post.url)}
                          activeOpacity={0.7}
                          onPress={() => navigateFullImage(post)}
                        >
                          <Animated.Image
                            sharedTransitionTag="fullImage"
                            resizeMode="contain"
                            source={{
                              uri: post.post.thumbnail_url,
                            }}
                            placeholder={{
                              uri: post.post.thumbnail_url,
                            }}
                            style={[
                              styles.largeImageThumbnail,
                              { borderRadius: 10 },
                            ]}
                          />
                        </TouchableOpacity>
                      )}
                    {!isImageUrl(post.post.thumbnail_url) &&
                      isImageUrl(post.post.url) && (
                        <TouchableOpacity
                          activeOpacity={0.7}
                          onPress={() =>
                            navigation.push("FullImage", {
                              imageUrl: post?.post?.url,
                            })
                          }
                        >
                          <Animated.Image
                            sharedTransitionTag="fullImage"
                            resizeMode="contain"
                            source={{
                              uri: post.post.url,
                            }}
                            placeholder={{
                              uri: post.post.url,
                            }}
                            style={[
                              styles.largeImageThumbnail,
                              { borderRadius: 10 },
                            ]}
                          />
                        </TouchableOpacity>
                      )}
                    {isVideo(post.post.embed_video_url) && (
                      <TouchableOpacity
                        disabled // Disable touch events for the wrapped Video component
                        style={[
                          styles.largeVideo,
                          {
                            borderRadius: 10,
                            overflow: "hidden",
                            justifyContent: "center",
                          },
                        ]}
                      >
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
                  </TouchableOpacity>
                  {post.post.url && !isImageUrl(post.post.url) && (
                    <Pressable
                      disabled={isImageUrl(post.post.url)}
                      onPress={() => externalURL(post.post.url)}
                    >
                      <Text
                        numberOfLines={1}
                        style={[
                          styles.itemSource,
                          { marginBottom: 5, paddingHorizontal: 0 },
                        ]}
                      >
                        {"Source: " + extractWebsiteName(post.post.url)}
                      </Text>
                    </Pressable>
                  )}

                  {post.post.body && showFullPost && (
                    <View
                      style={{
                        paddingHorizontal: 0,
                        paddingTop: 10,
                      }}
                    >
                      <RenderText
                        body={post.post.body}
                        navigation={navigation}
                        colors={colors}
                        fontSize={fontSize}
                        instance={instance}
                      />
                    </View>
                  )}
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
                        bottom: 55,
                        right: 150,
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
                  <View
                    style={{
                      height: 60,
                      width: "100%",
                    }}
                  >
                    <View
                      style={[
                        styles.meta,
                        {
                          justifyContent: "flex-end",
                          borderBottomWidth: 3,
                          borderColor: post?.post?.body
                            ? "transparent"
                            : colors.greyShade1,
                          marginBottom: post?.post?.body ? 0 : 3,
                          paddingBottom: 10,

                          paddingHorizontal: 0,
                        },
                      ]}
                    >
                      <View style={{ flexDirection: "row", gap: 5 }}>
                        <SharePost
                          setPostHovering={setPostHovering}
                          item={post}
                          setShowCopied={setShowCopied}
                        />
                        {sameInstance && (
                          <SavePost
                            // bookmarkHovering={bookmarkHovering}
                            // setBookmarkHovering={setBookmarkHovering}
                            setPostHovering={setPostHovering}
                            post={post}
                            toggleSaved={toggleSaved}
                          />
                        )}
                        {sameInstance && (
                          <Voting
                            setPostHovering={setPostHovering}
                            downArrowHovering={downArrowHovering}
                            setDownArrowHovering={setDownArrowHovering}
                            upArrowHovering={upArrowHovering}
                            setUpArrowHovering={setUpArrowHovering}
                            voteDownAction={
                              post.post.deleted ? console.log : voteDownPost
                            }
                            voteUpAction={
                              post.post.deleted ? console.log : voteUpPost
                            }
                            item={post}
                            toggleVote={toggleVote}
                            postOrCommentID={post?.post?.id}
                            backgroundColor={colors.greyMeta}
                            borderWidth={0}
                            borderRadius={100}
                            borderColor={colors.lightGreyShade4}
                          />
                        )}
                      </View>
                    </View>
                  </View>
                  {post?.post?.body && (
                    <View
                      style={{
                        flexDirection: "row",
                        marginBottom: 5,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          height: 3,
                          backgroundColor: colors.greyShade1,
                        }}
                      />
                      <GenericButton
                        text={showFullPost ? "HIDE POST" : "SHOW FULL POST"}
                        noText={false}
                        disabled={false}
                        includeBorder={true}
                        textColor={colors.greyShade3}
                        cancelButton={false}
                        background={colors.white}
                        size={"large"}
                        shadowColor={colors.greyShade1}
                        action={() => pressShowFullPost()}
                        includeIcon={false}
                        loadingIndicator={false}
                        icon={""}
                      />
                      <View
                        style={{
                          flex: 1,
                          height: 3,
                          backgroundColor: colors.greyShade1,
                        }}
                      />
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  position: "absolute",
                  right: -width * rightBarWidth - 20,
                }}
              >
                <RightBarSection
                  showInstanceDetail={false}
                  showCommunityDetails={sameInstance ? true : false}
                  postDetail={post}
                  updateCommunity={() =>
                    setPost((prevState) => ({
                      ...prevState,
                      subscribed:
                        post?.subscribed != "Pending" &&
                        post?.subscribed == "Subscribed"
                          ? "NotSubscribed"
                          : "Subscribed",
                    }))
                  }
                />
              </View>
            </View>

            {commentsLoading ? (
              <View
                style={{
                  paddingHorizontal: centerPanelPadding,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 100,
                  }}
                >
                  <Text
                    style={{
                      paddingBottom: 10,
                      color: colors.greyShade4,
                      fontSize: 14 + fontSize,
                      fontFamily: chosenFont_ExtraBold,
                    }}
                  >
                    Loading Comments
                  </Text>
                  <ActivityIndicator color={colors.grey} />
                </View>
              </View>
            ) : (
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 12,
                }}
              >
                <View style={{}}>
                  {comments?.length > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 25,
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.greyShade3,
                          fontSize: 13 + fontSize,
                          fontFamily: chosenFont_ExtraBold,
                          paddingRight: 5,
                        }}
                      >
                        SINGLE COMMENT THREAD
                      </Text>
                      <View
                        style={{
                          flex: 1,
                          height: 1,
                          backgroundColor: colors.greyShade1,
                        }}
                      />
                      <Pressable
                        onHoverIn={() => setHoveredViewAllComments(true)}
                        onHoverOut={() => setHoveredViewAllComments(false)}
                        style={{
                          paddingLeft: 5,
                          height: 30,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onPress={() => navigateComments(post)}
                      >
                        <Text
                          style={{
                            fontFamily: chosenFont_Bold,
                            color: hoveredViewAllComments
                              ? colors.blueShade1
                              : colors.blueShade2,
                          }}
                        >
                          View All Comments
                        </Text>
                      </Pressable>
                    </View>
                  )}
                </View>
                {comments?.length == 0 && (
                  <View
                    style={{
                      paddingVertical: 30,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontFamily: chosenFont_Bold,
                        fontSize: 16 + fontSize,
                        color: colors.greyShade4,
                      }}
                    >
                      - - No Comments Found - -
                    </Text>
                  </View>
                )}
                <View style={{ paddingRight: centerPanelPadding }}>
                  {comments?.length > 0 && renderComments(comments)}
                </View>
              </View>
            )}

            <View
              style={{
                height: 125,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {!commentsLoading && comments?.length > 0 && (
                <Text style={styles.noMoreComments}>
                  -- No More Comments --
                </Text>
              )}
            </View>
          </ScrollView>

          <BlankBarSection />
        </View>
      </View>
    );
  }
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
    instance: state.updateItem.reduxGlobal.instance,
    soundOnVideos: state.updateItem.reduxGlobal.soundOnVideos,
  };
};

// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SpecificCommentPage);

export default withColorScheme(ConnectedComponent);
