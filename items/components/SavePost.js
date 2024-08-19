import React, { useContext } from "react";
import { Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { useNavigation } from "@react-navigation/native";
import { StateContext } from "../../StateContext";

const SavePost = ({
  colors,
  styles,
  setPostHovering,
  addOpacity,
  post,
  toggleSaved,
  bookmarkHovering,
  setBookmarkHovering,
}) => {
  const { IconBookmarkOff, IconBookmarkPlus, jwt, saveThisPost } =
    useContext(StateContext);
  const navigation = useNavigation();

  return (
    <Pressable //save post
      onHoverIn={() => (setBookmarkHovering(true), setPostHovering(true))}
      onHoverOut={() => setBookmarkHovering(false)}
      style={[
        styles.iconContainer,
        {
          transitionDuration: "200ms",
          opacity: addOpacity ? 0.7 : 1,
          backgroundColor: post?.saved
            ? colors.lightBlue
            : bookmarkHovering
            ? colors.greyShade2
            : colors.greyMeta,
          borderWidth: 2,
          borderColor: bookmarkHovering
            ? colors.lightGreyShade4
            : "transparent",
        },
      ]}
      onPress={() =>
        jwt ? saveThisPost(post, toggleSaved) : navigation.push("Login")
      }
    >
      {post?.saved ? (
        <IconBookmarkOff size={23} stroke={2.0} color={colors.blueShade2} />
      ) : (
        <IconBookmarkPlus size={23} stroke={2.0} color={colors.greyShade4} />
      )}
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SavePost);

export default withColorScheme(ConnectedComponent);
