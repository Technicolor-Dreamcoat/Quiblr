import React, { useContext } from "react";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import TransitionPage from "../screens/TransitionPage";
import { StateContext } from "../StateContext";
import { Modal } from "react-native";

const TransitionOverlay = ({ colors, styles, loadingMainPosts, posts }) => {
  const { showTransition } = useContext(StateContext);

  return (
    <Modal //Loading Instance
      visible={showTransition}
      animationType="none"
      presentationStyle={"overFullScreen"}
      // transparent={true}
      style={[styles.overlayWhite, { backgroundColor: colors.white }]}
    >
      <TransitionPage loadingMainPosts={loadingMainPosts} posts={posts} />
      {/* </Animatable.View> */}
    </Modal>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(TransitionOverlay);

export default withColorScheme(ConnectedComponent);
