import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import Voting from "../../../items/components/Voting";
import { StateContext } from "../../../StateContext";
import { useNavigation } from "@react-navigation/native";
import * as Clipboard from "expo-clipboard";
import {
  extractWebsiteName,
  getTimeDifference,
  RenderText,
} from "../../../actions";
import { useSharedValue } from "react-native-reanimated";
import Collapsible from "react-native-collapsible";

const Comments = ({
  colors,
  fontSize,
  styles,
  instance,
  item,
  level,
  commentToEdit,
  setCommentToEdit,
  post,
  sameInstance,
  renderComments,
  setCommentToEditContent,
  setCommentToReply,
  setOriginalReplyContent,
}) => {
  const {
    chosenFont_Bold,
    IconClipboard,
    IconEdit,
    IconMessageCirclePlus,
    IconUser,
    jwt,
    likeComment,
    signedInUserInfo,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [collapsed, setCollapsed] = useState(false);
  const [postHovering, setPostHovering] = useState(false);
  const [replyHovering, setReplyHovering] = useState(false);
  const [downArrowHovering, setDownArrowHovering] = useState(false);
  const [upArrowHovering, setUpArrowHovering] = useState(false);
  const [comment, setComment] = useState(item);
  const [copiedComment, setCopiedComment] = useState(false);

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

  //copy comment link
  const copyCommentLink = async (item) => {
    try {
      await Clipboard.setStringAsync(
        "https://quiblr.com/instance/" +
          extractWebsiteName(instance) +
          "/comment/" +
          item.comment.id
      );
      setCopiedComment(true);
      setTimeout(() => {
        setCopiedComment(false);
      }, 2000);
    } catch (e) {}
  };

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

  //collapse comment nest
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  // initial offset for the animation
  const offset = useSharedValue(0);

  useEffect(() => {
    if (!collapsed) {
      offset.value = 0;
    } else {
      offset.value = 50 + level * 50;
    }
  }, [collapsed, level]);

  if (!comment) {
    return;
  } else {
    return (
      <View
        key={comment?.comment?.id}
        style={[
          level == 0 ? styles.rootCommentContainer : styles.commentContainer,
          {
            marginHorizontal: 0,
          },
        ]}
      >
        <Pressable
          onHoverIn={() => setPostHovering(true)}
          onHoverOut={() => setPostHovering(false)}
          disabled={comment?.comment?.id == commentToEdit}
          onPress={
            comment?.counts?.child_count > 0 ? toggleCollapsed : console.log
          }
          activeOpacity={1}
          delayPressIn={0}
          style={{
            borderRadius: 20,
          }}
        >
          <View>
            <View
              style={{
                transitionDuration: "150ms",
                opacity: comment?.comment?.deleted ? 0.5 : 1,
                backgroundColor: postHovering && colors.greyShade1,
                marginLeft: level <= 0 ? 0 : 20,
                borderLeftWidth: level > 0 && 2,
                paddingLeft: level == 0 ? 0 : level == 1 ? 5 : level * 12,
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                borderColor: colors.greyShade2,
              }}
            >
              <View //top bar
                style={{ marginBottom: 5 }}
              >
                <View style={[styles.centeredRow, { width: "100%" }]}>
                  <TouchableOpacity
                    onPress={() => pressUser(comment)}
                    style={styles.centeredRow}
                  >
                    {comment?.creator?.avatar ? (
                      <Image
                        source={{ uri: comment?.creator?.avatar }}
                        style={[
                          styles.commentAvatar,
                          {
                            width: level == 0 ? 40 : 25,
                            height: level == 0 ? 40 : 25,
                          },
                        ]}
                        placeholder={{ uri: comment?.creator?.avatar }}
                      />
                    ) : (
                      <View
                        style={[
                          styles.commentAvatarPlaceholderContainer,
                          {
                            width: level == 0 ? 40 : 25,
                            height: level == 0 ? 40 : 25,
                          },
                        ]}
                      >
                        <IconUser
                          size={level == 0 ? 25 : 18}
                          stroke={2.0}
                          color={colors.grey}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  <View
                    style={[
                      styles.row,
                      {
                        alignItems: "center",
                        width: "100%",
                        gap: 5,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => pressUser(comment)}
                      style={[styles.centeredRow, { gap: 5 }]}
                    >
                      {comment?.creator?.display_name ? (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.commentCreator,
                            {
                              maxWidth: width * 0.3,
                              color:
                                comment?.comment?.creator_id ==
                                signedInUserInfo?.person_view?.person?.id
                                  ? colors.blue
                                  : post.post.creator_id ==
                                    comment?.comment?.creator_id
                                  ? colors.green
                                  : colors.black,
                            },
                          ]}
                        >
                          {comment?.creator?.display_name}
                        </Text>
                      ) : (
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.commentCreator,
                            {
                              maxWidth: width * 0.3,
                              color:
                                comment?.comment?.creator_id ==
                                signedInUserInfo?.person_view?.person?.id
                                  ? colors.blue
                                  : post.post.creator_id ==
                                    comment?.comment?.creator_id
                                  ? colors.green
                                  : colors.black,
                            },
                          ]}
                        >
                          {comment?.creator?.name}
                        </Text>
                      )}
                      {comment?.comment?.creator_id ==
                        signedInUserInfo?.person_view?.person?.id && (
                        <Text
                          style={[
                            styles.commentCreator,
                            {
                              color: colors.blue,
                            },
                          ]}
                        >
                          (You)
                        </Text>
                      )}
                      {post.post.creator_id == comment?.comment?.creator_id && (
                        <Text
                          style={[
                            styles.commentCreator,
                            {
                              color: colors.green,
                            },
                          ]}
                        >
                          (OP)
                        </Text>
                      )}
                    </TouchableOpacity>
                    <Text style={[styles.postTime, { paddingLeft: 0 }]}>
                      {getTimeDifference(comment?.comment)}
                    </Text>
                    {comment?.comment?.updated &&
                      !comment?.comment?.deleted && (
                        <Text
                          style={[
                            styles.postTime,
                            { fontStyle: "italic", paddingLeft: 0 },
                          ]}
                        >
                          Edited
                        </Text>
                      )}
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
                    {comment?.comment?.creator_id ==
                      signedInUserInfo?.person_view?.person?.id &&
                      !comment?.comment?.deleted && (
                        <TouchableOpacity
                          onPress={() => (
                            setCommentToEdit(comment?.comment?.id),
                            setCommentToEditContent(comment?.comment?.content)
                          )}
                        >
                          <IconEdit
                            size={18}
                            stroke={2.0}
                            color={colors.grey}
                            style={{ opacity: 0.7 }}
                          />
                        </TouchableOpacity>
                      )}
                    <TouchableOpacity
                      disabled={copiedComment}
                      onPress={() => copyCommentLink(comment)}
                    >
                      {copiedComment ? (
                        <Animated.Text
                          style={{
                            transitionDuration: "150ms",
                            fontFamily: chosenFont_Bold,
                            color: colors.blueShade2,
                          }}
                        >
                          Copied!
                        </Animated.Text>
                      ) : (
                        <IconClipboard
                          size={18}
                          stroke={2.0}
                          color={colors.grey}
                          style={{ opacity: 0.7 }}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View
                style={{
                  paddingLeft: level == 0 ? 20 : 12.5,
                }}
              >
                <View
                  style={{
                    borderLeftWidth: 2,
                    borderColor:
                      level == 0 ? colors.greyShade2 : colors.greyShade2,
                    padding: 10,
                    paddingTop: 0,
                    paddingLeft: level == 0 ? 23 : 15,
                  }}
                >
                  <RenderText
                    body={comment?.comment?.content}
                    navigation={navigation}
                    colors={colors}
                    fontSize={fontSize}
                    instance={instance}
                  />
                  <View //bottom bar
                    style={[
                      styles.meta,
                      {
                        paddingHorizontal: 0,
                        paddingLeft: 0,
                        paddingRight: 0,
                        alignItems: "center",
                      },
                    ]}
                  >
                    <View //reply
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      {sameInstance && (
                        <Voting
                          setPostHovering={setPostHovering}
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
                      )}
                      {jwt != null && sameInstance && (
                        <Pressable //reply to comment
                          onHoverIn={() => (
                            setReplyHovering(true), setPostHovering(true)
                          )}
                          onHoverOut={() => setReplyHovering(false)}
                          onPress={() => (
                            setCommentToReply(comment?.comment?.id),
                            setOriginalReplyContent(comment?.comment?.content)
                          )}
                          style={{
                            flexDirection: "row",
                            gap: 3,
                            borderRadius: 100,
                            backgroundColor: replyHovering
                              ? colors.greyShade2
                              : colors.greyMeta,
                            alignItems: "center",
                            padding: 5,
                            paddingHorizontal: 10,
                          }}
                        >
                          <IconMessageCirclePlus
                            size={23}
                            stroke={2.0}
                            color={colors.greyShade4}
                          />
                          <Text
                            style={[
                              styles.voteCount,
                              {
                                fontSize: 12 + fontSize,
                                paddingLeft: 0,
                                color: colors.greyShade4,
                              },
                            ]}
                          >
                            Reply
                          </Text>
                        </Pressable>
                      )}
                      {collapsed && comment?.counts.child_count > 0 ? (
                        <Text style={{ color: colors.grey, fontSize: 13 }}>
                          replies: {comment?.counts.child_count}
                        </Text>
                      ) : (
                        <View />
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <Collapsible collapsed={collapsed}>
              <View>{renderComments(comment?.comments, level + 1)}</View>
            </Collapsible>
          </View>
        </Pressable>
      </View>
    );
  }
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(Comments);

export default withColorScheme(ConnectedComponent);
