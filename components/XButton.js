import React, { useState, useContext } from "react";
import { Text, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
const XButton = ({ styles, colors, functionAction }) => {
  const { isPWA, pwaHeight } = useContext(StateContext);
  const [buttonHovered, setButtonHovered] = useState(false);
  return (
    <Pressable
      onHoverIn={() => setButtonHovered(true)}
      onHoverOut={() => setButtonHovered(false)}
      onPress={functionAction}
      style={[
        styles.xButtonContainer,
        {
          position: "absolute",
          zIndex: 2,
          top: isPWA ? 30 + pwaHeight : 20,
          left: 20,
          backgroundColor: buttonHovered && colors.greyShade1,
          borderWidth: 2,
          borderColor: buttonHovered ? colors.greyShade2 : "transparent",
        },
      ]}
    >
      <Text style={styles.xButtonText}>X</Text>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(XButton);

export default withColorScheme(ConnectedComponent);
