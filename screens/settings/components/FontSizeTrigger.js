import React, { useState, useContext } from "react";
import { Text, View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
const FontSizeTrigger = ({ colors, styles, fontSize }) => {
  const { IconChevronRight } = useContext(StateContext);

  const [hovered, setHovered] = useState(false);
  return (
    <View
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transitionDuration: "150ms",
        borderWidth: 2,
        borderColor: colors.greyShade2,
        borderRadius: 10,
        width: 110,
        backgroundColor: hovered ? colors.greyShade1 : colors.white,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 8,
        shadowColor: colors.greyShade2,
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowOffset: {
          height: 4,
          width: 0,
        },
      }}
    >
      <Text style={[styles.menuCommunityText, { fontSize: 14 }]}>
        {fontSize == 0
          ? "Default"
          : fontSize == 2
          ? "Medium"
          : fontSize == 4
          ? "Big"
          : fontSize == 6
          ? "Biggest"
          : "Default"}
      </Text>
      <IconChevronRight size={16} stroke={1.3} color={colors.grey} />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(FontSizeTrigger);

export default withColorScheme(ConnectedComponent);
