import React, { useContext } from "react";
import { View } from "react-native";
import { Image } from "expo-image";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";

const TransitionPage = ({ darkModeSettings }) => {
  const { height, width } = useContext(StateContext);

  return (
    <View
      style={{
        position: "absolute",
        height,
        width,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../assets/Quiblr_Transition.png")}
        placeholder={require("../assets/Quiblr_Transition.png")}
        style={{ height: 130, width: 130 }}
      />
      {/* </Animatable.View> */}
      {darkModeSettings ? (
        <Image
          source={require("../assets/Quiblr_Full_Background_Removed_Dark.png")}
          placeholder={require("../assets/Quiblr_Full_Background_Removed_Dark.png")}
          style={[
            {
              width: 100,
              height: 30,
              position: "absolute",
              bottom: 50,
              opacity: 0.2,
            },
          ]}
        />
      ) : (
        <Image
          source={require("../assets/Quiblr_Full_Background_Removed_Light.png")}
          placeholder={require("../assets/Quiblr_Full_Background_Removed_Light.png")}
          style={[
            {
              width: 100,
              height: 30,
              position: "absolute",
              bottom: 50,
              opacity: 0.2,
            },
          ]}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    darkModeSettings: state.updateItem.reduxGlobal.darkModeSettings,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(TransitionPage);

export default withColorScheme(ConnectedComponent);
