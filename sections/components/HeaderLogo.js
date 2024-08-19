import React, { useContext, useState } from "react";
import { Pressable, Image } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../styles/Formatting";
import { StateContext } from "../../StateContext";
import { useNavigation } from "@react-navigation/native";

const HeaderLogo = ({ styles, darkModeSettings }) => {
  const { showSearch, width } = useContext(StateContext);
  const navigation = useNavigation();
  const [hovered, setHovered] = useState(false);

  return (
    <Pressable
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      onPress={() => navigation.push("Quiblr")}
      style={[
        styles.mainPage_Logo,
        {
          transitionDuration: "150ms",
          opacity: hovered ? 0.7 : 1,
        },
      ]}
    >
      {width <= 1000 ? (
        !showSearch && (
          <Image
            source={
              width < 475
                ? require("../../assets/Quiblr_Small.png")
                : darkModeSettings
                ? require("../../assets/Quiblr_Logo.png")
                : require("../../assets/Quiblr_Logo.png")
            }
            style={[styles.mainPage_Logo, { transitionDuration: "150ms" }]}
          />
        )
      ) : (
        <Image
          source={
            darkModeSettings
              ? require("../../assets/Quiblr_Logo.png")
              : require("../../assets/Quiblr_Logo.png")
          }
          style={[styles.mainPage_Logo, { transitionDuration: "150ms" }]}
        />
      )}
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {
    darkModeSettings: state.updateItem.reduxGlobal.darkModeSettings,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(HeaderLogo);

export default withColorScheme(ConnectedComponent);
