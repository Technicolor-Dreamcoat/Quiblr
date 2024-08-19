import React, { useContext, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { extractWebsiteName, RenderText } from "../../../actions";
import { SmallSpace, Space } from "../../../constants";
import { StateContext } from "../../../StateContext";
import { LemmyHttp } from "lemmy-js-client";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import BackNavigation from "../../../components/BackNavigation";
import AlreadyHaveAnAccount from "../components/AlreadyHaveAnAccount";
import PageTitle from "../../../components/PageTitle";
import GenericButton from "../../../components/GenericButton";
const SignupPageApplication = ({
  colors,
  styles,
  reduxInstance,
  fontSize,
  showScrollBars,
  route,
}) => {
  const {
    changeInstance,
    chosenFont_Bold,
    chosenFont_Regular,
    chosenFont_SuperBold,
    height,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [loadingCaptcha, setLoadingCaptcha] = useState(false);
  const [captcha, setCaptcha] = useState(""); //captcha puzzle
  const [userInput, setUserInput] = useState(""); //user captcha answer
  const [applicationAnswer, setApplicationAnswer] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signUpProgressPage, setSignUpProgressPage] = useState("Intro");
  const [key, setKey] = useState(reduxInstance);
  const [selectedSiteInfo, setSelectedSiteInfo] = useState("");
  const [passwordsDontMatch, setPasswordsDontMatch] = useState(false);
  const [audioUrl, setAudioUrl] = useState("");

  //function to submit registration
  async function submitRegistration(
    instanceURL,
    application_answer,
    captcha_answer,
    captcha_uuid,
    submitted_email,
    submitted_password,
    password_verify,
    submitted_username
  ) {
    try {
      const newClient = new LemmyHttp(instanceURL, {
        mode: "no-cors",
      });
      if (!newClient) return null;
      await newClient.register({
        answer: application_answer,
        captcha_answer: captcha_answer,
        captcha_uuid: captcha_uuid,
        email: submitted_email,
        password: submitted_password,
        password_verify: password_verify,
        show_nsfw: false,
        username: submitted_username,
      });

      selectedSiteInfo?.site_view?.local_site?.require_email_verification
        ? alert(
            `Account application sent to ${extractWebsiteName(
              key
            )}! Please check your email for a verification link.`
          )
        : alert(`Account application sent to ${key}!`);
      await changeInstance(instanceURL);
      navigation.push("Login");
    } catch (e) {
      alert(e);
      selectedSiteInfo?.site_view?.local_site?.captcha_enabled &&
        !loadingCaptcha &&
        getCaptchaCall(key);
      setUserInput("");
    }
  }

  //make sound object for captcha
  const soundObject = new Audio.Sound();

  //function to convert audio to blob (needed for safari)
  function b64ToBlob(b64Data, contentType = "", sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  // Safari doesn't support playing b64 data URIs, so we gotta createObjectURL
  useEffect(() => {
    if (!captcha?.ok) return;

    const blob = b64ToBlob(captcha.ok.wav, "audio/wav");
    const newUrl = URL.createObjectURL(blob);
    setAudioUrl(newUrl);

    return () => {
      URL.revokeObjectURL(newUrl);
    };
  }, [captcha]);

  //function to play captcha sound
  async function playCaptcha(file) {
    try {
      await soundObject.loadAsync(file);
      await soundObject.playAsync();
    } catch (error) {
      await soundObject.playAsync();
    }
  }

  //api call to get captcha
  const getCaptchaCall = useCallback(
    async (key) => {
      setLoadingCaptcha(true);
      const newClient = new LemmyHttp(key, {
        mode: "no-cors",
      });
      if (!newClient) return null;

      let res;

      try {
        res = await newClient.getCaptcha();
      } catch (e) {
        alert(e);
      } finally {
        setLoadingCaptcha(false);
        setCaptcha(res);
      }
    },
    [key]
  );

  //run captcha
  useEffect(() => {
    selectedSiteInfo?.site_view?.local_site?.captcha_enabled &&
      !loadingCaptcha &&
      getCaptchaCall(key);
  }, [selectedSiteInfo]);

  //check if the passwords match
  useEffect(() => {
    password != confirmPassword && setPasswordsDontMatch(true);
    password == confirmPassword && setPasswordsDontMatch(false);
  }, [password, confirmPassword]);

  //api call to get Instance info
  const selectedInstanceInfo = async (key, options) => {
    try {
      const newClient = new LemmyHttp(key, {
        mode: "no-cors",
      });
      if (!newClient) return null;

      const response = await newClient.getSite({ ...options });
      setSelectedSiteInfo(response);
      return response;
    } catch (e) {
      setSelectedSiteInfo("");
    } finally {
      setKey(key);
    }
  };

  //call the api to get Instance Info + loading
  async function runInstanceInfo(key) {
    setLoadingIndicator(true);
    await selectedInstanceInfo("https://" + key);
    setLoadingIndicator(false);
  }

  useEffect(() => {
    runInstanceInfo(decodeURIComponent(route.params.selected_instance));
    setApplicationAnswer(""); //reset application answer
    setEmail(""); //reset email
    setUsername(""); //reset username
    setPassword(""); //reset password
    setConfirmPassword(""); //reset confirm password
    setUserInput(""); //reset captcha answer
  }, [route.params]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={showScrollBars}
      style={{ height, backgroundColor: colors.white }}
    >
      <BackNavigation differentText={"FRONT PAGE"} goHome={true} />

      <View
        style={{
          backgroundColor: colors.white,
          width,
          padding: 15,
          paddingTop: 0,
        }}
      >
        {signUpProgressPage != "Account Info" && (
          <View //Instance Info
          >
            <PageTitle text={"Sign Up - Application"} type={"fullpage"} />
            <Space />

            {selectedSiteInfo && (
              <View
                style={{
                  width: width < 800 ? "100%" : 700,
                  alignSelf: "center",
                }}
              >
                <View style={{ paddingHorizontal: width < 500 ? 0 : 15 }}>
                  <Text
                    style={{
                      fontFamily: chosenFont_Bold,
                      fontSize: 17 + fontSize,
                      color: colors.greyShade5,
                      alignSelf: "center",
                      textAlign: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: chosenFont_SuperBold,
                        fontSize: 17 + fontSize,
                        color: colors.greyShade5,
                      }}
                    >
                      {extractWebsiteName(key)} reviews account requests.
                    </Text>{" "}
                    Please read and enter your application answer below:
                  </Text>
                </View>
                <SmallSpace />
                <View
                  style={{
                    padding: 15,
                    borderRadius: 20,
                    borderWidth: 2,
                    width: "100%",
                    borderColor: colors.greyShade2,
                    backgroundColor: colors.lightGreyNestedComment,
                  }}
                >
                  <RenderText
                    body={
                      selectedSiteInfo?.site_view?.local_site
                        ?.application_question
                    }
                    colors={colors}
                    fontSize={fontSize + 5}
                    instance={reduxInstance}
                  />

                  <SmallSpace />
                  <View
                    style={{
                      width: width < 500 ? "100%" : 450,
                      alignSelf: "center",
                    }}
                  >
                    <TextInput //Application Answer
                      style={[
                        styles.mainPage_TextInputContainer,
                        {
                          width: "100%",
                          height: 50,
                          borderRadius: 10,
                          borderTopRightRadius: 10,
                          borderBottomRightRadius: 10,
                          padding: 15,
                          borderWidth: 2,
                          borderColor: colors.greyShade2,
                        },
                      ]}
                      color={colors.black}
                      autoComplete={"off"}
                      autoCapitalize={"none"}
                      placeholder={"ANSWER"}
                      placeholderTextColor={colors.greyShade3}
                      selectionColor={colors.blueShade2}
                      onChangeText={setApplicationAnswer}
                      value={applicationAnswer}
                      // onKeyPress={(e) =>
                      //   e.key == "Enter" &&
                      //   password != "" &&
                      //   username != "" &&
                      //   userInput != "" &&
                      //   pressedLogin()
                      // }
                    />
                  </View>
                </View>
              </View>
            )}
            <SmallSpace />
            <View
              style={{
                marginTop: 5,
                flexDirection: width > 350 && "row",
                gap: 10,
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <GenericButton
                text={"GO BACK"}
                noText={false}
                disabled={false}
                includeBorder={true}
                textColor={colors.greyShade3}
                cancelButton={true}
                background={colors.white}
                size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
                shadowColor={colors.greyShade3}
                action={() => navigation.push("SignupSelectInstance")}
                includeIcon={false}
                icon={"pencil"}
                loadingIndicator={false}
                tall={false}
              />
              <GenericButton
                text={"CONTINUE"}
                noText={false}
                disabled={!applicationAnswer && selectedSiteInfo}
                includeBorder={false}
                textColor={
                  !applicationAnswer && selectedSiteInfo
                    ? colors.greyShade4
                    : "white"
                }
                cancelButton={false}
                background={
                  !applicationAnswer && selectedSiteInfo
                    ? colors.greyShade2
                    : colors.blueShade2
                }
                size={width <= 350 ? "large" : width < 500 ? "medium" : "large"}
                shadowColor={
                  !applicationAnswer && selectedSiteInfo
                    ? "transparent"
                    : colors.blueShade3
                }
                action={() => setSignUpProgressPage("Account Info")}
                includeIcon={false}
                icon={"pencil"}
                loadingIndicator={false}
                tall={false}
              />
            </View>
            <SmallSpace />
            <AlreadyHaveAnAccount />
            <Space />
          </View>
        )}
        {signUpProgressPage == "Account Info" && (
          <View //Account Info
            style={{ width: width < 500 ? "100%" : 450, alignSelf: "center" }}
          >
            <PageTitle text={"Sign Up - Acount Info"} type={"fullpage"} />
            <SmallSpace />

            <View //Email View [may be optional]
            >
              <TextInput //Email
                style={[
                  styles.mainPage_TextInputContainer,
                  {
                    width: "100%",
                    height: 50,
                    borderRadius: 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    padding: 15,
                    borderWidth: 2,
                    borderColor: colors.greyShade2,
                  },
                ]}
                color={colors.black}
                autoComplete={"off"}
                autoCapitalize={"none"}
                placeholder={"EMAIL"}
                placeholderTextColor={colors.greyShade3}
                selectionColor={colors.blueShade2}
                onChangeText={setEmail}
                value={email}
                // onKeyPress={(e) =>
                //   e.key == "Enter" &&
                //   password != "" &&
                //   username != "" &&
                //   userInput != "" &&
                //   pressedLogin()
                // }
              />
              <SmallSpace />
            </View>

            <TextInput //Username
              style={[
                styles.mainPage_TextInputContainer,
                {
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  padding: 15,
                  borderWidth: 2,
                  borderColor: colors.greyShade2,
                },
              ]}
              maxLength={
                selectedSiteInfo?.site_view?.local_site?.actor_name_max_length
              }
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={"USERNAME"}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setUsername}
              value={username}
              // onKeyPress={(e) =>
              //   e.key == "Enter" &&
              //   password != "" &&
              //   username != "" &&
              //   userInput != "" &&
              //   pressedLogin()
              // }
            />
            {username.includes("@") && (
              <Text
                style={{
                  color: colors.red,
                  fontStyle: "italic",
                  fontFamily: chosenFont_Regular,
                }}
              >
                Please provide your username here (not email)
              </Text>
            )}
            <SmallSpace />
            <TextInput //Password
              style={[
                styles.mainPage_TextInputContainer,
                {
                  marginTop: 5,
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  padding: 15,
                  borderWidth: 2,
                  borderColor: colors.greyShade2,
                },
              ]}
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={"PASSWORD"}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              secureTextEntry
              onChangeText={setPassword}
              value={password}
              // onKeyPress={(e) =>
              //   e.key == "Enter" &&
              //   password != "" &&
              //   username != "" &&
              //   userInput != "" &&
              //   pressedLogin()
              // }
            />
            <TextInput //Confirm Password
              style={[
                styles.mainPage_TextInputContainer,
                {
                  marginTop: 5,
                  width: "100%",
                  height: 50,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  padding: 15,
                  borderWidth: 2,
                  borderColor: colors.greyShade2,
                },
              ]}
              color={colors.black}
              autoComplete={"off"}
              autoCapitalize={"none"}
              placeholder={"CONFRIM PASSWORD"}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              secureTextEntry
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              // onKeyPress={(e) =>
              //   e.key == "Enter" &&
              //   password != "" &&
              //   username != "" &&
              //   userInput != "" &&
              //   pressedLogin()
              // }
            />
            <SmallSpace />
            {captcha && (
              <View //captcha (if required)
              >
                <View
                  style={{
                    overflow: "hidden",
                    borderRadius: 20,
                    width: "100%",
                    aspectRatio: 1.83,
                    backgroundColor: colors.greyShade1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {loadingCaptcha ? (
                    <ActivityIndicator
                      size={"large"}
                      color={colors.blueShade2}
                    />
                  ) : (
                    <Image
                      key={captcha}
                      source={{
                        uri: "data:image/png;base64," + captcha?.ok?.png,
                      }}
                      style={{
                        height: "100%",
                        width: "100%",
                        resizeMode: "contain",
                        alignSelf: "center",
                      }}
                    />
                  )}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    marginTop: 10,
                    justifyContent: "flex-end",
                  }}
                >
                  <TouchableOpacity
                    onPress={() =>
                      selectedSiteInfo?.site_view?.local_site
                        ?.captcha_enabled &&
                      !loadingCaptcha &&
                      getCaptchaCall(key)
                    }
                  >
                    <FontAwesome5
                      name={"redo"}
                      size={20}
                      color={colors.greyShade4}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => playCaptcha(audioUrl)}>
                    <FontAwesome5
                      name={"volume-up"}
                      size={20}
                      color={colors.greyShade4}
                    />
                  </TouchableOpacity>
                </View>
                <SmallSpace />
                <TextInput //Captcha Answer
                  style={[
                    styles.mainPage_TextInputContainer,
                    {
                      width: "100%",
                      height: 50,
                      borderRadius: 10,
                      borderTopRightRadius: 10,
                      borderBottomRightRadius: 10,
                      padding: 15,
                      borderWidth: 2,
                      borderColor: colors.greyShade2,
                    },
                  ]}
                  color={colors.black}
                  autoComplete={"off"}
                  autoCapitalize={"none"}
                  placeholder={"CAPTCHA ANSWER"}
                  placeholderTextColor={colors.greyShade3}
                  selectionColor={colors.blueShade2}
                  onChangeText={setUserInput}
                  value={userInput}
                  // onKeyPress={(e) =>
                  //   e.key == "Enter" &&
                  //   password != "" &&
                  //   username != "" &&
                  //   userInput != "" &&
                  //   pressedLogin()
                  // }
                />
              </View>
            )}

            {!passwordsDontMatch && <SmallSpace />}
            <Space />
            {passwordsDontMatch && (
              <Text
                style={{
                  marginVertical: 2,
                  backgroundColor: colors.lightBlue,
                  borderWidth: 1,
                  borderColor: colors.blueShade2,
                  padding: 10,
                  borderRadius: 10,
                  color: colors.blueShade2,
                  fontStyle: "italic",
                  fontFamily: chosenFont_Regular,
                }}
              >
                Passwords do not match
              </Text>
            )}
            {passwordsDontMatch && <SmallSpace />}
            <View //buttons
              style={{
                flexDirection: width > 450 && "row",
                justifyContent: width > 450 && "center",
                alignItems: "center",
                gap: width > 450 ? 5 : 10,
              }}
            >
              <GenericButton
                text={"GO BACK"}
                noText={false}
                disabled={false}
                includeBorder={true}
                textColor={colors.greyShade3}
                cancelButton={false}
                background={colors.white}
                size={"large"}
                shadowColor={colors.greyShade3}
                action={() => setSignUpProgressPage("Application")}
                includeIcon={false}
                icon={""}
                loadingIndicator={false}
              />
              <GenericButton
                text={"CREATE ACCOUNT"}
                noText={false}
                disabled={
                  captcha
                    ? selectedSiteInfo?.site_view?.local_site
                        ?.require_email_verification
                      ? !email ||
                        !userInput ||
                        !username ||
                        !password ||
                        !confirmPassword ||
                        passwordsDontMatch
                      : !userInput ||
                        !username ||
                        !password ||
                        !confirmPassword ||
                        passwordsDontMatch
                    : !username ||
                      !password ||
                      !confirmPassword ||
                      passwordsDontMatch
                }
                includeBorder={false}
                textColor={
                  selectedSiteInfo?.site_view?.local_site
                    ?.require_email_verification
                    ? captcha
                      ? userInput &&
                        !passwordsDontMatch &&
                        username &&
                        password &&
                        confirmPassword &&
                        email
                        ? "white"
                        : colors.greyShade4
                      : !passwordsDontMatch &&
                        username &&
                        password &&
                        confirmPassword &&
                        email
                      ? "white"
                      : colors.greyShade4
                    : !passwordsDontMatch &&
                      username &&
                      password &&
                      confirmPassword
                    ? "white"
                    : colors.greyShade4
                }
                cancelButton={false}
                background={
                  selectedSiteInfo?.site_view?.local_site
                    ?.require_email_verification
                    ? captcha
                      ? userInput &&
                        !passwordsDontMatch &&
                        username &&
                        password &&
                        confirmPassword &&
                        email
                        ? colors.blueShade2
                        : colors.greyShade2
                      : !passwordsDontMatch &&
                        username &&
                        password &&
                        confirmPassword &&
                        email
                      ? colors.blueShade2
                      : colors.greyShade2
                    : !passwordsDontMatch &&
                      username &&
                      password &&
                      confirmPassword
                    ? colors.blueShade2
                    : colors.greyShade2
                }
                size={"large"}
                shadowColor={
                  selectedSiteInfo?.site_view?.local_site
                    ?.require_email_verification
                    ? captcha
                      ? userInput &&
                        !passwordsDontMatch &&
                        username &&
                        password &&
                        confirmPassword &&
                        email
                        ? colors.blueShade3
                        : "transparent"
                      : !passwordsDontMatch &&
                        username &&
                        password &&
                        confirmPassword &&
                        email
                      ? colors.blueShade3
                      : "transparent"
                    : !passwordsDontMatch &&
                      username &&
                      password &&
                      confirmPassword
                    ? colors.blueShade3
                    : "transparent"
                }
                action={() =>
                  submitRegistration(
                    key,
                    applicationAnswer,
                    userInput,
                    captcha?.ok?.uuid,
                    email,
                    password,
                    confirmPassword,
                    username
                  )
                }
                includeIcon={false}
                icon={""}
                loadingIndicator={false}
              />
            </View>
            <SmallSpace />
            <AlreadyHaveAnAccount />
            <Space />
          </View>
        )}
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {
    reduxInstance: state.updateItem.reduxGlobal.instance,
    fontSize: state.updateItem.reduxGlobal.fontSize,
    showScrollBars: state.updateItem.reduxGlobal.showScrollBars,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SignupPageApplication);

export default withColorScheme(ConnectedComponent);
