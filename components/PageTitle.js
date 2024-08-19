import React from "react";
import { View, Text } from "react-native";
import { connect } from "react-redux";
import { SmallSpace, Space } from "../constants";
import withColorScheme from "../styles/Formatting";

const PageTitle = ({ styles, text, type }) => {
  if (type == "fullpage") {
    return (
      <View>
        <View style={[styles.loginContainer]}>
          <View>
            <Space />
            <Space />
            <View>
              <Text style={styles.loginPageTitle}>{text}</Text>
            </View>
          </View>
        </View>
        <SmallSpace />
      </View>
    );
  } else {
    return (
      <View>
        <View>
          <View>
            <Space />
            <View>
              <Text style={[styles.loginPageTitle, { textAlign: "left" }]}>
                {text}
              </Text>
            </View>
          </View>
        </View>
        <SmallSpace />
      </View>
    );
  }
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(PageTitle);

export default withColorScheme(ConnectedComponent);
