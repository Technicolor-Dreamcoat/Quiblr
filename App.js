import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import Navigation from "./navigation";
import { LemmyAPIProvider } from "./contexts/LemmyAPIContext";
import { MenuProvider } from "react-native-popup-menu";
import { connect, Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { FontProvider } from "./FontContext";
import { StateProvider } from "./StateContext";
import withColorScheme from "./styles/Formatting";
import { isDesktop } from "react-device-detect";

const App = ({ instance }) => {
  // LogBox.ignoreLogs();
  console.disableYellowBox = true;
  const [isPWA, setIsPWA] = useState(false);
  useEffect(() => {
    if (Platform.OS == "ios" || Platform.OS == "android") {
      return;
    } else {
      const isStandalone =
        window.navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches;
      setIsPWA(isStandalone && !isDesktop);
    }
  }, []);
  return (
    <LemmyAPIProvider instance={instance}>
      <StateProvider>
        <MenuProvider>
          <View
            style={{
              width: "100%",
              height: isPWA ? 50 : 0,
              backgroundColor: "#1cb0f6",
            }}
          />
          <Navigation />
        </MenuProvider>
      </StateProvider>
    </LemmyAPIProvider>
  );
};
const mapStateToProps = (state) => {
  return {
    instance: state.updateItem.reduxGlobal.instance,
  };
};

const ReduxConnect = connect(mapStateToProps)(App);
const ConnectedApp = withColorScheme(ReduxConnect);
const Root = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <FontProvider>
          <ConnectedApp />
        </FontProvider>
      </PersistGate>
    </Provider>
  );
};

export default Root;
