import React, { useContext, useState } from "react";
import { Pressable, View, Text, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
import { makeColorLighter } from "../actions";
import { Octicons } from "@expo/vector-icons";

const GenericButton = ({
  colors,
  text,
  cancelButton,
  background,
  size,
  shadowColor,
  action,
  includeIcon,
  includeBorder,
  textColor,
  icon,
  disabled,
  loadingIndicator,
  noText,
  tall,
}) => {
  const { chosenFont_ExtraBold, width } = useContext(StateContext);
  const [hovering, setHovering] = useState(false);
  return (
    <Pressable
      onHoverOut={() => setHovering(false)}
      onHoverIn={() => setHovering(true)}
      disabled={disabled}
      onPress={action}
      style={{
        borderRadius: tall ? 15 : 10,
        height: tall ? 50 : 40,
        minWidth:
          size == "small"
            ? width <= 400
              ? 50
              : 75
            : size == "medium"
            ? 150
            : size == "large"
            ? 200
            : "100%",
        shadowColor: shadowColor,
        shadowOpacity: 1,
        shadowRadius: 0,
        shadowOffset: {
          height: includeBorder ? (hovering ? 3 : 4) : hovering ? 4 : 5,
          width: 0,
        },
      }}
    >
      <View
        style={{
          transitionDuration: "150ms",
          flex: 1,
          borderRadius: tall ? 15 : 10,
          backgroundColor: cancelButton
            ? "transparent"
            : hovering
            ? background == (colors.white || "white")
              ? colors.greyShade1
              : makeColorLighter(background)
            : background,
          borderWidth: 2,
          borderColor: includeBorder ? shadowColor : "transparent",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          paddingHorizontal: 15,
          gap: 5,
        }}
      >
        {loadingIndicator && (
          <ActivityIndicator color={textColor} size={"small"} />
        )}
        {!loadingIndicator && includeIcon && (
          <Octicons
            name={icon}
            size={20}
            color={cancelButton ? colors.greyShade3 : textColor}
          />
        )}
        {!noText && !loadingIndicator && (
          <Text
            style={{
              color: cancelButton ? colors.greyShade3 : textColor,
              fontFamily: chosenFont_ExtraBold,
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(GenericButton);

export default withColorScheme(ConnectedComponent);
