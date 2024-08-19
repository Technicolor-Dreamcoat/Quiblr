import React, { useRef, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { updateItem } from "../../../redux/actions";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toggle from "react-native-toggle-element";
import { SmallSpace, Space } from "../../../constants";
import { StateContext } from "../../../StateContext";
import BackNavigation from "../../../components/BackNavigation";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AllOverlays from "../../../overlays/AllOverlays";
import GenericButton from "../../../components/GenericButton";
import FontSizeOption from "../components/FontSizeOption";
import FontSizeTrigger from "../components/FontSizeTrigger";

const SettingsPage = ({
  colors,
  styles,
  blurNSFWSettings,
  darkModeSettings,
  showNSFWSettings,
  showScrollToTopSettings,
  dyslexiaFont,
  reduxFontSize,
  openInSeparateTab,
  removeDuplicatePosts,
  soundOnVideos,
  showScrollBars,
  flipVotingArrows,
}) => {
  const {
    dispatch,
    IconArrowNarrowUp,
    IconArrowsMoveVertical,
    IconBoxMultiple2,
    IconBlur,
    IconExternalLink,
    IconHandStop,
    IconLayoutSidebarRightCollapse,
    IconMoon,
    IconTextSize,
    IconTrash,
    IconTypography,
    IconVolume,
    isPWA,
    jwt,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [fontSize, setFontSize] = useState(reduxFontSize);
  const [canGoBack, setCanGoBack] = useState(false);

  // Listen to navigation events to update the state
  useFocusEffect(
    useCallback(() => {
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

  useEffect(() => {
    dispatch(updateItem("fontSize", fontSize));
  }, [fontSize]);

  //function to show the profile settings page
  const goToProfileSettingsPage = async () => {
    navigation.push("ProfileSettings");
  };

  //pop up menu
  const PopupMenuSettings = ({ trigger, children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const triggerRef = useRef(null);

    const onTriggerPress = () => {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({ x: px, y: py + height });
        setIsVisible(true);
      });
    };

    return (
      <View>
        <TouchableOpacity ref={triggerRef} onPress={onTriggerPress}>
          {trigger}
        </TouchableOpacity>

        {isVisible && (
          <Modal transparent={true} onRequestClose={() => setIsVisible(false)}>
            <TouchableOpacity
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setIsVisible(false)}
            >
              <View
                style={{
                  width: 150,
                  position: "absolute",
                  backgroundColor: colors.menu,
                  padding: 5,
                  borderRadius: 10,
                  shadowColor: "black",
                  shadowOpacity: 0.15,
                  shadowRadius: 30,
                  borderRadius: 10,
                  shadowOffset: {
                    height: 7,
                    width: 0,
                  },
                  // Add other styling as needed
                  top: position.y,
                  left: position.x - 35,
                }}
              >
                {children}
              </View>
            </TouchableOpacity>
          </Modal>
        )}
      </View>
    );
  };

  //############################################
  //                Components                //
  //############################################

  return (
    <ScrollView
      showsVerticalScrollIndicator={showScrollBars}
      style={{ backgroundColor: colors.white }}
    >
      <AllOverlays />

      <BackNavigation />
      <View style={{ width: width < 500 ? "100%" : 450, alignSelf: "center" }}>
        <View
          style={{
            padding: 30,
          }}
        >
          <Space />

          <Text style={styles.loginPageTitle}>Settings</Text>
          <SmallSpace />
          <View
            style={{
              borderWidth: 2,
              borderColor: colors.greyShade2,
              borderRadius: 10,
            }}
          >
            <View //darkModeSettings
              style={[
                styles.centeredRow,
                styles.backgroundColor,
                ,
                {
                  borderRadius: 10,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  //borderBottomWidth: 0,
                  height: 55,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: colors.purple,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconMoon size={23} stroke={1.3} color={colors.white} />
                </View>
              </View>
              <View
                style={[
                  styles.spreadCenteredRow,
                  {
                    flex: 1,
                    borderColor: colors.greyShade2,
                    height: "100%",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={styles.boldText}>Dark Mode</Text>
                <Toggle
                  value={darkModeSettings}
                  containerStyle={{ width: 50 }}
                  trackBar={{ width: 71 }}
                  trackBarStyle={{
                    width: 50,
                    height: 30,
                    backgroundColor: darkModeSettings ? "#6cd45c" : "#d6d6d6",
                    overflow: "hidden",
                  }}
                  thumbStyle={{
                    width: 25,
                    height: 25,
                    marginHorizontal: 2,
                    backgroundColor: "white",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 1,
                      width: 0,
                    },
                  }}
                  onPress={() =>
                    dispatch(updateItem("darkModeSettings", !darkModeSettings))
                  }
                />
              </View>
            </View>
          </View>

          <SmallSpace />

          <View
            style={{
              borderRadius: 10,
              borderColor: colors.greyShade2,
              borderWidth: 2,
            }}
          >
            <View //font size
              style={[
                styles.centeredRow,
                styles.backgroundColor,
                ,
                {
                  borderRadius: 10,
                  borderColor: colors.lightGreyShade4,
                  height: 55,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: colors.green,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconTextSize size={28} stroke={1.3} color={colors.white} />
                </View>
              </View>
              <View
                style={[
                  styles.spreadCenteredRow,
                  {
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.greyShade2,
                    height: "100%",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={styles.boldText}>Font Size</Text>
                <PopupMenuSettings trigger={<FontSizeTrigger />}>
                  <FontSizeOption
                    size={"Default"}
                    action={() => setFontSize(0)}
                  />
                  <FontSizeOption
                    size={"Medium"}
                    action={() => setFontSize(2)}
                  />
                  <FontSizeOption size={"Big"} action={() => setFontSize(4)} />
                  <FontSizeOption
                    size={"Biggest"}
                    action={() => setFontSize(6)}
                  />
                </PopupMenuSettings>
              </View>
            </View>

            <View //dyslexia font
              style={[
                styles.centeredRow,
                styles.backgroundColor,
                ,
                {
                  //borderBottomLeftRadius: 10,
                  //borderBottomRightRadius: 10,
                  borderRadius: 10,

                  // borderTopWidth: 0,
                  borderColor: colors.lightGreyShade4,
                  height: 55,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: colors.green,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconTypography size={23} stroke={1.3} color={colors.white} />
                </View>
              </View>
              <View
                style={[
                  styles.spreadCenteredRow,
                  {
                    flex: 1,
                    //borderTopWidth: 1,
                    borderColor: colors.lightGreyShade4,
                    height: "100%",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={styles.boldText}>Dyslexia Font</Text>
                <Toggle
                  value={dyslexiaFont}
                  containerStyle={{ width: 50 }}
                  trackBar={{ width: 71 }}
                  trackBarStyle={{
                    width: 50,
                    height: 30,
                    backgroundColor: dyslexiaFont ? "#6cd45c" : "#d6d6d6",
                    overflow: "hidden",
                  }}
                  thumbStyle={{
                    width: 25,
                    height: 25,
                    marginHorizontal: 2,
                    backgroundColor: "white",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 1,
                      width: 0,
                    },
                  }}
                  onPress={() =>
                    dispatch(updateItem("dyslexiaFont", !dyslexiaFont))
                  }
                />
              </View>
            </View>
            <View //sound on videos
              style={[
                styles.centeredRow,
                styles.backgroundColor,
                ,
                {
                  //borderBottomLeftRadius: 10,
                  //borderBottomRightRadius: 10,
                  borderRadius: 10,

                  //borderTopWidth: 0,
                  borderColor: colors.lightGreyShade4,
                  height: 55,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: colors.green,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconVolume size={23} stroke={1.3} color={colors.white} />
                </View>
              </View>
              <View
                style={[
                  styles.spreadCenteredRow,
                  {
                    flex: 1,
                    borderTopWidth: 1,
                    borderColor: colors.greyShade2,
                    height: "100%",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={styles.boldText}>Video sound</Text>
                <Toggle
                  value={soundOnVideos}
                  containerStyle={{ width: 50 }}
                  trackBar={{ width: 71 }}
                  trackBarStyle={{
                    width: 50,
                    height: 30,
                    backgroundColor: soundOnVideos ? "#6cd45c" : "#d6d6d6",
                    overflow: "hidden",
                  }}
                  thumbStyle={{
                    width: 25,
                    height: 25,
                    marginHorizontal: 2,
                    backgroundColor: "white",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 1,
                      width: 0,
                    },
                  }}
                  onPress={() =>
                    dispatch(updateItem("soundOnVideos", !soundOnVideos))
                  }
                />
              </View>
            </View>
          </View>

          <SmallSpace />
          {isPWA && (
            <View
              style={{
                borderRadius: 10,
                borderColor: colors.greyShade2,
                borderWidth: 2,
              }}
            >
              <View //scroll to top
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    //borderBottomLeftRadius: 10,
                    //borderBottomRightRadius: 10,
                    borderRadius: 10,

                    // borderTopWidth: 0,
                    borderColor: colors.lightGreyShade4,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconArrowNarrowUp
                      size={26}
                      stroke={1.3}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Scroll to Top</Text>
                  <Toggle
                    value={showScrollToTopSettings}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: showScrollToTopSettings
                        ? "#6cd45c"
                        : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(
                        updateItem(
                          "showScrollToTopSettings",
                          !showScrollToTopSettings
                        )
                      )
                    }
                  />
                </View>
              </View>
              <View //show scroll bars
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderRadius: 10,

                    borderTopWidth: 1,
                    borderColor: colors.greyShade2,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconLayoutSidebarRightCollapse
                      size={26}
                      stroke={1.3}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Scroll bars</Text>
                  <Toggle
                    value={showScrollBars}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: showScrollBars ? "#6cd45c" : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(updateItem("showScrollBars", !showScrollBars))
                    }
                  />
                </View>
              </View>
              <View //flip vote arrows
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderRadius: 10,

                    borderTopWidth: 1,
                    borderColor: colors.greyShade2,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconArrowsMoveVertical
                      size={26}
                      stroke={1.5}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Flip Vote Arrows</Text>
                  <Toggle
                    value={flipVotingArrows}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: flipVotingArrows ? "#6cd45c" : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(
                        updateItem("flipVotingArrows", !flipVotingArrows)
                      )
                    }
                  />
                </View>
              </View>
            </View>
          )}

          {!isPWA && (
            <View
              style={{
                borderRadius: 10,
                borderColor: colors.greyShade2,
                borderWidth: 2,
              }}
            >
              <View //Remove duplicates
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    borderRadius: 10,
                    borderColor: colors.lightGreyShade4,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconBoxMultiple2
                      size={23}
                      stroke={1.3}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      borderBottomWidth: 1,
                      borderColor: colors.greyShade2,
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Remove Duplicates</Text>
                  <Toggle
                    value={removeDuplicatePosts}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: removeDuplicatePosts
                        ? "#6cd45c"
                        : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(
                        updateItem(
                          "removeDuplicatePosts",
                          !removeDuplicatePosts
                        )
                      )
                    }
                  />
                </View>
              </View>
              {!jwt && (
                <View //Open in new tab
                  style={[
                    styles.centeredRow,
                    styles.backgroundColor,
                    ,
                    {
                      borderRadius: 10,
                      borderColor: colors.lightGreyShade4,
                      height: 55,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 60,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 35,
                        height: 35,
                        borderRadius: 5,
                        backgroundColor: colors.blue,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <IconExternalLink
                        size={23}
                        stroke={1.3}
                        color={colors.white}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.spreadCenteredRow,
                      {
                        borderBottomWidth: 1,
                        borderColor: colors.greyShade2,
                        flex: 1,
                        height: "100%",
                        paddingRight: 10,
                      },
                    ]}
                  >
                    <Text style={styles.boldText}>Open Links in New Tab</Text>
                    <Toggle
                      value={openInSeparateTab}
                      containerStyle={{ width: 50 }}
                      trackBar={{ width: 71 }}
                      trackBarStyle={{
                        width: 50,
                        height: 30,
                        backgroundColor: openInSeparateTab
                          ? "#6cd45c"
                          : "#d6d6d6",
                        overflow: "hidden",
                      }}
                      thumbStyle={{
                        width: 25,
                        height: 25,
                        marginHorizontal: 2,
                        backgroundColor: "white",
                        shadowOpacity: 0.1,
                        shadowRadius: 10,
                        shadowOffset: {
                          height: 1,
                          width: 0,
                        },
                      }}
                      onPress={async () =>
                        dispatch(
                          updateItem("openInSeparateTab", !openInSeparateTab)
                        )
                      }
                    />
                  </View>
                </View>
              )}
              <View //scroll to top
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    //borderBottomLeftRadius: 10,
                    //borderBottomRightRadius: 10,
                    borderRadius: 10,

                    borderTopWidth: 0,
                    borderColor: colors.lightGreyShade4,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconArrowNarrowUp
                      stroke={1.5}
                      size={28}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      borderBottomWidth: 1,
                      borderColor: colors.greyShade2,
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Scroll to Top</Text>
                  <Toggle
                    value={showScrollToTopSettings}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: showScrollToTopSettings
                        ? "#6cd45c"
                        : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(
                        updateItem(
                          "showScrollToTopSettings",
                          !showScrollToTopSettings
                        )
                      )
                    }
                  />
                </View>
              </View>
              <View //show scroll bars
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    //borderBottomLeftRadius: 10,
                    //borderBottomRightRadius: 10,
                    borderRadius: 10,

                    // borderTopWidth: 0,
                    borderColor: colors.lightGreyShade4,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconLayoutSidebarRightCollapse
                      size={26}
                      stroke={1.3}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Scroll bars</Text>
                  <Toggle
                    value={showScrollBars}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: showScrollBars ? "#6cd45c" : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(updateItem("showScrollBars", !showScrollBars))
                    }
                  />
                </View>
              </View>
              <View //flip vote arrows
                style={[
                  styles.centeredRow,
                  styles.backgroundColor,
                  ,
                  {
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                    borderRadius: 10,

                    borderTopWidth: 1,
                    borderColor: colors.greyShade2,
                    height: 55,
                  },
                ]}
              >
                <View
                  style={{
                    width: 60,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: 5,
                      backgroundColor: colors.blue,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconArrowsMoveVertical
                      size={26}
                      stroke={1.5}
                      color={colors.white}
                    />
                  </View>
                </View>
                <View
                  style={[
                    styles.spreadCenteredRow,
                    {
                      flex: 1,
                      height: "100%",
                      paddingRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.boldText}>Flip Vote Arrows</Text>
                  <Toggle
                    value={flipVotingArrows}
                    containerStyle={{ width: 50 }}
                    trackBar={{ width: 71 }}
                    trackBarStyle={{
                      width: 50,
                      height: 30,
                      backgroundColor: flipVotingArrows ? "#6cd45c" : "#d6d6d6",
                      overflow: "hidden",
                    }}
                    thumbStyle={{
                      width: 25,
                      height: 25,
                      marginHorizontal: 2,
                      backgroundColor: "white",
                      shadowOpacity: 0.1,
                      shadowRadius: 10,
                      shadowOffset: {
                        height: 1,
                        width: 0,
                      },
                    }}
                    onPress={() =>
                      dispatch(
                        updateItem("flipVotingArrows", !flipVotingArrows)
                      )
                    }
                  />
                </View>
              </View>
            </View>
          )}

          <SmallSpace />
          {!jwt && (
            <View //blur nsfw
              style={[
                styles.centeredRow,
                styles.backgroundColor,
                {
                  height: 55,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  borderColor: colors.greyShade2,
                  borderTopWidth: 2,
                  borderLeftWidth: 2,
                  borderRightWidth: 2,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: colors.red,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconBlur stroke={1.3} size={26} color={colors.white} />
                </View>
              </View>
              <View
                style={[
                  styles.spreadCenteredRow,
                  {
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: colors.greyShade2,
                    height: "100%",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={styles.boldText}>Blur NSFW</Text>
                <Toggle
                  value={blurNSFWSettings}
                  containerStyle={{ width: 50 }}
                  trackBar={{ width: 71 }}
                  trackBarStyle={{
                    width: 50,
                    height: 30,
                    backgroundColor: blurNSFWSettings ? "#6cd45c" : "#d6d6d6",
                    overflow: "hidden",
                  }}
                  thumbStyle={{
                    width: 25,
                    height: 25,
                    marginHorizontal: 2,
                    backgroundColor: "white",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 1,
                      width: 0,
                    },
                  }}
                  onPress={async () =>
                    dispatch(updateItem("blurNSFWSettings", !blurNSFWSettings))
                  }
                />
              </View>
            </View>
          )}
          {!jwt && (
            <View //remove nsfw
              style={[
                styles.centeredRow,
                styles.backgroundColor,
                {
                  height: 55,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  borderColor: colors.greyShade2,
                  borderWidth: 2,
                  borderTopWidth: 0,
                },
              ]}
            >
              <View
                style={{
                  width: 60,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 35,
                    height: 35,
                    borderRadius: 5,
                    backgroundColor: colors.red,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <IconHandStop size={26} stroke={1.3} color={colors.white} />
                </View>
              </View>
              <View
                style={[
                  styles.spreadCenteredRow,
                  {
                    flex: 1,
                    borderBottomWidth: 0,
                    borderColor: colors.lightGreyShade2,
                    height: "100%",
                    paddingRight: 10,
                  },
                ]}
              >
                <Text style={styles.boldText}>Show NSFW</Text>
                <Toggle
                  value={showNSFWSettings}
                  containerStyle={{ width: 50 }}
                  trackBar={{ width: 71 }}
                  trackBarStyle={{
                    width: 50,
                    height: 30,
                    backgroundColor: showNSFWSettings ? "#6cd45c" : "#d6d6d6",
                    overflow: "hidden",
                  }}
                  thumbStyle={{
                    width: 25,
                    height: 25,
                    marginHorizontal: 2,
                    backgroundColor: "white",
                    shadowOpacity: 0.1,
                    shadowRadius: 10,
                    shadowOffset: {
                      height: 1,
                      width: 0,
                    },
                  }}
                  onPress={async () =>
                    dispatch(updateItem("showNSFWSettings", !showNSFWSettings))
                  }
                />
              </View>
            </View>
          )}
          {!jwt && <SmallSpace />}

          <View //clear cache
            style={[
              styles.centeredRow,
              styles.backgroundColor,
              ,
              {
                //borderBottomLeftRadius: 10,
                //borderBottomRightRadius: 10,
                borderRadius: 10,
                borderWidth: 2,
                // borderTopWidth: 0,
                borderColor: colors.greyShade2,
                height: 55,
              },
            ]}
          >
            <View
              style={{
                width: 60,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 5,
                  backgroundColor: colors.grey,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <IconTrash size={28} stroke={1.3} color={colors.white} />
              </View>
            </View>
            <View
              style={[
                styles.spreadCenteredRow,
                {
                  flex: 1,
                  //borderTopWidth: 1,
                  borderColor: colors.lightGreyShade4,
                  height: "100%",
                  paddingRight: 10,
                },
              ]}
            >
              <Text style={styles.boldText}>Clear Cache</Text>
              <TouchableOpacity
                onPress={() => (AsyncStorage.clear(), window.location.reload())}
              >
                <Text style={[styles.loginButtonText, { color: colors.red }]}>
                  Clear
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {jwt && <SmallSpace />}
          {jwt && (
            <View
              style={{
                flexDirection: width > 400 && "row",
                alignSelf: "center",
                gap: width > 400 ? 5 : 10,
              }}
            >
              <GenericButton
                text={"BACK"}
                noText={false}
                disabled={false}
                includeBorder={true}
                textColor={colors.greyShade3}
                cancelButton={true}
                background={colors.white}
                size={width <= 400 ? "large" : width < 500 ? "medium" : "large"}
                shadowColor={colors.greyShade3}
                action={() => handleGoBack()}
                includeIcon={false}
                icon={"pencil"}
                loadingIndicator={false}
                tall={false}
              />
              <GenericButton
                text={"ACCOUNT SETTINGS"}
                noText={false}
                disabled={false}
                includeBorder={false}
                textColor={"white"}
                cancelButton={false}
                background={colors.blueShade2}
                size={width <= 400 ? "large" : width < 500 ? "medium" : "large"}
                shadowColor={colors.blueShade3}
                action={() => goToProfileSettingsPage()}
                includeIcon={false}
                icon={"pencil"}
                loadingIndicator={false}
                tall={false}
              />
            </View>
          )}
          <View style={{ height: 30 }} />
        </View>
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
    flipVotingArrows: state.updateItem.reduxGlobal.flipVotingArrows,
    blurNSFWSettings: state.updateItem.reduxGlobal.blurNSFWSettings,
    darkModeSettings: state.updateItem.reduxGlobal.darkModeSettings,
    showNSFWSettings: state.updateItem.reduxGlobal.showNSFWSettings,
    showScrollToTopSettings:
      state.updateItem.reduxGlobal.showScrollToTopSettings,
    dyslexiaFont: state.updateItem.reduxGlobal.dyslexiaFont,
    reduxFontSize: state.updateItem.reduxGlobal.fontSize,
    openInSeparateTab: state.updateItem.reduxGlobal.openInSeparateTab,
    removeDuplicatePosts: state.updateItem.reduxGlobal.removeDuplicatePosts,
    soundOnVideos: state.updateItem.reduxGlobal.soundOnVideos,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SettingsPage);

export default withColorScheme(ConnectedComponent);
