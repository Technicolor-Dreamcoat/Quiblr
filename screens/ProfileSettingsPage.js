import React, { useRef, useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { SmallSpace, Space } from "../constants";
import { StateContext } from "../StateContext";
import * as ImagePicker from "expo-image-picker";
import Toggle from "react-native-toggle-element";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import GenericButton from "../components/GenericButton";
import ProfileSettingsPlaceholder from "./settings/components/ProfileSettingsPlaceholder";
import BackNavigation from "../components/BackNavigation";

const ProfileSettingsPage = ({ colors, styles, showScrollBars }) => {
  const {
    chosenFont_Bold,
    currentUserInfo,
    generateCaptcha,
    getOtherUserDetails,
    getSite,
    height,
    IconUsers,
    instanceDetail,
    jwt,
    refreshPersonDetails,
    saveUserSettings,
    setSignedInUserInfo,
    setUserDetails,
    uploadImage,
    userDetails,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [bannerUploadLoading, setBannerUploadLoading] = useState(false);
  const [avatarUploadLoading, setAvatarUploadLoading] = useState(false);
  const [displayName, setDisplayName] = useState(null);
  const [banner, setBanner] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [bio, setBio] = useState(null);
  const [email, setEmail] = useState(null);
  const [botAccount, setBotAccount] = useState(false);
  const [blurNSFW, setBlurNSFW] = useState(false);
  const [showNSFW, setShowNSFW] = useState(false);
  const [openLinksInNewTab, setOpenLinksInNewTab] = useState(false);
  const [sendNotificationsToEmail, setSendNotificationsToEmail] =
    useState(false);
  const [loadingUpdatedSettings, setLoadingUpdatedSettings] = useState(false);
  const refBotAccount = useRef(botAccount);
  const [canGoBack, setCanGoBack] = useState(false);

  // Listen to navigation events to update the state
  useFocusEffect(
    useCallback(() => {
      setCanGoBack(navigation.canGoBack());
      getSite(jwt);
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
    refBotAccount.current = botAccount;
  });

  //get the instance detail once it loads
  useEffect(() => {
    jwt &&
      setDisplayName(
        instanceDetail?.my_user?.local_user_view?.person?.display_name
      );
    jwt && setBanner(instanceDetail?.my_user?.local_user_view?.person?.banner);
    jwt && setAvatar(instanceDetail?.my_user?.local_user_view?.person?.avatar);
    jwt && setBio(instanceDetail?.my_user?.local_user_view?.person?.bio);
    jwt &&
      setEmail(instanceDetail?.my_user?.local_user_view?.local_user?.email);
    jwt && setBotAccount(userDetails?.person_view?.person?.bot_account);
    jwt &&
      setBlurNSFW(
        instanceDetail?.my_user?.local_user_view?.local_user?.blur_nsfw
      );
    jwt &&
      setShowNSFW(
        instanceDetail?.my_user?.local_user_view?.local_user?.show_nsfw
      );
    jwt &&
      setOpenLinksInNewTab(
        instanceDetail?.my_user?.local_user_view?.local_user
          ?.open_links_in_new_tab
      );
    jwt &&
      setSendNotificationsToEmail(
        instanceDetail?.my_user?.local_user_view?.local_user
          ?.send_notifications_to_email
      );
  }, [instanceDetail]);

  //function to save user settings
  const updateProfileSettings = async () => {
    setLoadingUpdatedSettings(true);
    try {
      await saveUserSettings({
        banner: banner,
        avatar: avatar,
        display_name: displayName,
        bio: bio,
        email: email,
        blur_nsfw: blurNSFW,
        show_nsfw: showNSFW,
        open_links_in_new_tab: openLinksInNewTab,
        send_notifications_to_email: sendNotificationsToEmail,
      });
      setSignedInUserInfo(userDetails);
      refreshPersonDetails();
      getSite(jwt);
    } catch (e) {
      alert(e);
    } finally {
      setUserDetails(currentUserInfo);
      setLoadingUpdatedSettings(false);
      handleGoBack();
    }
  };

  //edit button for banner & avatar
  const EditButton = ({ text, action }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverIn={() => setHovered(true)}
        onHoverOut={() => setHovered(false)}
      >
        <TouchableOpacity
          style={[
            styles.iconContainer,
            {
              gap: 0,
              borderWidth: 2,
              borderColor: colors.white,
              backgroundColor: hovered ? colors.blueShade1 : colors.blueShade2,
            },
          ]}
          onPress={action}
        >
          <Text style={{ color: "white", fontFamily: chosenFont_Bold }}>
            {text}
          </Text>
        </TouchableOpacity>
      </Pressable>
    );
  };

  //convert image uri to blob
  function dataURItoBlob(dataURI) {
    // Convert Base64 to raw binary data held in a string.

    var byteString = atob(dataURI.split(",")[1]);

    // Write the bytes of the string to an ArrayBuffer.
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);

    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // Write the ArrayBuffer to a BLOB and you're done.

    var bb = new Blob([ab]);
    return bb;
  }

  //change banner
  const changeBanner = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,
      quality: 0.1,
    });
    if (!result.canceled) {
      try {
        setBannerUploadLoading(true);

        await uploadImage({
          image: dataURItoBlob(result?.assets[0]?.uri),
        }).then((result) => {
          setBanner(result?.url);
        });
        setBannerUploadLoading(false);
      } catch (e) {
        alert(e);
        setBannerUploadLoading(false);
      }
    }
  };

  //change avatar
  const changeAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: false,
      base64: true,
      quality: 0.1,
    });
    if (!result.canceled) {
      try {
        setAvatarUploadLoading(true);
        await uploadImage({
          image: dataURItoBlob(result?.assets[0]?.uri),
        }).then((result) => {
          setAvatar(result?.url);
        });
        setAvatarUploadLoading(false);
      } catch (e) {
        alert(e);
        setAvatarUploadLoading(false);
      }
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.white, flex: 1 }}
      showsVerticalScrollIndicator={showScrollBars}
      contentContainerStyle={{ justifyContent: "center" }}
    >
      {instanceDetail.my_user != null && <BackNavigation />}
      {instanceDetail.my_user == null ? (
        <View
          style={{
            padding: 30,
            width: width < 500 ? "100%" : 450,
            alignSelf: "center",
            height,
          }}
        >
          <ProfileSettingsPlaceholder />
        </View>
      ) : (
        <View
          style={{
            padding: 30,
            width: width < 500 ? "100%" : 450,
            alignSelf: "center",
            height,
          }}
        >
          <View //header
            style={[styles.loginContainer]}
          >
            <View>
              <View //header title
              >
                <View style={{ paddingTop: 30 }} />
                <Space />
                <Text style={styles.loginPageTitle}>Profile settings</Text>
              </View>
            </View>
          </View>
          <View>
            <Space />
            <View //banner & avatar
              style={{
                width: "100%",
                height: 200,
                borderRadius: 10,
                overflow: "hidden",
                borderWidth: 2,
                borderColor: colors.greyShade2,
              }}
            >
              {banner && !bannerUploadLoading ? (
                <Image
                  key={banner}
                  style={{
                    borderTopLeftRadius: 7,
                    borderTopRightRadius: 7,
                    width: "100%",
                    height: "70%",
                  }}
                  resizeMode={"cover"}
                  source={{ uri: banner }}
                />
              ) : (
                <View //banner empty
                  style={{
                    width: "100%",
                    height: "70%",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: colors.greyShade2,
                  }}
                >
                  {bannerUploadLoading && (
                    <ActivityIndicator
                      size={"large"}
                      color={colors.blueShade2}
                    />
                  )}
                </View>
              )}
              <View
                style={{
                  // opacity: 0.85,
                  position: "absolute",
                  left: 15,
                  top: 15,
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  shadowOffset: {
                    height: 5,
                    width: 0,
                  },
                }}
              >
                <EditButton text={"Edit banner"} action={changeBanner} />
              </View>
              <View
                style={{
                  backgroundColor: colors.greyShade1,
                  borderRadius: 100,
                  width: 80,
                  height: 80,
                  marginTop: -40,
                  alignSelf: "center",
                  borderWidth: 6,
                  borderColor: colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {avatarUploadLoading ? (
                  <ActivityIndicator size={"large"} color={colors.blueShade2} />
                ) : avatar ? (
                  <Image
                    key={avatar}
                    style={{ borderRadius: 100, width: "100%", height: "100%" }}
                    resizeMode={"cover"}
                    source={{ uri: avatar }}
                  />
                ) : (
                  <IconUsers size={50} stroke={2.0} color={colors.greyShade3} />
                )}
              </View>

              <View
                style={{
                  opacity: 0.85,
                  position: "absolute",
                  left: 15,
                  bottom: 15,
                  borderRadius: 100,
                  shadowColor: "black",
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  shadowOffset: {
                    height: 5,
                    width: 0,
                  },
                }}
              >
                <EditButton text={"Edit avatar"} action={changeAvatar} />
              </View>
            </View>
            <SmallSpace />
            <Text style={styles.sectionHeader}>Display name</Text>
            <TextInput //Display Name
              style={[
                styles.mainPage_TextInputContainer,
                {
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  padding: 15,
                  borderLeftWidth: 2,
                },
              ]}
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={"[Optional]"}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setDisplayName}
              value={displayName}
            />
            <SmallSpace />
            <Text style={styles.sectionHeader}>Bio</Text>
            <TextInput //Bio
              style={[
                styles.mainPage_TextInputContainer,
                {
                  width: "100%",
                  height: 75,
                  borderRadius: 10,
                  padding: 15,
                  borderLeftWidth: 2,
                },
              ]}
              multiline
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={""}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setBio}
              value={bio}
            />

            <SmallSpace />
            <Text style={styles.sectionHeader}>Email</Text>
            <TextInput //Email
              style={[
                styles.mainPage_TextInputContainer,
                {
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  padding: 15,
                  borderLeftWidth: 2,
                },
              ]}
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={"[Optional]"}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setEmail}
              value={email}
            />
            <SmallSpace />

            <View //Blur NSFW
              style={[
                styles.spreadCenteredRow,
                {
                  flex: 1,
                  //borderBottomWidth: 1,
                  borderColor: colors.lightGreyShade4,
                  height: "100%",
                  paddingRight: 10,
                },
              ]}
            >
              <Text style={styles.boldText}>Blur NSFW</Text>
              <Toggle
                value={blurNSFW}
                containerStyle={{ width: 50 }}
                trackBar={{ width: 71 }}
                trackBarStyle={{
                  width: 50,
                  height: 30,
                  backgroundColor: blurNSFW ? "#6cd45c" : "#d6d6d6",
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
                onPress={() => setBlurNSFW(!blurNSFW)}
              />
            </View>
            <SmallSpace />

            <View //Show NSFW
              style={[
                styles.spreadCenteredRow,
                {
                  flex: 1,
                  //borderBottomWidth: 1,
                  borderColor: colors.lightGreyShade4,
                  height: "100%",
                  paddingRight: 10,
                },
              ]}
            >
              <Text style={styles.boldText}>Show NSFW</Text>
              <Toggle
                value={showNSFW}
                containerStyle={{ width: 50 }}
                trackBar={{ width: 71 }}
                trackBarStyle={{
                  width: 50,
                  height: 30,
                  backgroundColor: showNSFW ? "#6cd45c" : "#d6d6d6",
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
                onPress={() => setShowNSFW(!showNSFW)}
              />
            </View>
            <SmallSpace />

            <View //Open links in new tab
              style={[
                styles.spreadCenteredRow,
                {
                  flex: 1,
                  //borderBottomWidth: 1,
                  borderColor: colors.lightGreyShade4,
                  height: "100%",
                  paddingRight: 10,
                },
              ]}
            >
              <Text style={styles.boldText}>Open links in new tab</Text>
              <Toggle
                value={openLinksInNewTab}
                containerStyle={{ width: 50 }}
                trackBar={{ width: 71 }}
                trackBarStyle={{
                  width: 50,
                  height: 30,
                  backgroundColor: openLinksInNewTab ? "#6cd45c" : "#d6d6d6",
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
                onPress={() => setOpenLinksInNewTab(!openLinksInNewTab)}
              />
            </View>
            <SmallSpace />

            <View //Send notifications to email
              style={[
                styles.spreadCenteredRow,
                {
                  flex: 1,
                  //borderBottomWidth: 1,
                  borderColor: colors.lightGreyShade4,
                  height: "100%",
                  paddingRight: 10,
                },
              ]}
            >
              <Text style={styles.boldText}>Send notifications to email</Text>
              <Toggle
                value={sendNotificationsToEmail}
                containerStyle={{ width: 50 }}
                trackBar={{ width: 71 }}
                trackBarStyle={{
                  width: 50,
                  height: 30,
                  backgroundColor: sendNotificationsToEmail
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
                  setSendNotificationsToEmail(!sendNotificationsToEmail)
                }
              />
            </View>

            <Space />

            <View
              style={{
                flexDirection: width > 350 && "row",
                alignSelf: "center",
                gap: width > 350 ? 5 : 10,
              }}
            >
              <GenericButton
                text={"CANCEL"}
                noText={false}
                disabled={loadingUpdatedSettings}
                includeBorder={true}
                textColor={colors.greyShade3}
                cancelButton={true}
                background={colors.white}
                size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
                shadowColor={colors.greyShade3}
                action={() => handleGoBack()}
                includeIcon={false}
                icon={"pencil"}
                loadingIndicator={false}
                tall={false}
              />
              <GenericButton
                text={"SAVE"}
                noText={false}
                disabled={loadingUpdatedSettings}
                includeBorder={false}
                textColor={"white"}
                cancelButton={false}
                background={colors.blueShade2}
                size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
                shadowColor={
                  loadingUpdatedSettings ? "transparent" : colors.blueShade3
                }
                action={() => updateProfileSettings()}
                includeIcon={false}
                icon={"pencil"}
                loadingIndicator={loadingUpdatedSettings}
                tall={false}
              />
            </View>
            <Space />
          </View>
        </View>
      )}
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ProfileSettingsPage);

export default withColorScheme(ConnectedComponent);
