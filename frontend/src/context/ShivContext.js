import { createContext, useContext, useState } from "react";

const ShivContext = createContext(null);

export function ShivProvider({ children }) {
  const [activeSentence, setActiveSentence] = useState("");
  const [isShivSpeaking, setIsShivSpeaking] = useState(false);
  const [currentLesson,  setCurrentLesson]  = useState("");

  return (
    <ShivContext.Provider value={{
      activeSentence, setActiveSentence,
      isShivSpeaking, setIsShivSpeaking,
      currentLesson,  setCurrentLesson,
    }}>
      {children}
    </ShivContext.Provider>
  );
}

export const useShivContext = () => useContext(ShivContext);
