import React, { useContext } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import SimpleFilterButton from "../../../components/SimpleFilterButton";

const WritePostOptions = ({ postOptions, setPostOptions }) => {
  const { width } = useContext(StateContext);

  return (
    <View
      style={{
        flexDirection: width > 300 && "row",
        alignItems: "center",
        width: "100%",
        justifyContent: "center",
        gap: 5,
      }}
    >
      <SimpleFilterButton
        viewOptions={postOptions}
        setViewOptions={setPostOptions}
        selectedOption={"Write"}
      />
      <SimpleFilterButton
        viewOptions={postOptions}
        setViewOptions={setPostOptions}
        selectedOption={"Image"}
      />
      <SimpleFilterButton
        viewOptions={postOptions}
        setViewOptions={setPostOptions}
        selectedOption={"Link"}
      />
    </View>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(WritePostOptions);

export default withColorScheme(ConnectedComponent);
