import { useState, useEffect, useContext } from "react";
import { View, Pressable } from "react-native";
import { StateContext } from "../../../StateContext";
import SearchDropdown from "./SearchDropdown";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";

const SearchDropdownSection = ({ colors }) => {
  const {
    blankBarWidth,
    centerPanelPadding,
    headerHeight,
    searchText,
    setSearchDropdownHovering,
    randomTop5,
    width,
  } = useContext(StateContext);

  const [xButtonHovered, setXButtonHovered] = useState(false);

  //############################################
  //             Animation & Design           //
  //############################################

  useEffect(() => {
    setXButtonHovered(false); //prevent hover style when typing
  }, [searchText]);

  //############################################
  //                  Render                  //
  //############################################
  return (
    <Pressable //search dropdown
      onHoverIn={() => setSearchDropdownHovering(true)}
      onHoverOut={() => setSearchDropdownHovering(false)}
      style={{
        position: "absolute",
        top: headerHeight + 10,
        left: 0,
        width: width > 1000 ? width - 30 : width,
        zIndex: 100,
        height: 100,
        paddingLeft: width <= 1000 ? 10 : 220,
      }}
    >
      <View //search bars
        style={{
          flex: 1,
          marginLeft:
            width <= 1000
              ? 10
              : centerPanelPadding + width * blankBarWidth + 34,
        }}
      >
        {randomTop5?.length > 4 && (
          <View
            style={{
              width: width <= 1000 ? "100%" : "45.4%",
              padding: 5,
              maxWidth:
                width <= 600
                  ? width * 0.9
                  : width <= 1000
                  ? width * 0.5
                  : width * 0.355,
              backgroundColor: colors.white,
              borderRadius: 15,
              shadowColor: "black",
              shadowOpacity: 0.2,
              shadowRadius: 30,
              shadowOffset: {
                height: 0,
                width: 0,
              },
            }}
          >
            <SearchDropdown />
          </View>
        )}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 25,
            marginTop: -13,
            borderTopWidth: 10,
            borderTopColor: "transparent",
            borderBottomWidth: 10,
            borderBottomColor: "transparent",
            borderLeftWidth: 10,
            borderLeftColor: colors.white,
            transform: [{ rotate: "270deg" }],
          }}
        />
      </View>
    </Pressable>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(SearchDropdownSection);

export default withColorScheme(ConnectedComponent);
