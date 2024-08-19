import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, Platform } from "react-native";
import { connect } from "react-redux";
import { useFont } from "../FontContext"; // Import the useFont hook

const lightColorsDefault = {
  greyMeta: "#E8EBED",
  white: "#ffffff",
  black: "#000000",
  red: "#f73a2e",
  blue: "#1cb0f6",
  blueShade0: "#82d7ff",
  blueShade1: "#1fc1ff",
  blueShade2: "#1cb0f6",
  blueShade3: "#1899D6",
  green: "#009933",
  orange: "#ff9f1a",
  grey: "#576f76",
  purple: "#5d5bd7",
  pink: "#e6005c",
  greyShade1: "#F7F7F7",
  greyShade2: "#e5e5e5",
  greyShade3: "#AFAFAF",
  greyShade4: "#777777",
  greyShade5: "#4B4B4B",
  lightGreyShade2: "#f1f3f4",
  lightGreyShade4: "#caccce",
  lightGreyNestedComment: "#fafafa",

  sliderBackground: "#f1f3f4",

  darkGreyShade1: "#353338",
  darkGreyShade2: "#464349",
  darkRed: "#cc0000",
  darkBlue: "#0888c4",
  darkOrange: "#e68600",

  lightBlue: "#DDF4FF",
  lightGrey: "lightgrey",
  lightRed: "#ffe6e6",
  lightPink: "#cd82ff",
  lightGreenShade1: "#ebfaeb",
  lightGreenShade2: "#e6ffee",

  default: "#f1f3f4",
  vampire: "#ffe6e6",
  royal: "#f8edff",
  elf: "#ebfaeb",

  menu: "#ffffff",
  communityGradientTop: "rgba(255,255,255,0.9)",
};
const darkColorsDefault = {
  greyMeta: "#363c4a",
  white: "#131a23",
  black: "#ffffff",
  red: "#f73a2e",
  blue: "#1cb0f6",
  blueShade0: "#82d7ff",
  blueShade1: "#1fc1ff",
  blueShade2: "#1cb0f6",
  blueShade3: "#1899D6",
  green: "#009933",
  orange: "#ff9f1a",
  grey: "#a0a0a0",
  purple: "#5d5bd7",
  pink: "#e6005c",
  greyShade1: "#252a33",
  greyShade2: "#39404d",
  greyShade3: "#525c6e",
  greyShade4: "#6d798f",
  greyShade5: "#b6c1d6",
  lightGreyShade2: "#2c3039",
  lightGreyShade4: "#4b5468",
  lightGreyNestedComment: "#1a1e26",

  sliderBackground: "#494d50",

  darkGreyShade1: "#7b8bad",
  darkGreyShade2: "#e1e2e3",
  darkRed: "#cc0000",
  darkBlue: "#0073e6",
  darkOrange: "#e68600",

  lightBlue: "#212533",
  lightGrey: "lightgrey",
  lightRed: "#1a0000",
  lightPink: "#1a1021",
  lightGreenShade1: "#ebfaeb",
  lightGreenShade2: "#e6ffee",

  default: "#2c3039",
  vampire: "#4f0405",
  royal: "#3e1354",
  elf: "#1b2e1e",

  menu: "#18181a",
  communityGradientTop: "rgba(33,37,46,0.9)",
};

