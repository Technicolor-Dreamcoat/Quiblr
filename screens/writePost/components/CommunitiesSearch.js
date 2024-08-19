import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Pressable,
} from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { extractWebsiteName } from "../../../actions";
import { StateContext } from "../../../StateContext";

const CommunitiesSearch = ({
  colors,
  styles,
  listing,
  communityInput,
  setCommunityInput,
  setFullSelectedCommunity,
  setSelectedCommunity,
  selectedCommunity_imported,
}) => {
  const { listCommunities, search } = useContext(StateContext);
  const [communities, setCommunities] = useState([]);
  const [selection, setSelection] = useState(selectedCommunity_imported);
  const [focused, setFocused] = useState(false);

  //############################################
  //           Define API Functions           //
  //############################################

  useEffect(() => {
    focused && fetchCommunities();
  }, [focused]);

  useEffect(() => {
    !selection && fetchSearchPosts(communityInput);
    setSelection(false);
  }, [communityInput]);

  //initial api call for community data
  const fetchCommunities = async () => {
    try {
      const fetchedCommunities = await listCommunities({
        sort: "TopAll",
        limit: 5,
        type_: listing == "Local" ? "Local" : "All",
      });

      setCommunities((prevCommunities) => {
        const newCommunities = fetchedCommunities.communities;

        //remove duplicate communities
        return newCommunities.filter(
          (community, index, self) =>
            index ===
            self.findIndex((t) => t.community.id === community.community.id)
        );
      });
    } catch (e) {
      console.error();
    }
  };

  //get searched posts from api
  const fetchSearchPosts = async (item) => {
    try {
      const fetchedSearch = await search({
        type_: "Communities",
        sort: "TopAll",
        page: 1,
        listing_type: listing == "Local" ? "Local" : "All",
        q: item,
        limit: 5,
      });
      setCommunities(fetchedSearch.communities);
    } catch (e) {
    } finally {
    }
  };

  //############################################
  //           Render Flatlist Items          //
  //############################################

  //render All Communities item for flatlist
  const RenderAllCommunity = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => (
            setSelection(true),
            setFullSelectedCommunity(item.community.id),
            setSelectedCommunity(item),
            setCommunities(""),
            setCommunityInput(item.community.title)
          )}
          style={{
            backgroundColor: hovered ? colors.greyShade1 : colors.white,

            height: 30,
            padding: 5,
            paddingLeft: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Text numberOfLines={1} style={styles.communitiesPageList}>
                {item.community.title}
              </Text>
              <Text style={[styles.currentInstance, { fontSize: 13 }]}>
                ({extractWebsiteName(item.community.actor_id)})
              </Text>

              {item.community.nsfw && (
                <Text
                  style={{ color: colors.red, marginLeft: 5, fontSize: 11 }}
                >
                  NSFW
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Pressable>
    );
  };
  const renderAllCommunity = ({ item }) => <RenderAllCommunity item={item} />;

  return (
    <View>
      <View style={styles.spaceSmall} />
      <View>
        <TextInput //community Input
          style={[
            styles.mainPage_TextInputContainer,
            {
              width: "100%",
              backgroundColor:
                communities?.length > 0 ? colors.white : colors.greyShade1,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: communities?.length > 0 ? 0 : 10,
              borderBottomRightRadius: communities?.length > 0 ? 0 : 10,
              borderLeftWidth: 2,
              borderWidth: communities?.length > 0 ? 2 : 0,
              borderColor: colors.greyShade2,
              height: 50,
              paddingHorizontal: 15,
              paddingLeft: 15,

              color: colors.black,
            },
          ]}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          color={colors.black}
          placeholder="Select Community..."
          placeholderTextColor={colors.greyShade4}
          selectionColor={colors.blueShade2}
          onChangeText={setCommunityInput}
          value={communityInput}
          /* onKeyPress={(e) =>
            e.key == "Enter" &&
            communityInput.trim() != "" &&
            fetchSearchPosts(communityInput)
          } */
        />
        {communities?.length > 0 && !selection && (
          <TouchableOpacity
            onPress={() => (
              setCommunityInput(""),
              setFullSelectedCommunity(""),
              setSelectedCommunity(""),
              setCommunities("")
            )}
            style={[
              styles.xButtonContainer,
              {
                position: "absolute",
                zIndex: 2,
                top: 3,
                right: 5,
                backgroundColor: "transparent",
              },
            ]}
          >
            <Text style={styles.xButtonText}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      <View>
        {communities?.length > 0 && (
          <FlatList
            style={{
              borderWidth: 2,
              borderTopWidth: 0,
              borderColor: colors.greyShade2,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
            }}
            scrollEnabled={true}
            data={communities}
            renderItem={renderAllCommunity}
            keyExtractor={(item) => item.community?.id.toString()}
          />
        )}
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
    listing: state.updateItem.reduxGlobal.listing,
  };
};

// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(CommunitiesSearch);

export default withColorScheme(ConnectedComponent);
