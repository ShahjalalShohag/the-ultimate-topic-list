import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
export const useTopicListColorMode = () => {
  const [colorMode, setColorMode] = useState("light");
  const toast = useToast();

  useEffect(() => {
    const topicListColorMode = localStorage.getItem("topic-list-color-mode");
    if (topicListColorMode) {
      setColorMode(topicListColorMode);
    }
  }, []);

  const toggleColorMode = () => {
    const mode = colorMode === "light" ? "dark" : "light";
    setColorMode(mode);
    localStorage.setItem("topic-list-color-mode", mode);
    toast({
      title: `Switched to ${mode} mode!`,
      description: "",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  return [colorMode, toggleColorMode];
};
