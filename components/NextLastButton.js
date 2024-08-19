import React, { useState, useContext } from "react";
import { View, Text, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";

const NextLastButton = ({ action, type, styles, colors }) => {
  const { IconChevronLeft, IconChevronRight, width } = useContext(StateContext);

  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={action}
      style={styles.radiusLarge}
    >
      <View
        style={{
          transitionDuration: "150ms",
          backgroundColor: hovered ? colors.greyShade1 : "transparent",
          padding: 5,
          borderWidth: 2,
          borderColor: hovered ? colors.greyShade2 : "transparent",
          paddingHorizontal: 10,
          borderRadius: 100,
          flexDirection: "row",
          gap: 5,
        }}
      >
        {type == "last" && (
          <IconChevronLeft size={16} stroke={2.5} color={colors.greyShade4} />
        )}
        {type == "last" && <Text style={styles.pagination}>LAST PAGE</Text>}

        {type == "next" && <Text style={styles.pagination}>NEXT PAGE</Text>}
        {type == "next" && (
          <IconChevronRight size={16} stroke={2.5} color={colors.greyShade4} />
        )}
      </View>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(NextLastButton);

export default withColorScheme(ConnectedComponent);
