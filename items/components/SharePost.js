import React, { useContext, useState, useRef } from "react";
import { Pressable, View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { extractWebsiteName } from "../../actions";
import { StateContext } from "../../StateContext";
import { LottieView } from "@bounceapp/lottie";

const SharePost = ({
  colors,
  styles,
  setPostHovering,
  addOpacity,
  instance,
  item,
  shareHovering,
  setShareHovering,
  setShowCopied,
}) => {
  const { copyLink, IconShare } = useContext(StateContext);
  const [showAnimation, setShowAnimation] = useState(false);

  //used in lottie success animation
  const lottieRef = useRef(null);

  return (
    <Pressable //save post
      onHoverIn={() => (setShareHovering(true), setPostHovering(true))}
      onHoverOut={() => setShareHovering(false)}
      style={[
        styles.iconContainer,
        {
          transitionDuration: "150ms",
          opacity: addOpacity ? 0.7 : 1,
          backgroundColor: showAnimation
            ? colors.lightBlue
            : shareHovering
            ? colors.greyShade2
            : colors.greyMeta,
          borderWidth: 2,
          borderColor: shareHovering ? colors.lightGreyShade4 : "transparent",
        },
      ]}
      onPress={() => (
        setShowCopied(true),
        setShowAnimation(true),
        copyLink(
          window.location.href.split("/")[0] +
            "//" +
            window.location.href.split("/")[2] +
            "/instance/" +
            extractWebsiteName(instance) +
            "/post/" +
            item.post.id +
            "/" +
            encodeURIComponent(item.post.name) +
            "/"
        )
      )}
    >
      {showAnimation ? (
        <View style={styles.lottieContainer}>
          <LottieView
            ref={lottieRef}
            style={styles.lottieShareCheck}
            speed={1}
            autoPlay={true}
            loop={false}
            onAnimationFinish={() => (
              setShowAnimation(false), setShowCopied(false)
            )}
            source={require("../../assets/Checkmark.json")}
          />
        </View>
      ) : (
        <IconShare size={23} stroke={2.0} color={colors.greyShade4} />
      )}
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SharePost);

export default withColorScheme(ConnectedComponent);
