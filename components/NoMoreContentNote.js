import React, { useContext } from "react";
import { Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
const NoMoreContentNote = ({ colors, type }) => {
  const { chosenFont_Bold } = useContext(StateContext);
  return (
    <Text
      style={{
        paddingVertical: 5,
        paddingBottom: 50,
        fontFamily: chosenFont_Bold,
        color: colors.greyShade3,
        textAlign: "center",
        fontSize: 18,
      }}
    >
      - - - No more {type} - - -
    </Text>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(NoMoreContentNote);

export default withColorScheme(ConnectedComponent);
