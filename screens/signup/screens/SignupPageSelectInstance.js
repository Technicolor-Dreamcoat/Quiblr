import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Pressable,
  FlatList,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { extractWebsiteName } from "../../../actions";
import { SmallSpace, Space } from "../../../constants";
import { StateContext } from "../../../StateContext";
import { LemmyHttp } from "lemmy-js-client";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AlreadyHaveAnAccount from "../components/AlreadyHaveAnAccount";
import PageTitle from "../../../components/PageTitle";
import GenericButton from "../../../components/GenericButton";
import BackNavigation from "../../../components/BackNavigation";
const SignupPageSelectInstance = ({
  colors,
  styles,
  reduxInstance,
  fontSize,
  showScrollBars,
}) => {
  const { chosenFont_Regular, chosenFont_SuperBold, height, width } =
    useContext(StateContext);
  const navigation = useNavigation();

  const [loadingPopular, setLoadingPopular] = useState(false);
  const [loadingRegional, setLoadingRegional] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);
  const [loadingTech, setLoadingTech] = useState(false);

  const [items, setItems] = useState([]);
  const [searchInstances, setSearchInstances] = useState("");
  const [instanceGroups, setInstanceGroups] = useState([
    "Popular",
    "Regional",
    "Games",
    "Tech",
    // "All",
  ]); //Data for Instance Filter List
  const [selectedInstanceFilter, setSelectedInstanceFilter] = useState();
  const [selectedGroup, setSelectedGroup] = useState(backupInstances);
  const [popularInstances, setPopularInstances] = useState();
  const [regionalInstances, setRegionalInstances] = useState();
  const [gamesInstances, setGamesInstances] = useState();
  const [techInstances, setTechInstances] = useState();

  //############################################
  //               NAVIGATION                 //
  //############################################
  //function for Signup Application (navigation)
  const navigateSignupApplication = (item) => {
    const encodedSelectedInstance = encodeURIComponent(
      extractWebsiteName(item.key)
    );
    navigation.push("SignupApplication", {
      selected_instance: encodedSelectedInstance,
    });
  };

  //backup instances
  const backupInstances = [
    { key: "https://lemmy.world", domain: "lemmy.world" },
    { key: "https://beehaw.org", domain: "beehaw.org" },
    { key: "https://lemmy.ca", domain: "lemmy.ca" },
    { key: "https://lemmy.ml", domain: "lemmy.ml" },
    { key: "https://sh.itjust.works", domain: "sh.itjust.works" },
    { key: "https://lemm.ee", domain: "lemm.ee" },
    { key: "https://lemmy.dbzer0.com", domain: "lemmy.dbzer0.com" },
    { key: "https://discuss.tchncs.de", domain: "discuss.tchncs.de" },
    { key: "https://discuss.online", domain: "discuss.online" },
    { key: "https://sopuli.xyz", domain: "sopuli.xyz" },
    { key: "https://reddthat.com", domain: "reddthat.com" },
    { key: "https://lemmy.dbzer0.com", domain: "lemmy.dbzer0.com" },
    { key: "https://programming.dev", domain: "programming.dev" },
    { key: "https://lemmy.blahaj.zone", domain: "lemmy.blahaj.zone" },
    { key: "https://lemmynsfw.com", domain: "lemmynsfw.com" },
  ];

  //popular instances
  const popularInstancesList = [
    "lemmy.world",
    "sh.itjust.works",
    "beehaw.org",
    "lemmy.ml",
    "lemm.ee",
    "lemmygrad.ml",
    "lemmynsfw.com",
  ];
  //regional instances
  const regionalInstancesList = [
    // "feddit.de",
    // "feddit.cl",
    "lemmy.ca",
    "midwest.social",
    "feddit.uk",
    "aussie.zone",
    "feddit.nl",
    "feddit.it",
    "baraza.africa",
    "lemmy.eus",
  ];

  //games instances
  const gamesInstancesList = [
    "ttrpg.network",
    "dormi.zone",
    "mtgzone.com",
    "fanaticus.social",
    "eviltoast.org",
    "preserve.games",
    "derpzilla.net",
  ];
  //tech instances
  const techInstancesList = [
    "lemmy.dbzer0.com",
    "programming.dev",
    "discuss.tchncs.de",
    "lemmy.kde.social",
    "lemmy.sdf.org",
    "infosec.pub",
    "lemdro.id",
  ];

  async function getInstanceDetail(instanceList, stateToSave) {
    try {
      const promises = instanceList.map(async (item) => {
        const newClient = new LemmyHttp(`https://${item}`, {
          mode: "no-cors",
        });
        if (!newClient) return null;

        const response = await newClient.getSite({});
        return {
          domain: extractWebsiteName(response?.site_view?.site?.actor_id),
          key: response?.site_view?.site?.actor_id,
          icon: response?.site_view?.site?.icon,
          description: response?.site_view?.site?.description,
        };
      });

      const results = await Promise.all(promises);
      const filteredResults = results.filter((result) => result !== null);
      stateToSave(filteredResults);
    } catch (e) {
    } finally {
    }
  }
  //first get instance detail for popular instances
  const firstLoadPopularInstances = async () => {
    setLoadingPopular(true);
    try {
      await getInstanceDetail(popularInstancesList, setPopularInstances);
      // await fetchInstances(); //get all instances
      setSelectedInstanceFilter("Popular");
      setLoadingPopular(false);
    } catch {
      //if failed to fetch, use backup popular instances
      setSelectedInstanceFilter("Popular");
      setItems(backupInstances);
      setLoadingPopular(false);
    }
  };
  //load regional instances
  const loadRegionalInstances = async () => {
    setLoadingRegional(true);
    try {
      await getInstanceDetail(regionalInstancesList, setRegionalInstances);
      setLoadingRegional(false);
    } catch {}
  };

  //load games instances
  const loadGamesInstances = async () => {
    setLoadingGames(true);
    try {
      await getInstanceDetail(gamesInstancesList, setGamesInstances);
      setLoadingGames(false);
    } catch {}
  };

  //load tech instances
  const loadTechInstances = async () => {
    setLoadingTech(true);
    try {
      await getInstanceDetail(techInstancesList, setTechInstances);
      setLoadingTech(false);
    } catch {}
  };

  //get instance detail on open
  useEffect(() => {
    firstLoadPopularInstances();
    loadRegionalInstances();
    loadGamesInstances();
    loadTechInstances();
  }, []);

  //map filters to the relevant instances
  const filterMap = {
    Popular: popularInstances,
    Regional: regionalInstances,
    Games: gamesInstances,
    Tech: techInstances,
    All: items,
  };

  //run on change of filter
  useEffect(() => {
    setSelectedGroup(filterMap[selectedInstanceFilter]);
  }, [selectedInstanceFilter]);

  //Groups of Instances Filter Item
  const InstanceFilter = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          disabled={
            (item == "Regional" && loadingRegional) ||
            (item == "Games" && loadingGames) ||
            (item == "Tech" && loadingTech)
          }
          onPress={() => setSelectedInstanceFilter(item)}
          style={[
            styles.filterButtonSmall,
            {
              minWidth: 50,
              borderRadius: 100,
              backgroundColor:
                selectedInstanceFilter == item
                  ? colors.lightBlue
                  : colors.greyShade1,
              borderWidth: 2,
              borderColor:
                selectedInstanceFilter == item
                  ? colors.blueShade2
                  : hovered
                  ? colors.greyShade2
                  : colors.greyShade1,
              paddingHorizontal: 10,
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          {item == "Popular" ? (
            loadingPopular ? (
              <ActivityIndicator color={colors.greyShade2} />
            ) : (
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      selectedInstanceFilter == item
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                {item}
              </Text>
            )
          ) : item == "Regional" ? (
            loadingRegional ? (
              <ActivityIndicator color={colors.greyShade2} />
            ) : (
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      selectedInstanceFilter == item
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                {item}
              </Text>
            )
          ) : item == "Games" ? (
            loadingGames ? (
              <ActivityIndicator color={colors.greyShade2} />
            ) : (
              <Text
                style={[
                  styles.filterButtonTitle,
                  {
                    color:
                      selectedInstanceFilter == item
                        ? colors.blueShade2
                        : colors.greyShade3,
                  },
                ]}
              >
                {item}
              </Text>
            )
          ) : item == "Tech" && loadingTech ? (
            <ActivityIndicator color={colors.greyShade2} />
          ) : (
            <Text
              style={[
                styles.filterButtonTitle,
                {
                  color:
                    selectedInstanceFilter == item
                      ? colors.blueShade2
                      : colors.greyShade3,
                },
              ]}
            >
              {item}
            </Text>
          )}
        </TouchableOpacity>
      </Pressable>
    );
  };
  const instanceFilter = ({ item }) => <InstanceFilter item={item} />;

  //clean up domain names by removing ending slash
  function removeLastSlash(str) {
    if (str.endsWith("/")) {
      return str.slice(0, -1);
    }
    return str;
  }

  //Instance Items for selection in list
  const IntanceItems = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          disabled={filteredData?.length == 0}
          onPress={() => navigateSignupApplication(item)}
          style={{
            backgroundColor: colors.white,
            marginVertical: 5,
            borderWidth: 2,
            borderColor:
              item.key == "No Search Results"
                ? colors.greyShade2
                : hovered
                ? colors.greyShade3
                : colors.greyShade2,
            borderRadius: 15,
            padding: 15,
            minHeight: 75,
            paddingVertical: 10,
            gap: 5,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            {item?.icon && (
              <Image
                source={{ uri: item?.icon }}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 5,
                  backgroundColor: colors.greyShade1,
                }}
              />
            )}
          </View>
          <View style={{ width: item?.icon ? "80%" : "90%", gap: 5 }}>
            <Text
              style={{
                color: colors.greyShade4,
                fontFamily: chosenFont_SuperBold,
                fontSize: 15 + fontSize,
              }}
              numberOfLines={1}
            >
              {removeLastSlash(item.domain)}
            </Text>
            <Text
              style={{
                color: colors.greyShade4,
                fontFamily: chosenFont_Regular,
                fontSize: 12 + fontSize,
              }}
              numberOfLines={3}
            >
              {item.description}
            </Text>
          </View>
          <View style={{ justifyContent: "center" }}>
            <Text
              style={{
                color: colors.greyShade2,
                fontFamily: chosenFont_SuperBold,
                fontSize: 20,
              }}
            >
              +
            </Text>
          </View>
        </TouchableOpacity>
      </Pressable>
    );
  };
  const intanceItems = ({ item }) => <IntanceItems item={item} />;

  // Function to filter the array based on the input text
  const filteredData = selectedGroup?.filter((item) =>
    item?.key?.toLowerCase()?.includes(searchInstances?.toLowerCase())
  );

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
        <View //Instance Info
        >
          <PageTitle text={"Sign Up - Select Instance"} type={"fullpage"} />
          <View
            style={{ width: width < 500 ? "100%" : 450, alignSelf: "center" }}
          >
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
            <View //search
              style={{
                flexDirection: "row",
                width: "100%",
                alignItems: "center",
                height: 50,
                justifyContent: loadingPopular && "center",
                paddingLeft: 10,
                borderWidth: 2,
                borderColor: colors.greyShade2,
                borderRadius: 10,
                backgroundColor: colors.white,
              }}
            >
              {loadingPopular && (
                <ActivityIndicator color={colors.blueShade2} />
              )}
              {!loadingPopular && (
                <FontAwesome5
                  name={"search"}
                  size={20}
                  color={colors.greyShade3}
                />
              )}
              {!loadingPopular && (
                <TextInput //Search
                  style={[
                    styles.mainPage_TextInputContainer,
                    {
                      //width: width < 800 ? 200 : width > 1000 ? 400 : 200,
                      height: 50,
                      width: "95%",
                      borderTopWidth: 0,
                      borderRightWidth: 0,
                      borderBottomWidth: 0,
                      backgroundColor: "tranparent",
                      paddingRight: 45,
                    },
                  ]}
                  color={colors.black}
                  autoComplete={"off"}
                  autoCorrect={"false"}
                  autoCapitalize={"none"}
                  placeholder={extractWebsiteName(reduxInstance)}
                  placeholderTextColor={colors.greyShade3}
                  selectionColor={colors.blueShade2}
                  onChangeText={setSearchInstances}
                  value={searchInstances}
                />
              )}
              {searchInstances && (
                <Pressable
                  onPress={() => setSearchInstances("")}
                  style={[
                    styles.xButtonContainer,
                    {
                      marginLeft: -45,
                      borderWidth: 2,
                      width: 30,
                      height: 30,
                      borderColor: "transparent",
                    },
                  ]}
                >
                  <Text style={[styles.xButtonText, { fontSize: 20 }]}>X</Text>
                </Pressable>
              )}
            </View>
            <SmallSpace />
            {!loadingPopular && (
              <FlatList
                showsHorizontalScrollIndicator={false}
                style={styles.fullWidth}
                contentContainerStyle={{ gap: 5 }}
                horizontal
                data={instanceGroups}
                keyExtractor={(item) => item}
                renderItem={(item) => instanceFilter(item)}
                extraData={[selectedInstanceFilter, instanceGroups]}
              />
            )}
          </View>
          <SmallSpace />
          {!loadingPopular && (
            <View
              style={{
                flex: 1,
                width: width < 500 ? "100%" : 450,
                backgroundColor: colors.greyShade1,
                borderWidth: 2,
                borderColor: colors.greyShade2,
                borderRadius: 15,
                alignSelf: "center",
              }}
            >
              <FlatList
                initialNumToRender={10}
                data={
                  filteredData?.length == 0
                    ? [
                        {
                          key: "No Search Results",
                          domain: "No Search Results",
                        },
                      ]
                    : filteredData
                }
                keyExtractor={(item) => item.key}
                renderItem={(item) => intanceItems(item)}
                extraData={[
                  filteredData,
                  reduxInstance,
                  selectedInstanceFilter,
                ]}
                contentContainerStyle={styles.smallMediumPadding}
              />
            </View>
          )}
          <SmallSpace />
          <View
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
              action={() => navigation.push("Signup")}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          </View>
          <SmallSpace />
          <AlreadyHaveAnAccount />
          <Space />
        </View>
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
const ConnectedComponent = connect(mapStateToProps)(SignupPageSelectInstance);

export default withColorScheme(ConnectedComponent);
