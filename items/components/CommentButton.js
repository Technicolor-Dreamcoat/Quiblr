import React, { useContext } from "react";
import { Text, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { StateContext } from "../../StateContext";
const CommentButton = ({
  styles,
  colors,
  setPostHovering,
  functionAction,
  commentCount,
  commentHovering,
  setCommentHovering,
}) => {
  const { IconMessageCircle, width } = useContext(StateContext);

  return (
    <Pressable //comment
      onPress={functionAction}
      onHoverIn={() => (setCommentHovering(true), setPostHovering(true))}
      onHoverOut={() => setCommentHovering(false)}
      style={[
        styles.iconContainer,
        {
          transitionDuration: "150ms",
          paddingHorizontal: width < 310 ? 3 : 10,
          backgroundColor: commentHovering
            ? colors.greyShade2
            : colors.greyMeta,
          borderWidth: 2,
          borderColor: commentHovering ? colors.lightGreyShade4 : "transparent",
        },
      ]}
    >
      <IconMessageCircle size={23} name={2.0} color={colors.greyShade4} />
      <Text style={styles.commentCount}>{commentCount}</Text>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(CommentButton);

export default withColorScheme(ConnectedComponent);
