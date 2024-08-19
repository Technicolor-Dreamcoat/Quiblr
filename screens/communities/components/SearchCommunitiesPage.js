import React, { useState, useEffect, useRef, useContext } from "react";
import { View, TextInput, Text, Pressable } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { LemmyHttp } from "lemmy-js-client";

const SearchCommunitiesPage = ({
  colors,
  styles,
  setCommunityInput,
  communityInput,
  reduxInstance,
}) => {
  const {
    communityInputWithInstance,
    getFederatedInstances,
    searchPage,
    setCommunityInputWithInstance,
    setFollowPressedId,
    setQuickSearchCommunities,
    setSearchPage,
    width,
  } = useContext(StateContext);
  //set dimensions
  const [xButtonHovered, setXButtonHovered] = useState(false);
  const [items, setItems] = useState([]);
  const [key, setKey] = useState("");

  // Create a ref for the TextInput
  const textInputRef = useRef(null);

  //clear on open
  useEffect(() => {
    setCommunityInputWithInstance("");
  }, []);

  //run the search when input changes
  useEffect(() => {
    communityInputWithInstance.trim() &&
      fetchSearchCommunitiesWithInstance(communityInputWithInstance, 1, key);
  }, [communityInputWithInstance]);

  //change instance read only search page
  useEffect(() => {
    communityInputWithInstance.trim() &&
      fetchSearchCommunitiesWithInstance(
        communityInputWithInstance,
        searchPage,
        key
      );
  }, [searchPage]);

  const search = async (key, options) => {
    const newClient = new LemmyHttp(key, {
      mode: "no-cors",
    });
    if (!newClient) return null;
    const response = await newClient.search({ ...options });
    return response;
  };

  //get searched posts from api (search communities)
  const fetchSearchCommunitiesWithInstance = async (item, pageNumber, key) => {
    try {
      const fetchedSearch = await search(key, {
        type_: "Communities",
        sort: "TopAll",
        page: pageNumber,
        listing_type: "Local",
        q: item,
        limit: 5,
      });
      setQuickSearchCommunities(fetchedSearch.communities);

      setFollowPressedId("");
    } catch (e) {
      // console.log(e);
    } finally {
    }
  };

  //update the community search input view
  useEffect(() => {
    communityInput && textInputRef.current.focus();
    setXButtonHovered(false); //prevent hover style when typing
  }, [communityInput]);

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

  return (
    <View style={{ width: width < 625 ? "100%" : "50%" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TextInput //community Input
          ref={textInputRef}
          style={[
            styles.mainPage_TextInputContainer,
            {
              width: "100%",
              borderWidth: 1,
              backgroundColor: colors.white,
              borderColor: colors.lightGreyShade4,
              borderRadius: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              height: 50,
              paddingHorizontal: 15,
              paddingRight: 45,
              paddingLeft: 15,
              borderWidth: 2,
              borderColor: colors.greyShade2,
              color: colors.black,
            },
          ]}
          color={colors.black}
          placeholder="Search Communities..."
          placeholderTextColor={colors.greyShade4}
          selectionColor={colors.blueShade2}
          onChangeText={key ? setCommunityInputWithInstance : setCommunityInput}
          value={key ? communityInputWithInstance : communityInput}
          /* onKeyPress={(e) =>
          e.key == "Enter" &&
          communityInput.trim() != "" &&
          fetchSearchPosts(communityInput)
        } */
        />
        {communityInput && (
          <Pressable
            onHoverIn={() => setXButtonHovered(true)}
            onHoverOut={() => setXButtonHovered(false)}
            onPress={() => (
              setCommunityInput(""), setCommunityInputWithInstance("")
            )}
            style={[
              styles.xButtonContainer,
              {
                marginLeft: -45,
                backgroundColor: xButtonHovered && colors.greyShade1,
                borderWidth: 2,
                borderColor: xButtonHovered ? colors.greyShade2 : "transparent",
              },
            ]}
          >
            <Text style={styles.xButtonText}>X</Text>
          </Pressable>
        )}
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
const ConnectedComponent = connect(mapStateToProps)(SearchCommunitiesPage);

export default withColorScheme(ConnectedComponent);
