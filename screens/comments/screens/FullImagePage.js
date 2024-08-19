import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import BackNavigation from "../../../components/BackNavigation";
import Animated from "react-native-reanimated";

const FullImagePage = ({ styles, colors, route }) => {
  const [loadingFullImage, setLoadingFullImage] = useState(false);

  useEffect(() => {
    setLoadingFullImage(true);
    setTimeout(() => {
      setLoadingFullImage(false);
    }, 1000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "black",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {!loadingFullImage && (
        <BackNavigation noBackgroundOnHover={true} includeBackground={true} />
      )}
      {loadingFullImage ? (
        <ActivityIndicator color={colors.blueShade2} size={"large"} />
      ) : (
        <Animated.Image
          style={[styles.fullImage]}
          source={{ uri: decodeURIComponent(route?.params?.imageUrl) }}
          sharedTransitionTag="fullImage"
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(FullImagePage);

export default withColorScheme(ConnectedComponent);
