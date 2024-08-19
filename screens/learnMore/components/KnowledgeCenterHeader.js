import React, { useContext } from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import KnowledgeCenterLogo from "./KnowledgeCenterLogo";
import { StateContext } from "../../../StateContext";

const KnowledgeCenterHeader = ({ backdropColor, date, title, by, styles }) => {
  const { height, width } = useContext(StateContext);
  return (
    <View>
      <KnowledgeCenterLogo />
      <View
        style={{
          backgroundColor: backdropColor,
          height: height * 0.7,
          minHeight: 500,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            width: width < 700 ? "100%" : 700,
            alignSelf: "center",
            paddingHorizontal: 30,
          }}
        >
          <Text style={styles.infoPageSubTitleOne}>{date}</Text>
          <Text style={styles.infoPageTitle}>{title}</Text>
          <Text style={styles.infoPageSubTitleTwo}>{by}</Text>
        </View>
      </View>
    </View>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(KnowledgeCenterHeader);

export default withColorScheme(ConnectedComponent);
