import React, { useState } from "react";
import { Text, TouchableOpacity, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";

const FontSizeOption = ({ colors, styles, size, action }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onHoverOut={() => setHovered(false)}
      onHoverIn={() => setHovered(true)}
    >
      <TouchableOpacity //medium size font
        style={[
          styles.menuOption,
          {
            borderRadius: 10,
            borderWidth: 2,
            borderColor: hovered ? colors.greyShade2 : colors.menu,
            backgroundColor: hovered ? colors.greyShade1 : colors.menu,
          },
        ]}
        onPress={action}
      >
        <Text style={styles.menuText}>{size}</Text>
      </TouchableOpacity>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(FontSizeOption);

export default withColorScheme(ConnectedComponent);
