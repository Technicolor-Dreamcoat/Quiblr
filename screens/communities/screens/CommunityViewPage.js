import { useContext } from "react";
import { View } from "react-native";
import { StateContext } from "../../../StateContext";
import LeftBarList from "../../../sections/LeftBarList";
import AllOverlays from "../../../overlays/AllOverlays";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import HeaderSection from "../../../sections/HeaderSection";
import BlankBarSection from "../../../sections/BlankBarSection";
import SearchDropdownSection from "../../search/components/SearchDropdownSection";
import PostsSectionCommunity from "../components/PostsSectionCommunity";

const CommunityViewPage = ({ colors, route }) => {
  const {
    fetchCommunity,
    height,
    luckyResults,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    width,
  } = useContext(StateContext);

  return (
    <View
      style={{
        overflow: "hidden",
        flexGrow: 1,
        maxHeight: height,
        backgroundColor: colors.white,
      }}
    >
      <AllOverlays />
      <HeaderSection
        searchValue={
          route.params.searchText
            ? decodeURIComponent(route.params.searchText)
            : route.params.searchText
        }
      />
      {(searchText?.trim().length > 0 || luckyResults?.length > 4) &&
        (searchIsFocused || searchDropdownHovering) &&
        width > 1000 && <SearchDropdownSection />}

      <View
        style={{
          flexDirection: "row",
          flex: 1,
        }}
      >
        <BlankBarSection />
        <LeftBarList />
        <PostsSectionCommunity
          communityName={decodeURIComponent(route.params.communityName)}
          currentInstance={decodeURIComponent(route.params.currentInstance)}
          route={route}
          updateCommunity={() =>
            fetchCommunity(
              "https://" + decodeURIComponent(route.params.currentInstance),
              decodeURIComponent(route.params.communityName) +
                "@" +
                decodeURIComponent(route.params.communityInstance)
            )
          }
        />
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(CommunityViewPage);

export default withColorScheme(ConnectedComponent);
