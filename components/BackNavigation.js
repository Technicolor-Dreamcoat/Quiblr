import React, { useState, useContext } from "react";
import { View, Text, Pressable, Platform } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const BackNavigation = ({
  styles,
  colors,
  noBackgroundOnHover,
  includeBackground,
  differentText,
  goHome,
}) => {
  const {} = useContext(StateContext);
  const navigation = useNavigation();
  const { width } = useContext(StateContext);
  const [canGoBack, setCanGoBack] = useState(false);
  const [hovered, setHovered] = useState(false);
  // Listen to navigation events to update the state
  useFocusEffect(
    React.useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation])
  );

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      navigation.push("Quiblr");
    }
  };

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => (goHome ? navigation.push("Quiblr") : handleGoBack())}
      style={[
        styles.preventTouchableRow,
        {
          position: "absolute",
          top: Platform.OS == "ios" || Platform.OS == "android" ? 60 : 30,
          left: width < 650 ? 0 : 30,
          borderRadius: 100,
          zIndex: 10,
          backgroundColor: includeBackground ? "rgba(0,0,0,.8)" : "transparent",
        },
      ]}
    >
      <View
        style={{
          transitionDuration: "150ms",
          backgroundColor: hovered
            ? noBackgroundOnHover
              ? "transparent"
              : colors.greyShade1
            : "transparent",
          padding: 5,
          borderWidth: 2,
          borderColor: hovered ? colors.greyShade2 : "transparent",
          paddingHorizontal: 10,
          borderRadius: 100,
          flexDirection: "row",
          gap: 5,
        }}
      >
        {differentText ? (
          <Text style={[styles.smallSectionTitles, { fontSize: 20 }]}>
            {differentText}
          </Text>
        ) : (
          <Text style={[styles.smallSectionTitles, { fontSize: 20 }]}>
            BACK
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
const ConnectedComponent = connect(mapStateToProps)(BackNavigation);

export default withColorScheme(ConnectedComponent);
