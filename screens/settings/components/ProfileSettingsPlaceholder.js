import React, { useContext } from "react";
import { View, Text, ScrollView } from "react-native";
import { connect } from "react-redux";
import withColorScheme from "../../../styles/Formatting";
import { StateContext } from "../../../StateContext";
import { SmallSpace, Space } from "../../../constants";
import { Skeleton } from "react-native-skeletons";

const ProfileSettingsPlaceholder = ({ colors, styles }) => {
  const { width } = useContext(StateContext);

  return (
    <ScrollView scrollEnabled={false}>
      <View //header
        style={[styles.loginContainer]}
      >
        <View>
          <View //header title
          >
            <View style={{ paddingTop: 30 }} />
            <Space />
            <Text style={styles.loginPageTitle}>Profile settings</Text>
          </View>
        </View>
      </View>
      <View>
        <Space />
        <View //banner & avatar
          style={{
            width: "100%",
            height: 200,
            borderRadius: 10,
            overflow: "hidden",
            borderWidth: 2,
            borderColor: colors.greyShade2,
          }}
        >
          <View //banner empty
            style={{
              width: "100%",
              height: "70%",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.greyShade2,
            }}
          >
            <Skeleton
              color={colors.greyShade2}
              width={"100%"}
              height={"100%"}
            />
          </View>

          <View
            style={{
              // opacity: 0.85,
              position: "absolute",
              left: 15,
              top: 15,
              borderRadius: 100,
              shadowColor: "black",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: {
                height: 5,
                width: 0,
              },
            }}
          >
            <Skeleton
              color={colors.greyShade2}
              borderRadius={100}
              width={100}
              height={30}
            />
          </View>
          <View
            style={{
              backgroundColor: colors.greyShade1,
              borderRadius: 100,
              width: 80,
              height: 80,
              marginTop: -40,
              alignSelf: "center",
              borderWidth: 6,
              borderColor: colors.white,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Skeleton
              color={colors.greyShade1}
              borderRadius={100}
              width={"100%"}
              height={"100%"}
            />
          </View>

          <View
            style={{
              opacity: 0.85,
              position: "absolute",
              left: 15,
              bottom: 15,
              borderRadius: 100,
              shadowColor: "black",
              shadowOpacity: 0.15,
              shadowRadius: 10,
              shadowOffset: {
                height: 5,
                width: 0,
              },
            }}
          >
            <Skeleton
              color={colors.greyShade2}
              borderRadius={100}
              width={90}
              height={30}
            />
          </View>
        </View>
        <SmallSpace />
        <Text style={styles.sectionHeader}>Display name</Text>
        <Skeleton
          color={colors.greyShade1}
          borderRadius={10}
          width={"100%"}
          height={50}
          style={{ borderWidth: 2, borderColor: colors.greyShade2 }}
        />
        <SmallSpace />
        <Text style={styles.sectionHeader}>Bio</Text>
        <Skeleton
          color={colors.greyShade1}
          borderRadius={10}
          width={"100%"}
          height={80}
          style={{ borderWidth: 2, borderColor: colors.greyShade2 }}
        />
        <SmallSpace />
        <Text style={styles.sectionHeader}>Email</Text>
        <Skeleton
          color={colors.greyShade1}
          borderRadius={10}
          width={"100%"}
          height={50}
          style={{ borderWidth: 2, borderColor: colors.greyShade2 }}
        />
        <SmallSpace />

        <View //Blur NSFW
          style={[
            styles.spreadCenteredRow,
            {
              flex: 1,
              //borderBottomWidth: 1,
              borderColor: colors.lightGreyShade4,
              height: "100%",
              paddingRight: 10,
            },
          ]}
        >
          <Text style={styles.boldText}>Blur NSFW</Text>
          <Skeleton
            color={colors.greyShade2}
            borderRadius={100}
            width={60}
            height={30}
            style={[styles.skeletonLeftMargin]}
          />
        </View>
        <SmallSpace />

        <View //Show NSFW
          style={[
            styles.spreadCenteredRow,
            {
              flex: 1,
              //borderBottomWidth: 1,
              borderColor: colors.lightGreyShade4,
              height: "100%",
              paddingRight: 10,
            },
          ]}
        >
          <Text style={styles.boldText}>Show NSFW</Text>
          <Skeleton
            color={colors.greyShade2}
            borderRadius={100}
            width={60}
            height={30}
            style={[styles.skeletonLeftMargin]}
          />
        </View>
        <SmallSpace />

        <View //Open links in new tab
          style={[
            styles.spreadCenteredRow,
            {
              flex: 1,
              //borderBottomWidth: 1,
              borderColor: colors.lightGreyShade4,
              height: "100%",
              paddingRight: 10,
            },
          ]}
        >
          <Text style={styles.boldText}>Open links in new tab</Text>
          <Skeleton
            color={colors.greyShade2}
            borderRadius={100}
            width={60}
            height={30}
            style={[styles.skeletonLeftMargin]}
          />
        </View>
        <SmallSpace />

        <View //Send notifications to email
          style={[
            styles.spreadCenteredRow,
            {
              flex: 1,
              //borderBottomWidth: 1,
              borderColor: colors.lightGreyShade4,
              height: "100%",
              paddingRight: 10,
            },
          ]}
        >
          <Text style={styles.boldText}>Send notifications to email</Text>
          <Skeleton
            color={colors.greyShade2}
            borderRadius={100}
            width={60}
            height={30}
            style={[styles.skeletonLeftMargin]}
          />
        </View>

        <Space />

        <View
          style={{
            flexDirection: width > 350 && "row",
            alignSelf: "center",
            gap: width > 350 ? 5 : 10,
          }}
        ></View>
        <Space />
      </View>
    </ScrollView>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(ProfileSettingsPlaceholder);

export default withColorScheme(ConnectedComponent);
