import React, { useContext } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { useState } from "react";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { Space, LargeSpace } from "../../../constants";
import { StateContext } from "../../../StateContext";
import { externalURL } from "../../../actions";
import KnowledgeCenterHeader from "../components/KnowledgeCenterHeader";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import GenericButton from "../../../components/GenericButton";

const InstanceLearnMorePage = ({ colors, styles }) => {
  const { chosenFont_ExtraBold, width } = useContext(StateContext);
  const navigation = useNavigation();

  const [canGoBack, setCanGoBack] = useState(false);

  // Listen to navigation events to update the state
  useFocusEffect(
    React.useCallback(() => {
      setCanGoBack(navigation.canGoBack());
    }, [navigation])
  );

  const handleGoBack = () => {
    if (canGoBack) {
      navigation.goBack();
    } else {
      navigation.push("Quiblr");
    }
  };

  return (
    <ScrollView style={{ backgroundColor: colors.white }}>
      <KnowledgeCenterHeader
        backdropColor={colors.blueShade2}
        date={"APRIL 06, 2024"}
        title={"The Fediverse and YOU!"}
        by={"By Quiblr"}
      />

      <View style={{ width: width < 700 ? "100%" : 700, alignSelf: "center" }}>
        <LargeSpace />

        <View
          style={[
            styles.backgroundColor,
            ,
            {
              height: 55,
              paddingHorizontal: 15,
            },
          ]}
        >
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            Instances are the servers in the Fediverse that host all the
            accounts and posts. You pick which Instance your account lives on.
            Each one has its own rules and moderation standards, but these
            servers interact so (if you want) you can still see content from
            users on other Instances. Learn more below:
          </Text>
          <View
            style={{
              width: "100%",
              height: width < 450 ? 200 : 250,
              paddingTop: 10,
              backgroundColor: colors.white,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
          >
            <Image
              source={require("../../../assets/Quiblr Instance Graphic.png")}
              style={{
                height: 300,
                width: "100%",
                resizeMode: "contain",
                // aspectRatio: 1,
              }}
            />
          </View>
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              🌐 What is the Fediverse:{" "}
            </Text>
            The fediverse is a network of independently operated (decentralized)
            servers which can interact with each other (federate). As noted
            above, each of these servers is referred to as an "Instance". Every
            Instance can set its own community standards and content moderation
            policies. This allows people to have the freedom to choose spaces
            that align with their values. Users can pick which Instance they
            choose on which to browse, post, and create accounts.
          </Text>
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              🤝 Do all Instances interact:{" "}
            </Text>
            No. Instances may decide to cut off contact (defederate) from each
            other. For example, if a certain Instance contains high volumes of
            toxic content, then that Instance may be cutoff from others within
            the Fediverse. If Instances defederate from each other, their users
            cannot interact.
          </Text>
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              🔍 Why does this matter:{" "}
            </Text>
            Instances operating independently gives users greater control over
            their privacy, online identity, and the content they encounter.
            Additionally, the fediverse allows for more diverse apps, content,
            and users to all interact within the same network!
          </Text>

          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            <Text
              style={[styles.commonText, { fontFamily: chosenFont_ExtraBold }]}
            >
              🧒 Explain Like I'm 5:{" "}
            </Text>
            The fediverse operates much like a telephone system. The same way
            different phones (regardless of make, model, or provider) can still
            call each other, in the fediverse, users can interact across
            different social platforms. This removes the silos that confine
            content and users to any single platform!
          </Text>
          <Space />

          <View
            style={{
              width: 100,
              height: 3,
              backgroundColor: colors.greyShade2,
              alignSelf: "center",
            }}
          />
          <Space />
          <Text style={[styles.commonText, { lineHeight: 30 }]}>
            In summary, the Instance you choose determines where your account
            lives and how content is moderated. All of the collective Instances
            interact together so users can connect within a single network!
          </Text>
          <Space />
          <TouchableOpacity
            onPress={() => externalURL("https://join-lemmy.org/instances")}
          >
            <Text style={styles.blueText}>
              Learn more about different Instances
            </Text>
          </TouchableOpacity>
          <Space />
          <View style={[styles.preventTouchableRow, { alignSelf: "center" }]}>
            <GenericButton
              text={"CLOSE"}
              noText={false}
              disabled={false}
              includeBorder={true}
              textColor={colors.greyShade3}
              cancelButton={false}
              background={colors.white}
              size={"large"}
              shadowColor={colors.greyShade3}
              action={() => handleGoBack()}
              includeIcon={false}
              icon={"pencil"}
              loadingIndicator={false}
              tall={true}
            />
          </View>
          <LargeSpace />
        </View>
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(InstanceLearnMorePage);

export default withColorScheme(ConnectedComponent);
