import React, { useState, useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import withColorScheme from "../styles/Formatting";
import { updateItem } from "../redux/actions";
import { connect } from "react-redux";
import { StateContext } from "../StateContext";
import { MenuOption } from "react-native-popup-menu";

const MenuOptionComponent = ({
  colors,
  styles,
  onSelectLogic,
  includeOnStateAction,
  onSelectStateAction,
  additionalAction,
  includeRedux,
  reduxItem,
  reduxValue,
  showAlertCriteria,
  title,
  includeIcon,
  Icon,
}) => {
  const { dispatch, global } = useContext(StateContext);
  const [hovered, setHovered] = useState(false);
  return (
    <MenuOption
      customStyles={{
        OptionTouchableComponent: TouchableOpacity,
        optionTouchable: { activeOpacity: 0.5 },
      }}
      style={{ transitionDuration: "150ms", padding: 0, borderRadius: 10 }}
      onSelect={() =>
        onSelectLogic
          ? console.log //do nothing
          : includeOnStateAction
          ? (onSelectStateAction(true), additionalAction())
          : includeRedux
          ? dispatch(updateItem([reduxItem], reduxValue))
          : additionalAction()
      }
    >
      <View
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={[
          styles.menuOption,
          {
            transitionDuration: "150ms",
            borderRadius: 10,
            backgroundColor: hovered ? colors.greyShade1 : "transparent",
            borderWidth: 2,
            borderColor: hovered ? colors.greyShade2 : "transparent",
          },
        ]}
      >
        <View
          style={{
            transitionDuration: "150ms",
            flexDirection: "row",
            alignItems: "center",
            gap: 3,
          }}
        >
          {showAlertCriteria > 0 && (
            <View
              style={{
                width: 7,
                height: 7,
                backgroundColor: colors.blue,
                borderRadius: 100,
              }}
            />
          )}
          <Text style={styles.menuText}>{title}</Text>
        </View>
        {includeIcon && Icon}
      </View>
    </MenuOption>
  );
};
const mapStateToProps = (state) => {
  return {};
};
// Connect component to the Redux store.
const ConnectedComponent = connect(mapStateToProps)(MenuOptionComponent);

export default withColorScheme(ConnectedComponent);
