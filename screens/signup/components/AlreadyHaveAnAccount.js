import React, { useState, useContext } from "react";
import { Text, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { useNavigation } from "@react-navigation/native";

const AlreadyHaveAnAccount = ({ styles, colors }) => {
  const { chosenFont_ExtraBold, chosenFont_Regular } = useContext(StateContext);
  const navigation = useNavigation();
  const [hovered, setHovered] = useState(false);

  return (
    <Text
      style={{
        textAlign: "center",
        fontFamily: chosenFont_Regular,
        color: colors.greyShade4,
        fontSize: 15,
      }}
    >
      Already have an account?{" "}
      <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <Text
          style={[
            styles.blueText,
            {
              color: hovered ? colors.blueShade1 : colors.blueShade2,
              fontFamily: chosenFont_ExtraBold,
            },
          ]}
          onPress={() => navigation.push("Login")}
        >
          Log In
        </Text>
      </Pressable>
    </Text>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(AlreadyHaveAnAccount);

export default withColorScheme(ConnectedComponent);
