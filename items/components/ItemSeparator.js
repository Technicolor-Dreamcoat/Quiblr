import React, { useContext } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { StateContext } from "../../StateContext";

const ItemSeparator = ({ colors }) => {
  const { width, centerPanelWidthNonDesktop, centerPanelWidthMedium } =
    useContext(StateContext);
  return (
    <View
      style={{
        height: 2,
        width:
          width <= 1000 ? centerPanelWidthNonDesktop : centerPanelWidthMedium,
        backgroundColor: colors.greyShade1,
      }}
    />
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ItemSeparator);

export default withColorScheme(ConnectedComponent);
