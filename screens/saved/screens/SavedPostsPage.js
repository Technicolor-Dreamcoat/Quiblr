import { useEffect, useContext } from "react";
import { View, Platform } from "react-native";
import { StateContext } from "../../../StateContext";
import SearchDropdownSection from "../../search/components/SearchDropdownSection";
import LeftBarList from "../../../sections/LeftBarList";
import AllOverlays from "../../../overlays/AllOverlays";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import HeaderSection from "../../../sections/HeaderSection";
import BlankBarSection from "../../../sections/BlankBarSection";
import SavedPostsSection from "../components/SavedPostsSection";
const SavedPostsPage = ({ colors, sort, listing }) => {
  const {
    fetchSavedPosts,
    height,
    luckyResults,
    searchDropdownHovering,
    searchIsFocused,
    searchText,
    width,
    jwt,
  } = useContext(StateContext);

  //   api search call
  useEffect(() => {
    fetchSavedPosts();
  }, [jwt, listing, sort]);

  //############################################
  //                  Render                  //
  //############################################
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
      <HeaderSection />
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
        <LeftBarList active={"Saved"} />
        <SavedPostsSection />
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
const ConnectedComponent = connect(mapStateToProps)(SavedPostsPage);

export default withColorScheme(ConnectedComponent);
