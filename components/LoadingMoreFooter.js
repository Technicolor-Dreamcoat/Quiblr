import React from "react";
import { View, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { SmallSpace, Space } from "../constants";

const LoadingMoreFooter = ({ colors }) => {
  return (
    <View>
      <SmallSpace />
      <ActivityIndicator color={colors.blueShade2} size={"large"} />
      <Space />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(LoadingMoreFooter);

export default withColorScheme(ConnectedComponent);
