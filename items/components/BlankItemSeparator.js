import React from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";

const BlankItemSeparator = ({}) => {
  return <View />;
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(BlankItemSeparator);

export default withColorScheme(ConnectedComponent);