const withColorScheme = (Component) => {
  const ColorSchemeComponent = ({ darkModeSettings, fontSize, ...props }) => {
    //############################################
    //              Set Dimensions              //
    //############################################

    const [width, setWidth] = useState(Dimensions.get("window").width);
    const [height, setHeight] = useState(Dimensions.get("window").height);

    useEffect(() => {
      const onChange = ({ window }) => {
        setWidth(window.width);
        setHeight(window.height);
      };

      const subscription = Dimensions.addEventListener("change", onChange);

      // Clean up the event listener
      return () => {
        if (subscription && subscription.remove) {
          subscription.remove();
        }
      };
    }, []);

    //############################################
    //                 Set Colors               //
    //############################################
    const colors = darkModeSettings ? darkColorsDefault : lightColorsDefault;

    //############################################
    //                 Set Styles               //
    //############################################
    //Fonts
    const {
      chosenFont_SuperBold,
      chosenFont_ExtraBold,
      chosenFont_Bold,
      chosenFont_Regular,
      chosenFont_Thin,
    } = useFont();

    //Styles
    const styles = {
      mainPage_Container: {
        backgroundColor: colors.white,
      },
      mainPage_RightButtonContainer: {
        flexDirection: "row",
        right: 10,
        position: "absolute",
        alignItems: "center",
        height: "100%",
        gap: 10,
      },
      mainPage_Header: {
        overflow: "hidden",
        paddingHorizontal: width < 475 ? 10 : 30,
        borderBottomWidth: width <= 1000 ? 3 : 0,
        borderBottomColor: colors.greyShade1,
        backgroundColor: colors.white,
        alignItems: "center",
        flexDirection: "row",
        shadowColor: "black",
      },
      mainPage_Logo: {
        // width: "100%",
        width: width < 475 ? 50 : 120,
        height: "90%",
        resizeMode: "contain",
        aspectRatio: 1,
        marginTop: 0,
        justifyContent: "center",
      },
      mainPage_SideDrawerButton: {
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      },
      mainPage_TextInputContainer: {
        width: 400,
        paddingLeft: 10,
        backgroundColor: colors.greyShade1,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        borderColor: colors.greyShade2,
        fontSize: 13 + fontSize,
        fontFamily: chosenFont_Bold,
        color: colors.grey,
        outline: "none",
      },
      backgroundColor: { backgroundColor: colors.white },
      blueText: { color: colors.blue, fontFamily: chosenFont_Bold },
      boldText: {
        fontFamily: chosenFont_Bold,
        color: colors.black,
        fontSize: 14 + fontSize,
      },
      botContainer: {
        width: 60,
        height: 25,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lightGreenShade2,
        marginTop: 15,
        marginLeft: 20,
        zIndex: 3,
        position: "absolute",
        right: 20,
        borderWidth: 1,
        borderColor: colors.green,
      },
      botText: {
        fontSize: 13 + fontSize,
        color: colors.green,
        fontFamily: chosenFont_Regular,
      },
      buttonText: {
        color: colors.white,
        fontFamily: chosenFont_Bold,
        fontSize: 14 + fontSize,
      },
      cardMeta: {
        fontSize: 13 + fontSize,
        color: colors.black,
        fontFamily: chosenFont_Bold,
      },
      filterButtonSmall: {
        flexDirection: "row",
        borderRadius: 100,
        paddingHorizontal: 10,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
      },
      filterButtonTitle: {
        fontSize: 16,
        fontFamily: chosenFont_ExtraBold,
        color: colors.black,
      },
      centeredRow: {
        flexDirection: "row",
        alignItems: "center",
      },
      commentAvatar: {
        width: 25,
        height: 25,
        borderRadius: 100,
        marginRight: 5,
      },
      commentAvatarPlaceholderContainer: {
        width: 25,
        height: 25,
        borderRadius: 100,
        marginRight: 5,
        backgroundColor: colors.greyMeta,
        justifyContent: "center",
        alignItems: "center",
      },
      commentBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5,
        paddingLeft: 0,
        paddingBottom: 10,
      },
      commentContainer: {
        paddingRight: 0,
      },
      commentCount: {
        fontSize: 11 + fontSize,
        color: colors.greyShade4,
        fontFamily: chosenFont_SuperBold,
      },
      commentCreator: {
        fontFamily: chosenFont_Bold,
        fontSize: 14 + fontSize,
      },
      commentOriginalPost: {
        flexDirection: "row",
        alignItems: "center",
        padding: 5,
        borderRadius: 10,
      },
      commentOriginalPostImage: {
        marginRight: 10,
        width: 40,
        height: 40,
        borderRadius: 10,
      },
      commentOriginalPostText: {
        flex: 1,
        fontFamily: chosenFont_Regular,
        color: colors.grey,
        fontStyle: "italic",
        fontSize: 14 + fontSize,
      },
      commentSortMenu: {
        borderRadius: 100,
        overflow: "hidden",
        zIndex: 100,
      },
      commentSortSelection: {
        fontSize: 14 + fontSize,
        fontFamily: chosenFont_ExtraBold,
        color: colors.greyShade4,
      },
      commentSortText: {
        fontSize: 14 + fontSize,
        fontFamily: chosenFont_Bold,
        color: colors.greyShade4,
      },
      commonText: {
        color: colors.greyShade4,
        fontFamily: chosenFont_Regular,
        fontSize: 15 + fontSize,
      },
      communityIcon: {
        width: 35,
        height: 35,
        borderRadius: 100,
        marginRight: 5,
      },
      communitiesPageList: {
        fontFamily: chosenFont_ExtraBold,
        color: colors.black,
        fontSize: 15 + fontSize,
      },
      currentInstance: {
        fontStyle: "italic",
        color: colors.black,
        fontFamily: chosenFont_Regular,
        fontSize: 14 + fontSize,
        alignSelf: "center",
      },
      diffInstanceErrorContainer: {
        borderRadius: 10,
        minHeight: 50,
        alignItems: "center",
        padding: 10,
        backgroundColor: colors.greyShade1,
        flexDirection: "row",
        gap: 5,
        borderWidth: 2,
        borderColor: colors.greyShade2,
      },
      diffInstanceErrorText: {
        fontFamily: chosenFont_Bold,
        color: colors.greyShade4,
      },
      evenlySpacedRow: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
      },
      extraSmallPadding: { padding: 3 },
      filterHeader: {
        fontSize: 20 + fontSize,
        fontFamily: chosenFont_ExtraBold,
        color: colors.black,
      },
      filterSubHeader: {
        fontSize: 15 + fontSize,
        fontFamily: chosenFont_Bold,
        color: colors.greyShade3,
      },
      fontButton: {
        transitionDuration: "150ms",
        width: 30,
        justifyContent: "center",
        borderRadius: 5,
        alignItems: "center",
      },
      fullImage: {
        height: "100%",
        width: "100%",
        resizeMode: "contain",
      },
      fullWidth: {
        width: "100%",
      },
      infoPageTitle: {
        fontSize: width < 600 ? 27 + fontSize : 35 + fontSize,
        fontFamily: chosenFont_SuperBold,
        color: "white",
        textAlign: "center",
      },
      infoPageSubTitleOne: {
        fontSize: width < 600 ? 13 + fontSize : 15 + fontSize,
        fontFamily: chosenFont_ExtraBold,
        color: "white",
        textAlign: "center",
        paddingVertical: 15,
        opacity: 0.6,
      },
      infoPageSubTitleTwo: {
        fontSize: width < 600 ? 17 + fontSize : 19 + fontSize,
        fontFamily: chosenFont_Regular,
        color: "white",
        textAlign: "center",
        paddingVertical: 15,
      },
      iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        backgroundColor: colors.greyMeta,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 100,
      },
      instanceBoxStyles: {
        backgroundColor: colors.lightGreyNestedComment,
        color: colors.black,
        fontFamily: chosenFont_Regular,
        fontSize: 14 + fontSize,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.greyShade2,
      },
      instanceDropdownItemStyles: {
        backgroundColor: colors.lightGreyNestedComment,
        color: colors.black,
        fontFamily: chosenFont_Regular,
        fontSize: 14 + fontSize,
      },
      instanceDropdownStyles: {
        backgroundColor: colors.lightGreyNestedComment,
        color: colors.black,
        fontFamily: chosenFont_Regular,
        fontSize: 13 + fontSize,
        borderColor: colors.greyShade3,
      },
      instanceDropdownTextStyles: {
        color: colors.black,
        fontFamily: chosenFont_Regular,
        fontSize: 13 + fontSize,
      },
      instanceInputStyles: {
        backgroundColor: colors.lightGreyNestedComment,
        color: colors.greyShade4,
        justifyContent: "center",
        fontFamily: chosenFont_Bold,
        fontSize: 13 + fontSize,
      },
      itemContainer: {
        paddingVertical: 10,
        paddingTop: 0,
        borderRadius: 20,
        borderColor: colors.greyShade1,
        backgroundColor: colors.white,
      },
      itemSource: {
        fontSize: 14 + fontSize,
        color: colors.greyShade4,
        fontFamily: chosenFont_Bold,
        marginBottom: 15,
      },
      itemText: {
        fontSize: 17 + fontSize,
        color: colors.greyShade4,
        fontFamily: chosenFont_Regular,
        marginVertical: 15,
        paddingHorizontal: 20,
      },
      largeImageThumbnail: {
        backgroundColor: "black",
        width: "100%",
        aspectRatio: 1.3,
        marginVertical: 5,
        marginBottom: 10,
      },
      largeVideo: {
        backgroundColor: "black",
        width: "100%",
        aspectRatio: 1.3,
        marginVertical: 5,
        marginBottom: 10,
      },
      loginButtonText: {
        color: "white",
        fontFamily: chosenFont_ExtraBold,
        fontSize: 15 + fontSize,
      },
      loginContainer: {
        justifyContent: "center",
        backgroundColor: colors.white,
      },
      loginPageTitle: {
        fontSize: 30 + fontSize,
        fontFamily: chosenFont_ExtraBold,
        color: colors.greyShade5,
        textAlign: "center",
      },
      lottieContainer: {
        justifyContent: "center",
        alignItems: "center",
        maxHeight: 20,
        maxWidth: 23,
      },
      lottieShareCheck: {
        width: 45,
        height: 45,
      },
      mainInfos: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 10,
        width: "100%",
      },
      marginTopSmall: { marginTop: 5 },
      mediumPadding: { padding: 15 },
      menuCommunityText: {
        width: "70%",
        fontSize: 14 + fontSize,
        fontFamily: chosenFont_Thin,
        color: colors.black,
      },
      menuOption: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
        paddingVertical: 8,
        alignItems: "center",
      },
      menuOptions: {
        optionTouchable: { activeOpacity: 1 },
        optionsContainer: {
          marginTop: 25,
          shadowColor: "black",
          borderWidth: 0,
          zIndex: 3,
          position: "absolute",
          justifyContent: "center",
          borderColor: colors.grey,
          backgroundColor: colors.menu,
          shadowOpacity: 0.15, //.15
          shadowRadius: 30,
          borderRadius: 10,
          shadowOffset: {
            height: 7,
            width: 0,
          },
        },
        optionText: {
          paddingLeft: 10,
          paddingVertical: 0,
        },
      },
      menuOptionsNarrow: {
        optionTouchable: { activeOpacity: 1 },
        optionsContainer: {
          width: 100,
          marginTop: 25,
          shadowColor: "black",
          borderWidth: 0,
          zIndex: 3,
          position: "absolute",
          justifyContent: "center",
          borderColor: colors.grey,
          backgroundColor: colors.menu,
          shadowOpacity: 0.1,
          shadowRadius: 30,
          borderRadius: 10,
          shadowOffset: {
            height: 7,
            width: 7,
          },
        },
        optionText: {
          paddingLeft: 10,
          paddingVertical: 5,
        },
      },
      menuText: {
        fontSize: 14 + fontSize,
        fontFamily: chosenFont_Bold,
        color: colors.greyShade4,
      },
      meta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
        paddingHorizontal: 0,
      },
      metaDataSpacer: {
        fontSize: 15 + fontSize,
        fontFamily: chosenFont_Regular,
        color: colors.grey,
        paddingHorizontal: 5,
      },
      nsfwContainer: {
        width: 60,
        height: 25,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.lightRed,
        borderWidth: 1,
        borderColor: colors.red,
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 5,
      },
      nsfwText: {
        fontSize: 13,
        color: colors.red,
        fontFamily: chosenFont_ExtraBold,
      },
      overlayWhite: {
        width,
        height,
        alignItems: "center",
        backgroundColor: colors.white,
      },
      overlayMedium: {
        padding: 5,
        overflow: "hidden",
        backgroundColor: colors.white,
      },
      overlaySideDrawer: {
        padding: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "tranparent",
        right: 0,
        shadowRadius: 0,
      },
      paddingMedium: { padding: 15 },
      paddingTopSmall: { paddingTop: 5 },
      paddingTopMidMedium: { paddingTop: 10 },
      pageButton: {
        borderRadius: 10,
        width: "100%",
        height: 50,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
      },
      preventTouchableRow: {
        alignSelf: "flex-start",
        alignItems: "flex-start",
      },
      noMoreComments: {
        fontSize: 16 + fontSize,
        fontFamily: chosenFont_ExtraBold,
        color: colors.greyShade3,
      },
      pagination: {
        color: colors.greyShade4,
        fontFamily: chosenFont_ExtraBold,
        fontSize: 15 + fontSize,
      },
      placeholderInputText: {
        color: colors.greyShade3,
        fontFamily: chosenFont_Bold,
      },
      popupContainer: {
        flex: 1,
        alignItems: "flex-end",
      },
      postInfo: {
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 15,
        width: "100%",
      },
      postTime: {
        fontSize: 12 + fontSize,
        fontFamily: chosenFont_Bold,
        color: colors.greyShade4,
      },
      radiusSmall: { borderRadius: 10 },
      radiusLarge: { borderRadius: 100 },
      radiusMedium: { borderRadius: 15 },
      rootCommentContainer: {
        marginBottom: 10,
      },
      row: { flexDirection: "row" },
      sectionDescription: {
        fontSize: 14 + fontSize,
        fontFamily: chosenFont_Regular,
        paddingVertical: 5,
        paddingTop: 15,
        color: colors.greyShade4,
      },
      sectionHeader: {
        fontFamily: chosenFont_ExtraBold,
        paddingHorizontal: 15,
        paddingVertical: 5,
        color: colors.greyShade4,
        fontSize: 14 + fontSize,
      },
      skeletonLeftMargin: { marginLeft: 10 },
      skeletonBoxOne: { marginTop: 15, marginHorizontal: 20 },
      skeletonBoxTwo: { marginTop: 5, marginBottom: 15, marginHorizontal: 20 },
      skeletonBoxThree: {
        marginTop: 30,
        marginVertical: 15,
        marginHorizontal: 20,
      },
      skeletonPopupContainer: {
        borderRadius: 100,
        overflow: "hidden",
        marginRight: 10,
        padding: 5,
      },
      smallPadding: {
        padding: 5,
      },
      smallMediumPadding: {
        padding: 10,
      },
      smallSectionTitles: {
        color: colors.greyShade3,
        fontSize: 14 + fontSize,
        fontFamily: chosenFont_ExtraBold,
      },
      sortIcons: {
        paddingLeft: 3,
      },
      space: { width: "100%", height: 45 },
      spaceSmall: { width: "100%", height: 20 },
      spreadCenteredRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      },
      textInputContainer: {
        width: "100%",
        backgroundColor: colors.lightGreyShade2,
        borderRadius: 10,
        height: 45,
        paddingHorizontal: 10,
        fontFamily: chosenFont_Regular,
        color: colors.black,
        fontSize: 14 + fontSize,
      },
      trendingTodayTitle: {
        fontFamily: chosenFont_Bold,
        color: colors.black,
        fontSize: 15 + fontSize,
      },
      trendingTodayCommunity: {
        fontFamily: chosenFont_Bold,
        color: colors.greyShade3,
        fontSize: 13 + fontSize,
      },
      updownvotes: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-evenly",
        width: 85,
        height: 35,
        backgroundColor: colors.greyMeta,
        borderRadius: 100,
        gap: 3,
      },
      voteContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
      voteCount: {
        fontSize: 11 + fontSize,
        color: colors.greyShade4,
        fontFamily: chosenFont_SuperBold,
      },
      writeComponentSubmit: {
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        overflow: "hidden",
      },
      xButtonContainer: {
        width: 40,
        height: 40,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
      },
      xButtonText: {
        fontFamily: chosenFont_SuperBold,
        color: colors.greyShade3,
        fontSize: 20,
      },
    };
    return <Component {...props} colors={colors} styles={styles} />;
  };

  const mapStateToProps = (state) => {
    return {
      darkModeSettings: state.updateItem.reduxGlobal.darkModeSettings,
      fontSize: state.updateItem.reduxGlobal.fontSize,
    };
  };

  return connect(mapStateToProps)(ColorSchemeComponent);
};

export default withColorScheme;
