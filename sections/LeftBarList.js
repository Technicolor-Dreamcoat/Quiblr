import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { StateContext } from "../StateContext";
import LeftBarButton from "./components/LeftBarButton";
import { SmallSpace } from "../constants";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";
import { extractWebsiteName } from "../actions";

const LeftBarList = ({ colors, instance, styles, active, mobileSidebar }) => {
  const {
    confirmedNsfw,
    headerHeight,
    height,
    isPWA,
    jwt,
    leftBarWidth,
    luckyResults,
    pwaHeight,
    setShowSideDrawer,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  //############################################
  //           Set Dimensions & Style         //
  //############################################

  //colors
  const selectedFontColor = colors.blueShade2;
  const nonSelectedFontColor = colors.greyShade4;
  const selectedBackgroundColor = colors.lightBlue;
  const backgroundHoverColor = colors.greyShade1;
  const borderHoverColor = colors.greyShade2;
  // const borderHoverColor = "transparent";
  const selectedBorderColor = colors.blueShade2;
  const iconOrImage = "image";
  const capitalized = false;

  //############################################
  //               NAVIGATION                 //
  //############################################

  //function if NSFW Post (navigation)
  const navigateNSFWPost = (item) => {
    const encodedPostInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("NsfwWarningPost", {
      post_id: item.post.id,
      post_instance: encodedPostInstance,
      post_name: encodedPostName,
    });
  };

  //function for comments (navigation)
  const navigateComments = (item) => {
    const encodedInstance = encodeURIComponent(extractWebsiteName(instance));
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("Comments", {
      post_id: item.post.id,
      post_instance: encodedInstance,
      post_name: encodedPostName,
    });
  };

  //############################################
  //                 Functions                //
  //############################################

  //press feeling lucky
  const pressFeelingLucky = () => {
    const post = luckyResults[Math.floor(Math.random() * luckyResults?.length)];
    setShowSideDrawer(false),
      post?.post?.nsfw && !confirmedNsfw
        ? navigateNSFWPost(post)
        : navigateComments(post);
  };
  return (
    <View>
      {(width > 1000 || mobileSidebar) && (
        <View
          style={{
            transitionDuration: "150ms",
            width: mobileSidebar ? "100%" : width * leftBarWidth,
            alignItems: "flex-end",
            padding: 30,
            paddingBottom: 0,
            paddingRight: width * 0.01,
            borderRightWidth: mobileSidebar ? 0 : 3,
            backgroundColor: colors.white,
            borderRightColor: colors.greyShade1,
            height: isPWA
              ? height - (headerHeight + pwaHeight)
              : height - headerHeight,
          }}
        >
          <ScrollView
            scrollEnabled={mobileSidebar}
            showsVerticalScrollIndicator={false}
            style={{ width: "100%", transitionDuration: "150ms" }}
          >
            <View>
              <Text style={[styles.smallSectionTitles, { paddingBottom: 3 }]}>
                PAGES
              </Text>

              <LeftBarButton //HOME
                backgroundHoverColor={backgroundHoverColor}
                borderHoverColor={borderHoverColor}
                selectedFontColor={selectedFontColor}
                iconAndTextColor={
                  active == "Home" ? selectedFontColor : nonSelectedFontColor
                }
                backgroundColor={
                  active == "Home" ? selectedBackgroundColor : colors.white
                }
                borderColor={
                  active == "Home" ? selectedBorderColor : colors.white
                }
                text={capitalized ? "HOME" : "Home"}
                iconOrImage={iconOrImage}
                image={require("../assets/Home_Image.png")}
                icon={"versions"}
                functionAction={() => (
                  setShowSideDrawer(false), navigation.push("Quiblr")
                )}
              />

              <LeftBarButton //COMMUNITIES
                backgroundHoverColor={backgroundHoverColor}
                borderHoverColor={borderHoverColor}
                selectedFontColor={selectedFontColor}
                iconAndTextColor={
                  active == "Communities"
                    ? selectedFontColor
                    : nonSelectedFontColor
                }
                backgroundColor={
                  active == "Communities"
                    ? selectedBackgroundColor
                    : colors.white
                }
                borderColor={
                  active == "Communities" ? selectedBorderColor : colors.white
                }
                text={capitalized ? "COMMUNITIES" : "Communities"}
                iconOrImage={iconOrImage}
                image={require("../assets/Communities_Image.png")}
                icon={"people"}
                functionAction={() => (
                  setShowSideDrawer(false), navigation.push("Communities")
                )}
              />
              {jwt && (
                <LeftBarButton //BOOKMARKS
                  backgroundHoverColor={backgroundHoverColor}
                  borderHoverColor={borderHoverColor}
                  selectedFontColor={selectedFontColor}
                  iconAndTextColor={
                    active == "Saved" ? selectedFontColor : nonSelectedFontColor
                  }
                  backgroundColor={
                    active == "Saved" ? selectedBackgroundColor : colors.white
                  }
                  borderColor={
                    active == "Saved" ? selectedBorderColor : colors.white
                  }
                  text={capitalized ? "SAVED" : "Saved"}
                  iconOrImage={iconOrImage}
                  image={require("../assets/Saved_Image.png")}
                  icon={"bookmark"}
                  functionAction={() => (
                    setShowSideDrawer(false), navigation.push("Saved")
                  )}
                />
              )}
              {jwt == null && (
                <LeftBarButton //INSTANCES
                  backgroundHoverColor={backgroundHoverColor}
                  borderHoverColor={borderHoverColor}
                  selectedFontColor={selectedFontColor}
                  iconAndTextColor={
                    active == "Instances"
                      ? selectedFontColor
                      : nonSelectedFontColor
                  }
                  backgroundColor={
                    active == "Instances"
                      ? selectedBackgroundColor
                      : colors.white
                  }
                  borderColor={
                    active == "Instances" ? selectedBorderColor : colors.white
                  }
                  text={capitalized ? "INSTANCE" : "Instances"}
                  iconOrImage={iconOrImage}
                  image={require("../assets/Instance_Image.png")}
                  icon={"server"}
                  functionAction={() => (
                    setShowSideDrawer(false), navigation.push("Instance")
                  )}
                />
              )}

              <LeftBarButton //SETTINGS
                backgroundHoverColor={backgroundHoverColor}
                borderHoverColor={borderHoverColor}
                selectedFontColor={selectedFontColor}
                iconAndTextColor={
                  active == "Settings"
                    ? selectedFontColor
                    : nonSelectedFontColor
                }
                backgroundColor={
                  active == "Settings" ? selectedBackgroundColor : colors.white
                }
                borderColor={
                  active == "Settings" ? selectedBorderColor : colors.white
                }
                text={capitalized ? "SETTINGS" : "Settings"}
                iconOrImage={iconOrImage}
                image={require("../assets/Settings_Image.png")}
                icon={"gear"}
                functionAction={() => (
                  setShowSideDrawer(false), navigation.push("Settings")
                )}
              />
              <SmallSpace />

              {luckyResults?.length > 0 && (
                <Animatable.Text
                  animation={"fadeIn"}
                  style={[styles.smallSectionTitles, { paddingBottom: 3 }]}
                >
                  FUN ZONE
                </Animatable.Text>
              )}
              {luckyResults?.length > 0 && (
                <Animatable.View animation={"fadeIn"}>
                  <LeftBarButton //FEELING LUCKY
                    backgroundHoverColor={backgroundHoverColor}
                    borderHoverColor={borderHoverColor}
                    selectedFontColor={selectedFontColor}
                    iconAndTextColor={nonSelectedFontColor}
                    backgroundColor={colors.white}
                    borderColor={colors.white}
                    text={"Feeling Lucky"}
                    iconOrImage={iconOrImage}
                    image={require("../assets/Feeling_Lucky_Image.png")}
                    icon={"rocket"}
                    functionAction={pressFeelingLucky}
                  />
                </Animatable.View>
              )}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
  };
};

// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(LeftBarList);

export default withColorScheme(ConnectedComponent);
