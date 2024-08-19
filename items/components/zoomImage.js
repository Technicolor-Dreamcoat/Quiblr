import React, { useContext, useState } from "react";
import { Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { useNavigation } from "@react-navigation/native";
import { StateContext } from "../../StateContext";

const ZoomImage = ({ colors, image, setPostHovering }) => {
  const { IconArrowsMaximize } = useContext(StateContext);
  const navigation = useNavigation();
  const [hovering, setHovering] = useState(false);

  //function to go to full image (navigation)
  const pressedFullImage = (image) => {
    navigation.push("FullImage", { imageUrl: image });
  };
  return (
    <Pressable
      onHoverIn={() => (setHovering(true), setPostHovering(true))}
      onHoverOut={() => setHovering(false)}
      style={{
        transitionDuration: "150ms",
        opacity: hovering ? 1 : 0.2,
        position: "absolute",
        top: 15,
        right: 15,
        zIndex: 10,
        backgroundColor: colors.greyShade5,
        borderRadius: 5,
      }}
      onPress={() => pressedFullImage(image)}
    >
      <IconArrowsMaximize color={"white"} size={30} />
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ZoomImage);

export default withColorScheme(ConnectedComponent);
