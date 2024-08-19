import React, { useRef, useContext, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import ItemSeparator from "../../../items/components/ItemSeparator";
import { useEffect } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { useNavigation } from "@react-navigation/native";
import { extractWebsiteName, isImageUrl } from "../../../actions";
import { Octicons } from "@expo/vector-icons";

const SearchDropdown = ({ colors, styles, instance }) => {
  const {
    confirmedNsfw,
    randomTop5,
    search,
    searchText,
    setSearchDropdownHovering,
    setSearchIsFocused,
    setSearchText,
  } = useContext(StateContext);
  const navigation = useNavigation();

  const [dropdownCommunities, setDropdownCommunities] = useState(false);
  //############################################
  //               NAVIGATION                 //
  //############################################
  //function if NSFW Community (navigation)
  const navigateNSFWCommunity = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.community.name);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.community.actor_id)
    );
    navigation.push("NsfwWarningCommunity", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  //function if NSFW Post (navigation)
  const navigateNSFWPost = (item) => {
    const encodedPostInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("NsfwWarningPost", {
      post_id: item.post.id,
      post_instance: encodedPostInstance,
      post_name: encodedPostName,
    });
  };

  //function for community view (navigation)
  const navigateCommunityView = (item) => {
    const encodedCurrentInstance = encodeURIComponent(
      extractWebsiteName(instance)
    );
    const encodedCommunityName = encodeURIComponent(item.community.name);
    const encodedCommunityInstance = encodeURIComponent(
      extractWebsiteName(item.community.actor_id)
    );
    navigation.push("CommunityView", {
      currentInstance: encodedCurrentInstance,
      communityName: encodedCommunityName,
      communityInstance: encodedCommunityInstance,
    });
  };

  //function for comments (navigation)
  const navigateComments = (item) => {
    const encodedInstance = encodeURIComponent(extractWebsiteName(instance));
    const encodedPostName = encodeURIComponent(item.post.name);
    navigation.push("Comments", {
      post_id: item.post.id,
      post_instance: encodedInstance,
      post_name: encodedPostName,
    });
  };

  //press community
  function pressCommunity(item) {
    item?.community?.nsfw && !confirmedNsfw
      ? navigateNSFWCommunity(item)
      : navigateCommunityView(item);
  }

  //ref for the text input
  const textInputRef = useRef(null);

  //function to execute search
  const handleOnSubmitEditing = (item) => {
    // fetchSearchPosts(item.trim());
    textInputRef?.current?.blur();
    const encodedValue = encodeURIComponent(item.trim());
    navigation.push("SearchPage", {
      searchText: encodedValue,
    });
  };
  //############################################
  //              Flatlist Items              //
  //############################################
  //render top posts for flatlist
  const RenderSearchDropdown = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          onPress={() => (
            setSearchText(""),
            setSearchIsFocused(false),
            setSearchDropdownHovering(false),
            item?.post?.nsfw && !confirmedNsfw
              ? navigateNSFWPost(item)
              : navigateComments(item)
          )}
          style={{
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
            padding: 5,
            marginVertical: 3,
            paddingLeft: 10,
            borderRadius: 10,
            width: "100%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View style={{ width: "80%", gap: 5, paddingRight: 5 }}>
              <Text style={styles.trendingTodayTitle}>{item.post.name}</Text>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                {item.community.icon ? (
                  <Image
                    source={{ uri: item.community.icon }}
                    placeholder={{ uri: item.community.icon }}
                    style={[
                      styles.communityIcon,
                      {
                        backgroundColor: colors.greyShade1,
                        width: 20,
                        height: 20,
                      },
                    ]}
                  />
                ) : (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.greyShade1,
                      borderRadius: 100,
                      width: 20,
                      height: 20,
                      marginRight: 5,
                    }}
                  >
                    <Octicons
                      size={15}
                      name={"people"}
                      color={colors.greyShade3}
                    />
                  </View>
                )}
                <Text style={styles.trendingTodayCommunity}>
                  {item.community.title}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: "20%",
                justifyContent: "center",
              }}
            >
              {isImageUrl(item.post.thumbnail_url) && (
                <Image
                  resizeMode="cover"
                  source={{
                    uri: item.post.thumbnail_url,
                  }}
                  placeholder={{
                    uri: item.post.thumbnail_url,
                  }}
                  style={[
                    styles.largeImageThumbnail,
                    {
                      //borderRadius: width < 400 ? 20 : 0
                      borderRadius: 10,
                      marginVertical: 0,
                      marginBottom: 0,
                    },
                  ]}
                />
              )}
              {!isImageUrl(item.post.thumbnail_url) &&
                isImageUrl(item.post.url) && (
                  <Image
                    source={{
                      uri: item.post.url,
                    }}
                    placeholder={{
                      uri: item.post.url,
                    }}
                    resizeMode="cover"
                    style={[
                      styles.largeImageThumbnail,
                      {
                        //borderRadius: width < 400 ? 20 : 0
                        borderRadius: 10,
                        marginVertical: 0,
                        marginBottom: 0,
                      },
                    ]}
                  />
                )}
              {!isImageUrl(item.post.thumbnail_url) &&
                !isImageUrl(item.post.url) && (
                  <View
                    style={{
                      minHeight: 75,
                      height: "100%",
                      width: "100%",
                      borderRadius: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: colors.greyShade1,
                    }}
                  >
                    <Octicons
                      size={20}
                      name={"image"}
                      color={colors.greyShade3}
                    />
                  </View>
                )}
            </View>
          </View>
        </TouchableOpacity>
      </Pressable>
    );
  };
  const searchItem = ({ item }) => <RenderSearchDropdown item={item} />;

  //render top posts for flatlist
  const RenderSearchCommunityDropdown = ({ item }) => {
    const [hovered, setHovered] = useState(false);
    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          onPress={() => (
            pressCommunity(item),
            setSearchIsFocused(false),
            setSearchDropdownHovering(false)
          )}
          style={{
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
            padding: 5,
            marginVertical: 3,
            paddingLeft: 10,
            borderRadius: 10,
            width: "100%",
            gap: 5,
          }}
        >
          <View
            style={{
              width: "100%",
              gap: 3,
              flexDirection: "row",
              paddingRight: 5,
              alignItems: "center",
            }}
          >
            {item.community.nsfw && (
              <View //nsfw
                style={[
                  styles.nsfwContainer,
                  { marginLeft: 0, marginTop: 0, marginBottom: 0 },
                ]}
              >
                <Text style={styles.nsfwText}>NSFW</Text>
              </View>
            )}
            {item.community.icon ? (
              <Image
                source={{ uri: item.community.icon }}
                placeholder={{ uri: item.community.icon }}
                style={[
                  styles.communityIcon,
                  {
                    backgroundColor: colors.greyShade1,
                    width: 30,
                    height: 30,
                  },
                ]}
              />
            ) : (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: colors.greyShade1,
                  borderRadius: 100,
                  width: 30,
                  height: 30,
                  marginRight: 5,
                }}
              >
                <Octicons size={18} name={"people"} color={colors.greyShade3} />
              </View>
            )}
            {item.community.title ? (
              <Text style={styles.trendingTodayTitle}>
                {item.community.title}
              </Text>
            ) : (
              <Text style={styles.trendingTodayTitle}>
                {item.community.name}
              </Text>
            )}
          </View>
          <View>
            <Text style={styles.trendingTodayCommunity}>
              ({extractWebsiteName(item.community.actor_id)})
            </Text>
          </View>
        </TouchableOpacity>
      </Pressable>
    );
  };
  const searchCommunityItem = ({ item }) => (
    <RenderSearchCommunityDropdown item={item} />
  );

  //no recommended search
  const NoRecommendedSearch = () => {
    const [hovered, setHovered] = useState(false);

    return (
      <Pressable
        onHoverOut={() => setHovered(false)}
        onHoverIn={() => setHovered(true)}
      >
        <TouchableOpacity
          onPress={() => (
            handleOnSubmitEditing(searchText),
            setSearchText(""),
            setSearchIsFocused(false),
            setSearchDropdownHovering(false)
          )}
          style={{
            flexDirection: "row",
            padding: 5,
            gap: 5,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: hovered ? colors.greyShade1 : colors.white,
          }}
        >
          <Octicons
            size={23}
            name={"search"}
            color={colors.greyShade3}
            style={{ opacity: 0.7 }}
          />

          <Text style={styles.smallSectionTitles}>
            Search For: {searchText}
          </Text>
        </TouchableOpacity>
      </Pressable>
    );
  };

  //############################################
  //           Define API Functions           //
  //############################################

  //get searched posts from api
  const fetchSearchCommunities = async (item) => {
    try {
      const fetchedSearch = await search({
        type_: "Communities",
        sort: "TopAll",
        page: 1,
        listing_type: "All",
        q: item,
        limit: 5,
      });
      setDropdownCommunities(fetchedSearch.communities);
    } catch (e) {}
  };

  //run search communities as the input changes
  useEffect(() => {
    searchText?.trim().length > 0 && fetchSearchCommunities(searchText);
  }, [searchText]);
  return (
    <View>
      {searchText?.trim().length > 0 ? (
        dropdownCommunities?.length == 0 ? (
          <NoRecommendedSearch />
        ) : (
          <View //Top Communities
            style={{
              flexDirection: "row",
              padding: 5,
              gap: 5,
              alignItems: "center",
            }}
          >
            <Octicons
              size={23}
              name={"people"}
              color={colors.greyShade3}
              style={{ opacity: 0.7 }}
            />

            <Text style={styles.smallSectionTitles}>TOP COMMUNITIES</Text>
          </View>
        )
      ) : (
        <View //Trending Posts
          style={{
            flexDirection: "row",
            padding: 5,
            gap: 5,
            alignItems: "center",
          }}
        >
          <Octicons
            size={23}
            name={"graph"}
            color={colors.greyShade3}
            style={{ opacity: 0.7 }}
          />

          <Text style={styles.smallSectionTitles}>TRENDING TODAY</Text>
        </View>
      )}
      {searchText?.trim().length > 0 ? (
        <FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={true}
          data={dropdownCommunities}
          renderItem={(item) => searchCommunityItem(item)}
          keyExtractor={(item) => item.community?.id.toString()}
        />
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={ItemSeparator}
          scrollEnabled={true}
          data={randomTop5.slice(0, 5)}
          renderItem={(item) => searchItem(item)}
          keyExtractor={(item) => item.post?.id.toString()}
        />
      )}
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    listing: state.updateItem.reduxGlobal.listing,
    instance: state.updateItem.reduxGlobal.instance,
    fontSize: state.updateItem.reduxGlobal.fontSize,
  };
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SearchDropdown);

export default withColorScheme(ConnectedComponent);
