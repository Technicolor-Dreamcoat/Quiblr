import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import useLemmyApi from "../../../hooks/useLemmyApi";
import {
  extractWebsiteName,
  isImageUrl,
  RenderText,
  getTimeDifference,
} from "../../../actions";
import { StateContext } from "../../../StateContext";
import { useNavigation } from "@react-navigation/native";
import Voting from "../../../items/components/Voting";
import { Octicons } from "@expo/vector-icons";

const UserComments = ({
  colors,
  fontSize,
  styles,
  instance,
  item,
  blurNSFWSettings,
}) => {
  const { centerPanelPadding, chosenFont_ExtraBold, confirmedNsfw } =
    useContext(StateContext);
  const navigation = useNavigation();

  const { likeComment } = useLemmyApi();
  const [commentHovering, setCommentHovering] = useState(false);
  const [downArrowHovering, setDownArrowHovering] = useState(false);
  const [upArrowHovering, setUpArrowHovering] = useState(false);
  const [comment, setComment] = useState(item);

  //############################################
  //               NAVIGATION                 //
  //############################################

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

  //function for comments (navigation)
  const navigateComments = (item) => {
    const encodedInstance = encodeURIComponent(extractWebsiteName(instance));
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("SpecificComment", {
      comment_id: item.comment.id,
      comment_instance: encodedInstance,
      post_name: encodedPostName,
      post_id: item.post_id,
    });
  };

  //function to see user detail (navigation)
  const pressUser = (item) => {
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

  // Function to toggle the vote property
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

  //api call to downvote comments
  const voteDownComment = async (item, voteScore) => {
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

  //api call to upvote comments
  const voteUpComment = async (item, voteScore) => {
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
  if (!comment) {
    return <ActivityIndicator />;
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
        style={{
          marginHorizontal: centerPanelPadding,
          marginVertical: 10,
          borderRadius: 20,
          opacity: comment?.comment?.deleted ? 0.5 : 1,
        }}
      >
        <View>
          <View
            style={{
              transitionDuration: "150ms",
              padding: 5,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: commentHovering ? colors.greyShade2 : "transparent",
              backgroundColor: commentHovering
                ? colors.greyShade1
                : colors.white,
            }}
          >
            <View //top bar
              style={styles.commentBar}
            >
              <View style={styles.centeredRow}>
                <TouchableOpacity
                  style={styles.centeredRow}
                  onPress={() => pressUser(comment)}
                >
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
                <View style={[styles.row, { alignItems: "center", gap: 5 }]}>
                  <TouchableOpacity
                    style={[styles.centeredRow]}
                    onPress={() => pressUser(comment)}
                  >
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

                  <Text style={styles.postTime}>
                    {getTimeDifference(comment?.comment)}
                  </Text>
                  {comment?.comment?.deleted && (
                    <Text
                      style={[
                        styles.postTime,
                        {
                          fontStyle: "italic",
                          paddingLeft: 0,
                          color: colors.red,
                        },
                      ]}
                    >
                      Deleted
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                transitionDuration: "150ms",
                gap: 10,
                borderRadius: 10,
                padding: 10,
                backgroundColor: commentHovering
                  ? colors.greyShade2
                  : colors.greyShade1,
                borderWidth: 2,
                borderColor: commentHovering
                  ? colors.greyShade3
                  : colors.greyShade2,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
              >
                {comment?.community?.icon ? (
                  <Image
                    blurRadius={
                      blurNSFWSettings && comment?.community?.nsfw && 10
                    }
                    source={{ uri: comment?.community?.icon }}
                    style={[
                      styles.communityIcon,
                      {
                        backgroundColor: colors.lightGreyShade2,
                        width: 20,
                        height: 20,
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
                      width: 20,
                      height: 20,
                      marginRight: 5,
                    }}
                  >
                    <Octicons
                      size={13}
                      name={"people"}
                      color={colors.greyShade3}
                    />
                  </View>
                )}

                <Text
                  style={{
                    fontFamily: chosenFont_ExtraBold,
                    color: colors.greyShade5,
                    fontSize: 12 + fontSize * 0.4,
                  }}
                >
                  {comment.community.title}
                </Text>
              </View>
              <View style={[styles.commentOriginalPost, { padding: 0 }]}>
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
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
    blurNSFWSettings: state.updateItem.reduxGlobal.blurNSFWSettings,
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(UserComments);

export default withColorScheme(ConnectedComponent);
