import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
const NsfwTag = ({ styles }) => {
  return (
    <View //nsfw
      style={[styles.nsfwContainer, { marginLeft: 0 }]}
    >
      <Text style={styles.nsfwText}>NSFW</Text>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(NsfwTag);

export default withColorScheme(ConnectedComponent);
