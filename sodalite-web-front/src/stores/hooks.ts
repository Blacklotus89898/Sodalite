import { useContext, useState } from "react";
import { ThemeContext, UserContext, ServerContext, ProfileContext, StreakContextProps, StreakContext, EventContext } from "./stores";

// Custom Hooks
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error("useUser must be used within a UserProvider");
    return context;
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};

export const useServer = () => {
    const context = useContext(ServerContext);
    if (!context) throw new Error("useServer must be used within a ServerProvider");
    return context;
};

// Custom hook to access profile state
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const useStreak = (): StreakContextProps => {
  const context = useContext(StreakContext);
  if (!context) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};

export const useEvent = () => {
    const context = useContext(EventContext);
    if (!context) throw new Error("useEvent must be used within a EventProvider");
    return context;
}


export const useTranslate = () => {
    const [translatedText, setTranslatedText] = useState("");
  
    const translate = async (text: string, sourceLanguage = "auto", targetLanguage = "en") => {
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(text)}`
        );
        const result = await response.json();
        setTranslatedText(result[0][0][0]);
      } catch (error) {
        console.error("Translation error:", error);
      }
    };
  
    return { translate, translatedText };
  };
  