import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";
import { SelectList } from "react-native-dropdown-select-list";
import { SmallSpace } from "../constants";
import { StateContext } from "../StateContext";
import BackNavigation from "../components/BackNavigation";
import { useNavigation } from "@react-navigation/native";
import PageTitle from "../components/PageTitle";
import GenericButton from "../components/GenericButton";
const ForgotPasswordScreen = ({ colors, styles, reduxInstance }) => {
  const {
    chosenFont_ExtraBold,
    chosenFont_Regular,
    generateCaptcha,
    getFederatedInstances,
    global,
    IconChevronDown,
    IconSearch,
    loadingLogin,
    passwordReset,
    setLoading,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [wrongAnswer, setWrongAnswer] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha()); //captcha puzzle
  const [userInput, setUserInput] = useState(""); //user captcha answer
  const [items, setItems] = useState([]);
  const [hoveredSignUp, setHoveredSignUp] = useState(false);
  const [sentReset, setSentReset] = useState(false);

  //set the initial instance to the redux value
  useEffect(() => {
    !loadingLogin && setKey(reduxInstance);
  }, []);

  //popular instances
  const popularInstances = [
    { key: "https://lemmy.world", value: "lemmy.world" },
    { key: "https://beehaw.org", value: "beehaw.org" },
    { key: "https://lemmy.ca", value: "lemmy.ca" },
    { key: "https://lemmy.ml", value: "lemmy.ml" },
    { key: "https://mujico.org", value: "mujico.org" },
    { key: "https://sh.itjust.works", value: "sh.itjust.works" },
    { key: "https://lemm.ee", value: "lemm.ee" },
    { key: "https://lemmygrad.ml", value: "lemmygrad.ml" },
    { key: "https://lemmy.dbzer0.com", value: "lemmy.dbzer0.com" },
    { key: "https://lemmy.fmhy.ml", value: "lemmy.fmhy.ml" },
    { key: "https://discuss.tchncs.de", value: "discuss.tchncs.de" },
    { key: "https://discuss.online", value: "discuss.online" },
    { key: "https://sopuli.xyz", value: "sopuli.xyz" },
    { key: "https://reddthat.com", value: "reddthat.com" },
    { key: "https://lemmyjapan.com", value: "lemmyjapan.com" },
    { key: "https://lemmy.dbzer0.com", value: "lemmy.dbzer0.com" },
    { key: "https://programming.dev", value: "programming.dev" },
    { key: "https://lemmy.blahaj.zone", value: "lemmy.blahaj.zone" },
    { key: "https://lemmynsfw.com", value: "lemmynsfw.com" },
  ];

  //clear the "captcha error" on type
  useEffect(() => {
    userInput?.length > 0 && setWrongAnswer(false);
  }, [userInput]);

  //get the list of instances
  useEffect(() => {
    const fetchInstances = async () => {
      try {
        //get all instances
        const federatedInstances = await getFederatedInstances();

        //get domains names
        const federatedInstanceNames =
          federatedInstances.federated_instances.linked.map(
            (obj) => obj.domain
          );

        //sort alphabetically
        federatedInstanceNames.sort((a, b) => a.localeCompare(b));

        //format for searchable list
        const transformedArray = federatedInstanceNames.map((domain) => ({
          key: `https://${domain}`,
          value: domain,
        }));

        // Create a Set to track unique labels
        const uniqueLabels = new Set();

        // Combine the two arrays while avoiding duplicates
        const combinedArray = [
          ...popularInstances, // Include items from the second array
          ...transformedArray.filter((item) => {
            // Check if the label is not in the Set
            if (!uniqueLabels.has(item.value)) {
              // Add the label to the Set and include the item
              uniqueLabels.add(item.value);
              return true;
            }
            return false;
          }),
        ];

        //save domains list to state
        setItems(combinedArray);
      } catch {
        setItems(popularInstances.filter((item) => item.key !== reduxInstance));
      }
    };
    try {
      fetchInstances();
    } catch {
      //if failed to fetch, use popular instances
      setItems(popularInstances.filter((item) => item.key !== reduxInstance));
    }
  }, []);

  //press reset password submission
  const pressedSubmit = async () => {
    setLoadingIndicator(true);
    setLoading(true);
    const captchaNumbers = captcha.split(" + ");
    const correctAnswer =
      parseInt(captchaNumbers[0]) + parseInt(captchaNumbers[1]);
    if (parseInt(userInput) === correctAnswer) {
      try {
        await passwordReset(key, { email: email });
        setSentReset(true);
        setLoading(false);
        setLoadingIndicator(false);
        setUserInput("");
        setCaptcha(generateCaptcha());
      } catch (e) {
        setSentReset(true);
        setLoading(false);
        setLoadingIndicator(false);
        setUserInput("");
        setCaptcha(generateCaptcha());
      }
    } else {
      setWrongAnswer(true);
      setLoadingIndicator(false);
      setUserInput("");
      setLoading(false);
      setCaptcha(generateCaptcha());
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        backgroundColor: colors.white,
        flex: 1,
        padding: 30,
        paddingTop: 0,
      }}
    >
      <BackNavigation />

      <View style={{ width: width < 500 ? "100%" : 450, alignSelf: "center" }}>
        <PageTitle text={"Forgot Password"} type={"fullpage"} />
        <View>
          <SmallSpace />

          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={[styles.sectionHeader]}>
              Account Instance -{" "}
              <TouchableOpacity
                onPress={() => navigation.push("LearnMoreInstance")}
              >
                <Text style={[styles.blueText]}>Learn More</Text>
              </TouchableOpacity>
            </Text>
          </View>
          {items?.length == 0 ? (
            <ActivityIndicator color={colors.blue} size={"large"} />
          ) : (
            <SelectList
              setSelected={(val) => setKey(val)}
              data={items}
              save="key"
              placeholder={key}
              notFoundText="Instance not found"
              closeicon={
                <Text style={[styles.xButtonText, { color: colors.grey }]}>
                  X
                </Text>
              }
              arrowicon={
                <IconChevronDown
                  size={20}
                  stroke={1.3}
                  color={colors.grey}
                  style={{ marginRight: 5 }}
                />
              }
              searchicon={
                <IconSearch
                  size={20}
                  stroke={1.3}
                  color={colors.grey}
                  style={{ marginRight: 5 }}
                />
              }
              boxStyles={styles.instanceBoxStyles}
              inputStyles={styles.instanceInputStyles}
              dropdownStyles={styles.instanceDropdownStyles}
              dropdownItemStyles={styles.instanceDropdownItemStyles}
              dropdownTextStyles={styles.instanceDropdownTextStyles}
            />
          )}
          <SmallSpace />

          <TextInput //EMAIL
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
            onKeyPress={(e) =>
              e.key == "Enter" &&
              email != "" &&
              email.includes("@") &&
              userInput != "" &&
              pressedSubmit()
            }
          />

          <SmallSpace />

          <View
            style={{
              flexDirection: "row",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  color: colors.black,
                  fontFamily: chosenFont_Regular,
                }}
              >
                {captcha}
              </Text>
            </View>
            <TextInput
              style={[
                styles.mainPage_TextInputContainer,
                {
                  height: 40,
                  width: 150,
                  borderRadius: 10,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  padding: 10,
                  alignSelf: "center",
                  borderWidth: 2,
                  borderColor: colors.greyShade2,
                },
              ]}
              color={colors.black}
              value={userInput}
              placeholder={"ANSWER"}
              placeholderTextColor={colors.greyShade3}
              selectionColor={colors.blueShade2}
              onChangeText={setUserInput}
              keyboardType="number-pad"
              onKeyPress={(e) =>
                e.key == "Enter" &&
                email != "" &&
                email.includes("@") &&
                userInput != "" &&
                pressedSubmit()
              }
            />
          </View>
          <SmallSpace />
          {sentReset && (
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
              If an account associated with email exists, reset instructions
              have been sent
            </Text>
          )}
          {email?.length > 0 && !email.includes("@") && (
            <Text
              style={{
                color: colors.red,
                fontStyle: "italic",
                fontFamily: chosenFont_Regular,
              }}
            >
              Please enter a valid email address
            </Text>
          )}
          {wrongAnswer && (
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
              Incorrect Captcha, please try again
            </Text>
          )}
          <SmallSpace />

          <View style={[styles.evenlySpacedRow]}>
            <GenericButton
              text={"RESET PASSWORD"}
              noText={false}
              disabled={
                !global ||
                !key ||
                email.trim().length == 0 ||
                !email.includes("@") ||
                userInput.trim().length == 0 ||
                loadingIndicator
              }
              includeBorder={false}
              textColor={
                !global ||
                !key ||
                email.trim().length == 0 ||
                !email.includes("@") ||
                userInput.trim().length == 0 ||
                loadingIndicator
                  ? colors.greyShade4
                  : "white"
              }
              cancelButton={false}
              background={
                !global ||
                !key ||
                email.trim().length == 0 ||
                !email.includes("@") ||
                userInput.trim().length == 0 ||
                loadingIndicator
                  ? colors.greyShade2
                  : colors.blueShade2
              }
              size={"large"}
              shadowColor={
                !global ||
                !key ||
                email.trim().length == 0 ||
                !email.includes("@") ||
                userInput.trim().length == 0 ||
                loadingIndicator
                  ? "transparent"
                  : colors.blueShade3
              }
              action={() => pressedSubmit()}
              includeIcon={false}
              loadingIndicator={loadingIndicator}
              icon={""}
            />
          </View>

          <SmallSpace />
          <Text
            style={{
              textAlign: "center",
              fontFamily: chosenFont_Regular,
              color: colors.greyShade4,
              fontSize: 15,
            }}
          >
            Don't have an account?{" "}
            <Pressable
              onHoverIn={() => setHoveredSignUp(true)}
              onHoverOut={() => setHoveredSignUp(false)}
            >
              <Text
                style={[
                  styles.blueText,
                  {
                    color: hoveredSignUp
                      ? colors.blueShade1
                      : colors.blueShade2,
                    fontFamily: chosenFont_ExtraBold,
                  },
                ]}
                onPress={() => navigation.push("Signup")}
              >
                Sign up
              </Text>
            </Pressable>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {
    reduxInstance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ForgotPasswordScreen);

export default withColorScheme(ConnectedComponent);