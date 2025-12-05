import { useEffect, useState } from "react";
import messages from "../assets/messages.json";

const STORAGE_KEY = "shownMessageIndices";

export const useAffirmationMessage = (lang: "en" | "es") => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const shownIndices = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const availableIndices = messages
      .map((_, idx) => idx)
      .filter((i) => !shownIndices.includes(i));

    let newIndex: number;

    if (availableIndices.length === 0) {
      newIndex = Math.floor(Math.random() * messages.length);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newIndex]));
    } else {
      newIndex =
        availableIndices[Math.floor(Math.random() * availableIndices.length)];
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...shownIndices, newIndex])
      );
    }

    setMessage(messages[newIndex][lang]);
  }, [lang]);

  return message;
};
