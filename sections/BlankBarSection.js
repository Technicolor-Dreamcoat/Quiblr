import { useContext } from "react";
import { View } from "react-native";
import { StateContext } from "../StateContext";
import { connect } from "react-redux";
import withColorScheme from "../styles/Formatting";

const BlankBarSection = ({}) => {
  const { blankBarWidth, width } = useContext(StateContext);

  //############################################
  //                  Render                  //
  //############################################
  return (
    <View
      style={{
        height: "100%",
        width: width * blankBarWidth,
      }}
    />
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect your component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(BlankBarSection);

export default withColorScheme(ConnectedComponent);
