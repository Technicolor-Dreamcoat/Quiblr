import React, { useContext, useState } from "react";
import { TouchableOpacity, Pressable } from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const KnowledgeCenterLogo = ({}) => {
  const { isPWA, pwaHeight } = useContext(StateContext);
  const navigation = useNavigation();
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
      style={{
        position: "absolute",
        zIndex: 1,
        top: isPWA ? pwaHeight + 30 : 30,
        left: 30,
      }}
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
    >
      <TouchableOpacity onPress={() => handleGoBack()}>
        <Image
          source={require("../../../assets/Quiblr_Full_Background_Removed_Dark.png")}
          style={[
            {
              opacity: hovered ? 0.7 : 1,
              height: 35,
              width: 120,
            },
          ]}
        />
      </TouchableOpacity>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(KnowledgeCenterLogo);

export default withColorScheme(ConnectedComponent);
