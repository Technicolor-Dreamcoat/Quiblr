import React, { useContext } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { SelectList } from "react-native-dropdown-select-list";
import { SmallSpace, Space } from "../../../constants";
import { StateContext } from "../../../StateContext";
import { useNavigation } from "@react-navigation/native";
import PageTitle from "../../../components/PageTitle";
import GenericButton from "../../../components/GenericButton";
import BackNavigation from "../../../components/BackNavigation";

const InstancePage = ({ colors, styles, reduxInstance }) => {
  const {
    changeInstance,
    getFederatedInstances,
    global,
    IconChevronDown,
    IconSearch,
    width,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [loadingIndicator, setLoadingIndicator] = useState(false);
  const [items, setItems] = useState([]);
  const [key, setKey] = useState("");

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
        //remove the current instance
        const filteredArray = combinedArray.filter(
          (item) => item.key !== reduxInstance
        );

        //save domains list to state
        setItems(filteredArray);
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

  //function to change instance
  const instances = async (key) => {
    setLoadingIndicator(true);
    try {
      //show loading
      changeInstance(key),
        setTimeout(() => {
          setLoadingIndicator(false);
        }, 3000);
    } catch (e) {
      alert(e);
      setLoadingIndicator(false);
      setItems(popularInstances.filter((item) => item.key !== reduxInstance));
    } finally {
    }
  };

  //select instance function
  const selectInstance = async () => {
    if (key != reduxInstance) {
      try {
        await instances(key);
        navigation.push("Quiblr");
      } catch (e) {
        alert(e);
      }
    } else {
      alert("You're already connected to " + reduxInstance);
      setLoadingIndicator(false);
    }
  };

  return (
    <View
      style={{
        backgroundColor: colors.white,
        height: "100%",
        padding: 30,
        paddingTop: 0,
      }}
    >
      <BackNavigation />
      <View style={{ width: width < 500 ? "100%" : 450, alignSelf: "center" }}>
        <View //header
          style={[styles.loginContainer]}
        >
          <View>
            <PageTitle text={"Instance"} type={"fullpage"} />
          </View>
        </View>
        <View
          style={{
            width: width < 900 ? "100%" : "100%",
          }}
        >
          <SmallSpace />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.currentInstance, { textAlign: "center" }]}>
              You are currently connected to {reduxInstance}
            </Text>
          </View>

          <Space />
          <View>
            <Text style={styles.sectionHeader}>Instance</Text>
            {items?.length == 0 ? (
              <ActivityIndicator color={colors.blueShade2} />
            ) : (
              <SelectList
                setSelected={(val) => setKey(val)}
                data={items}
                save="key"
                placeholder="Select Instance"
                notFoundText="Instance not found"
                closeicon={
                  <Text
                    style={[styles.xButtonText, { color: colors.greyShade3 }]}
                  >
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
          </View>

          <Text style={styles.sectionDescription}>
            The instance is the name of the server to join. To learn more about
            instances,{" "}
            <Text
              style={styles.blueText}
              onPress={() => navigation.push("LearnMoreInstance")}
            >
              see here...
            </Text>
          </Text>
          <SmallSpace />

          <View style={[styles.evenlySpacedRow]}>
            <GenericButton
              text={"CONTINUE"}
              noText={false}
              disabled={!global || !key}
              includeBorder={false}
              textColor={!key ? colors.greyShade3 : "white"}
              cancelButton={false}
              background={!key ? colors.greyShade2 : colors.blueShade2}
              size={"large"}
              shadowColor={!key ? "transparent" : colors.blueShade3}
              action={() => selectInstance()}
              includeIcon={false}
              icon={""}
              loadingIndicator={false}
            />
          </View>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    reduxInstance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(InstancePage);

export default withColorScheme(ConnectedComponent);
