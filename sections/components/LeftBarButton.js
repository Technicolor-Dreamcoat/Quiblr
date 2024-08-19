import React, { useState, useContext } from "react";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { Image } from "expo-image";
import { Octicons } from "@expo/vector-icons";
import { StateContext } from "../../StateContext";

const LeftBarButton = ({
  styles,
  fontSize,
  functionAction,
  text,
  iconOrImage,
  image,
  icon,
  iconAndTextColor,
  backgroundColor,
  backgroundHoverColor,
  borderColor,
  borderHoverColor,
  selectedFontColor,
}) => {
  const { chosenFont_ExtraBold } = useContext(StateContext);
  const [hovered, setHovered] = useState(false);
  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={functionAction}
      style={{
        transitionDuration: "150ms",
        marginVertical: 2,
        borderRadius: 10,
      }}
    >
      <View
        style={[
          styles.pageButton,
          {
            transitionDuration: "150ms",
            alignItems: "center",
            borderWidth: 2,
            borderColor:
              selectedFontColor == iconAndTextColor
                ? borderColor
                : hovered
                ? borderHoverColor
                : borderColor,
            backgroundColor:
              selectedFontColor == iconAndTextColor
                ? backgroundColor
                : hovered
                ? backgroundHoverColor
                : backgroundColor,
          },
        ]}
      >
        {iconOrImage == "icon" ? (
          <Octicons
            name={icon}
            size={23}
            style={{ transitionDuration: "150ms", paddingHorizontal: 5 }}
            color={iconAndTextColor}
          />
        ) : (
          <Image source={image} style={{ height: 33, width: 33 }} />
        )}
        <Text
          numberOfLines={1}
          style={{
            transitionDuration: "150ms",
            paddingHorizontal: 10,
            fontSize: 15 + fontSize,
            fontFamily: chosenFont_ExtraBold,
            color: iconAndTextColor,
          }}
        >
          {text}
        </Text>
      </View>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(LeftBarButton);

export default withColorScheme(ConnectedComponent);
