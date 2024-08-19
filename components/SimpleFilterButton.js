import React, { useState } from "react";
import { Text, TouchableOpacity, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";

const SimpleFilterButton = ({
  colors,
  styles,
  selectedOption,
  viewOptions,
  setViewOptions,
}) => {
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onHoverOut={() => setHovered(false)}
      onHoverIn={() => setHovered(true)}
    >
      <TouchableOpacity
        style={[
          styles.filterButtonSmall,
          {
            borderWidth: 2,
            borderColor:
              viewOptions == selectedOption
                ? colors.blueShade2
                : hovered
                ? colors.greyShade2
                : "transparent",
            backgroundColor:
              viewOptions == selectedOption
                ? colors.lightBlue
                : hovered
                ? colors.greyShade1
                : "transparent",
          },
        ]}
        onPress={() => setViewOptions(selectedOption)}
      >
        <Text
          style={[
            styles.filterButtonTitle,
            {
              color:
                viewOptions == selectedOption
                  ? colors.blueShade2
                  : colors.greyShade3,
            },
          ]}
        >
          {selectedOption}
        </Text>
      </TouchableOpacity>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SimpleFilterButton);

export default withColorScheme(ConnectedComponent);
