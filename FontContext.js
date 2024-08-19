import React, { createContext, useContext, useState, useEffect } from "react";
import { connect } from "react-redux";
import * as Font from "expo-font";
import BoldDyslexia from "./assets/fonts/OpenDyslexic-Bold.otf";
import RegularDyslexia from "./assets/fonts/OpenDyslexic-Regular.otf";
import {
  useFonts,
  Nunito_200ExtraLight,
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_500Medium,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
} from "@expo-google-fonts/nunito";

// Create a context for the font
const FontContext = createContext();

export { FontContext };

export function FontProviderUnconnected({ children, dyslexiaFont }) {
  // Define the font names based on the switch state
  const chosenFont_Thin = dyslexiaFont ? "dyslexiaRegular" : "Nunito_500Medium";
  const chosenFont_Regular = dyslexiaFont
    ? "dyslexiaRegular"
    : "Nunito_600SemiBold";
  const chosenFont_Bold = dyslexiaFont ? "dyslexiaRegular" : "Nunito_700Bold";
  const chosenFont_ExtraBold = dyslexiaFont
    ? "dyslexiaBold"
    : "Nunito_800ExtraBold";
  const chosenFont_SuperBold = dyslexiaFont
    ? "dyslexiaBold"
    : "Nunito_900Black";

  let [fontsLoaded] = useFonts({
    Nunito_200ExtraLight,
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_500Medium,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  // Load dyslexia font
  useEffect(() => {
    Font.loadAsync({
      dyslexiaBold: BoldDyslexia,
      dyslexiaRegular: RegularDyslexia,
    });
  }, []);

  return (
    <FontContext.Provider
      value={{
        chosenFont_Thin,
        chosenFont_Regular,
        chosenFont_Bold,
        chosenFont_ExtraBold,
        chosenFont_SuperBold,
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

const mapStateToProps = (state) => {
  return {
    dyslexiaFont: state.updateItem.reduxGlobal.dyslexiaFont,
  };
};
// Connect component to the Redux store.
export const FontProvider = connect(mapStateToProps)(FontProviderUnconnected);
export function useFont() {
  return useContext(FontContext);
}
