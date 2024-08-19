import { useEffect, useContext } from "react";
import { View, Platform } from "react-native";
import { StateContext } from "../../../StateContext";
import LeftBarList from "../../../sections/LeftBarList";
import AllOverlays from "../../../overlays/AllOverlays";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import HeaderSection from "../../../sections/HeaderSection";
import BlankBarSection from "../../../sections/BlankBarSection";
import SearchDropdownSection from "../components/SearchDropdownSection";
import PostsSectionSearch from "../components/PostsSectionSearch";
const SearchPage = ({ colors, sort, listing, route }) => {
  const {
    fetchSearchPosts,
    height,
    jwt,
    luckyResults,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    width,
  } = useContext(StateContext);

  //api search call
  useEffect(() => {
    fetchSearchPosts(decodeURIComponent(route.params.searchText));
  }, [route.params, jwt, sort, listing]);

  return (
    <View
      style={{
        flexGrow: 1,
        maxHeight: height,
        overflow: "hidden",
        backgroundColor: colors.white,
      }}
    >
      <AllOverlays />
      <HeaderSection searchValue={route.params.searchText} />
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
        <PostsSectionSearch
          searchValue={decodeURIComponent(route.params.searchText)}
        />
        <BlankBarSection />
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {
    sort: state.updateItem.reduxGlobal.sort,
    listing: state.updateItem.reduxGlobal.listing,
  };
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SearchPage);

export default withColorScheme(ConnectedComponent);
