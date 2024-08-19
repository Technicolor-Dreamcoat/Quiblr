import { useRef, useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { StateContext } from "../StateContext";
import HeaderLogo from "./components/HeaderLogo";
import MenuOptionComponent from "../components/MenuOptionComponent";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { externalURL, extractWebsiteName } from "../actions";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import GenericButton from "../components/GenericButton";
import { useNavigation } from "@react-navigation/native";
import BlankBarSection from "./BlankBarSection";

const HeaderSection = ({ colors, styles, searchValue, instance }) => {
  const {
    blankBarWidth,
    chosenFont_Regular,
    currentUserInfo,
    headerHeight,
    IconLogout,
    IconMenu2,
    IconSearch,
    IconUser,
    isPWA,
    jwt,
    leftBarWidth,
    loadingSearch,
    logout,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    setSearchIsFocused,
    setSearchText,
    setShowSearch,
    setShowSideDrawer,
    showSearch,
    showSideDrawer,
    signedInUserInfo,
    width,
  } = useContext(StateContext);

  const navigation = useNavigation();
  const [xButtonHovered, setXButtonHovered] = useState(false);
  const [stopShowingRouteSearch, setStopShowingRouteSearch] = useState(false);

  //ref for the text input
  const textInputRef = useRef(null);
  useEffect(() => {
    searchText && setStopShowingRouteSearch(true);
  }, [searchText]);

  useEffect(() => {
    setSearchText("");
    setStopShowingRouteSearch(false);
  }, [navigation]);

  //############################################
  //               NAVIGATION                 //
  //############################################

  //decode search (navigation)
  const decodedSearch = decodeURIComponent(searchValue);

  //function to see user detail (navigation)
  const navigateUser = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedUserInstance = encodeURIComponent(
      extractWebsiteName(item?.person?.actor_id)
    );
    const encodeduserName = encodeURIComponent(item?.person?.name);
    navigation.push("User", {
      currentInstance: encodedCurrentInstance,
      userInstance: encodedUserInstance,
      userName: encodeduserName,
    });
  };

  //function to execute search
  const handleOnSubmitEditing = (item) => {
    textInputRef?.current?.blur();
    // Trim the input
    const trimmedValue = item.trim();

    // Encode the value properly
    const encodedValue = encodeURIComponent(trimmedValue);

    navigation.push("SearchPage", { searchText: encodedValue });
  };

  //function to logout user
  const logoutUser = async () => {
    try {
      logout();
      navigation.push("Quiblr");
    } catch (e) {}
  };
  //############################################
  //             Animation & Design           //
  //############################################

  useEffect(() => {
    setXButtonHovered(false); //prevent hover style when typing
  }, [searchText]);

  //############################################
  //                Components                //
  //############################################

  //Search Icon (for when on a smaller screen)
  const MobileSearchIcon = () => {
    const [hovered, setHovered] = useState(false);

    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => navigation.push("SearchDropdownMobile")}
            style={[
              {
                backgroundColor: colors.white,
              },
              styles.mainPage_SideDrawerButton,
            ]}
          >
            <IconSearch size={27} stroke={3} color={colors.lightGreyShade4} />
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  //Side drawer Icon (for when on a smaller screen)
  const SideDrawerIcon = () => {
    const [hovered, setHovered] = useState(false);

    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => setShowSideDrawer(!showSideDrawer)}
            style={[
              {
                backgroundColor: colors.white,
              },
              styles.mainPage_SideDrawerButton,
            ]}
          >
            <IconMenu2 size={27} stroke={3} color={colors.lightGreyShade4} />
          </TouchableOpacity>
        </View>
      </Pressable>
    );
  };

  //User avatar menu dropdown
  const UserAvatar = () => {
    const [hovered, setHovered] = useState(false);

    return (
      <View
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ borderRadius: 100 }}
      >
        <Image
          style={{
            borderRadius: 100,
            width: headerHeight * 0.7,
            height: headerHeight * 0.7,
            opacity: hovered ? 0.7 : 1,
            backgroundColor: colors.greyShade2,
          }}
          source={{
            uri: signedInUserInfo?.person_view?.person?.avatar,
          }}
          placeholder={{
            uri: signedInUserInfo?.person_view?.person?.avatar,
          }}
          transition={"cross-dissolve"}
          priority={"high"}
        />
      </View>
    );
  };

  //############################################
  //                  Render                  //
  //############################################
  return (
    <View
      style={[
        styles.mainPage_Header,
        {
          height: headerHeight,
          width: width,
        },
      ]}
    >
      <BlankBarSection />
      {(!showSearch || width > 1000) && (
        <View
          style={{
            width: width * leftBarWidth - 33,
            minWidth: width >= 475 ? 125 : 50,
          }}
        >
          <HeaderLogo showSearch={showSearch} />
        </View>
      )}
      <View
        style={{
          flex: 1,
          height: headerHeight,
          justifyContent: "center",
          borderBottomWidth: width > 1000 && 3,
          borderBottomColor: colors.greyShade1,
        }}
      >
        <View //search bars
          style={{ flex: 1, justifyContent: "center" }}
        >
          {showSearch && width <= 1000 && (
            <View //search
              style={{
                flexDirection: "row",
                width: isPWA ? "55%" : "65%",
                alignItems: "center",
                gap: 5,
                paddingLeft: 5,
                borderWidth: 2,
                borderColor: colors.greyShade2,
                borderRadius: 10,
                backgroundColor: searchIsFocused
                  ? colors.white
                  : colors.greyShade1,
              }}
            >
              {loadingSearch && <ActivityIndicator color={colors.blueShade2} />}
              <View style={{ flex: 1 }}>
                <TextInput //Search
                  ref={textInputRef}
                  onFocus={() => setSearchIsFocused(true)}
                  onBlur={() =>
                    !searchDropdownHovering && setSearchIsFocused(false)
                  }
                  style={[
                    styles.mainPage_TextInputContainer,
                    {
                      //width: width < 800 ? 200 : width > 1000 ? 400 : 200,
                      height: 40,
                      width: "100%",
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderBottomWidth: 0,
                      backgroundColor: "tranparent",
                      paddingRight: 45,
                    },
                  ]}
                  color={colors.black}
                  autoComplete={"off"}
                  autoCapitalize={"none"}
                  placeholder="Search Quiblr"
                  placeholderTextColor={colors.greyShade3}
                  selectionColor={colors.blueShade2}
                  onChangeText={setSearchText}
                  value={
                    searchValue && !searchText && !stopShowingRouteSearch
                      ? decodedSearch
                      : searchText
                  }
                  onKeyPress={(e) =>
                    e.key == "Enter" &&
                    searchText.trim() != "" &&
                    handleOnSubmitEditing(searchText)
                  }
                />
              </View>
              {searchText && (
                <Pressable
                  onHoverIn={() => setXButtonHovered(true)}
                  onHoverOut={() => setXButtonHovered(false)}
                  onPress={() => (setSearchText(""), setShowSearch(false))}
                  style={[
                    styles.xButtonContainer,
                    {
                      marginLeft: -45,
                      backgroundColor: xButtonHovered && colors.greyShade1,
                      borderWidth: 2,
                      width: 30,
                      height: 30,
                      borderColor: xButtonHovered
                        ? colors.greyShade2
                        : "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.xButtonText, { fontSize: 20 }]}>X</Text>
                </Pressable>
              )}
            </View>
          )}

          {width > 1000 && (
            <View style={{}}>
              <View //search
                style={{
                  flexDirection: "row",
                  marginLeft: width * blankBarWidth,
                  width: "45%",
                  alignItems: "center",
                  maxWidth: width * 0.35,
                  gap: 5,
                  paddingLeft: 5,
                  borderWidth: 2,
                  borderColor: colors.greyShade2,
                  borderRadius: 10,
                  backgroundColor: searchIsFocused
                    ? colors.white
                    : colors.greyShade1,
                }}
              >
                {!loadingSearch && (
                  <IconSearch
                    size={20}
                    stroke={3}
                    color={colors.lightGreyShade4}
                  />
                )}
                {loadingSearch && (
                  <ActivityIndicator color={colors.blueShade2} />
                )}
                <View style={{ flex: 1 }}>
                  <TextInput //Search
                    ref={textInputRef}
                    onFocus={() => setSearchIsFocused(true)}
                    onBlur={() =>
                      !searchDropdownHovering && setSearchIsFocused(false)
                    }
                    style={[
                      styles.mainPage_TextInputContainer,
                      {
                        //width: width < 800 ? 200 : width > 1000 ? 400 : 200,
                        height: 40,
                        width: "100%",
                        borderTopWidth: 0,
                        borderRightWidth: 0,
                        borderBottomWidth: 0,
                        backgroundColor: "tranparent",
                        paddingRight: 45,
                      },
                    ]}
                    color={colors.black}
                    autoComplete={"off"}
                    autoCapitalize={"none"}
                    placeholder="Search Quiblr"
                    placeholderTextColor={colors.greyShade3}
                    selectionColor={colors.blueShade2}
                    onChangeText={setSearchText}
                    value={
                      searchValue && !searchText && !stopShowingRouteSearch
                        ? decodedSearch
                        : searchText
                    }
                    onKeyPress={(e) =>
                      e.key == "Enter" &&
                      width > 1000 &&
                      searchText.trim() != "" &&
                      handleOnSubmitEditing(searchText)
                    }
                  />
                </View>
                {searchText && (
                  <Pressable
                    onHoverIn={() => setXButtonHovered(true)}
                    onHoverOut={() => setXButtonHovered(false)}
                    onPress={() => setSearchText("")}
                    style={[
                      styles.xButtonContainer,
                      {
                        marginLeft: -45,
                        backgroundColor: xButtonHovered && colors.greyShade1,
                        borderWidth: 2,
                        width: 30,
                        height: 30,
                        borderColor: xButtonHovered
                          ? colors.greyShade2
                          : "transparent",
                      },
                    ]}
                  >
                    <Text style={[styles.xButtonText, { fontSize: 20 }]}>
                      X
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.mainPage_RightButtonContainer}>
          {(!showSearch || width > 1000) && (
            <GenericButton
              text={"Support"}
              noText={width < 400}
              disabled={false}
              includeBorder={true}
              textColor={colors.blueShade2}
              cancelButton={false}
              background={colors.white}
              size={"small"}
              shadowColor={colors.greyShade2}
              action={() => externalURL("https://ko-fi.com/quiblr")}
              includeIcon={true}
              icon={"heart"}
              loadingIndicator={false}
            />
          )}

          {width > 1000 && jwt == null && (
            <GenericButton
              text={"Login"}
              noText={false}
              disabled={false}
              includeBorder={false}
              textColor={"white"}
              cancelButton={false}
              background={colors.blueShade2}
              size={"small"}
              shadowColor={colors.blueShade3}
              action={() => navigation.push("Login")}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          )}

          {width <= 1000 && <MobileSearchIcon />}

          {width <= 1000 && <SideDrawerIcon />}
          <View>
            {jwt != null && (
              <Menu style={[styles.commentSortMenu]}>
                <MenuTrigger
                  style={{
                    //backgroundColor: "#11c6ee",
                    backgroundColor: currentUserInfo?.person_view?.person
                      ?.avatar
                      ? colors.white
                      : colors.blue,
                    width: headerHeight * 0.7,
                    height: headerHeight * 0.7,
                    borderRadius: 100,
                    justifyContent: "center",
                    alignitems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    {currentUserInfo?.person_view?.person?.avatar && (
                      <UserAvatar />
                    )}
                    {!signedInUserInfo?.person_view?.person?.avatar && (
                      <View
                        style={{
                          width: headerHeight * 0.7,
                          height: headerHeight * 0.7,
                          borderRadius: 100,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 23,
                            textAlign: "center",
                            color: "white",
                            fontFamily: chosenFont_Regular,
                            textTransform: "uppercase",
                          }}
                        >
                          {signedInUserInfo?.person_view?.person?.name[0]}
                        </Text>
                      </View>
                    )}
                  </View>
                </MenuTrigger>

                <MenuOptions
                  style={styles.smallPadding}
                  customStyles={styles.menuOptions}
                >
                  <MenuOptionComponent //profile
                    onSelectLogic={false}
                    includeOnStateAction={true}
                    onSelectStateAction={console.log}
                    additionalAction={() =>
                      navigateUser(currentUserInfo?.person_view)
                    }
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Profile"}
                    includeIcon={true}
                    Icon={
                      <IconUser
                        size={18}
                        stroke={2.0}
                        color={colors.greyShade4}
                      />
                    }
                  />

                  <MenuOptionComponent //logout
                    onSelectLogic={false}
                    includeOnStateAction={true}
                    onSelectStateAction={logoutUser}
                    additionalAction={console.log}
                    includeRedux={false}
                    reduxItem={""}
                    reduxValue={""}
                    showAlertCriteria={false}
                    title={"Logout"}
                    includeIcon={true}
                    Icon={
                      <IconLogout
                        size={18}
                        stroke={2.0}
                        color={colors.greyShade4}
                      />
                    }
                  />
                </MenuOptions>
              </Menu>
            )}
          </View>
        </View>
      </View>
      <BlankBarSection />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sort: state.updateItem.reduxGlobal.sort,
    instance: state.updateItem.reduxGlobal.instance,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(HeaderSection);

export default withColorScheme(ConnectedComponent);
