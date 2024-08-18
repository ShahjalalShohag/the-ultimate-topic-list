import { StarIcon } from "@chakra-ui/icons";

export const getProblemDifficultyColor = (difficulty) => {
  const diff = parseInt(difficulty) || 1;
  switch (diff) {
    case 1:
      return "green";
    case 2:
      return "yellow";
    case 3:
      return "red";
    default:
      return "purple";
  }
};
export const getProblemDifficultyTitle = (difficulty) => {
  const diff = parseInt(difficulty) || 1;
  switch (diff) {
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    default:
      return "Very Hard";
  }
};

export function capitalizeFirstLetter(string) {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getTopicDifficultyColor = (difficulty) => {
  const diff = parseInt(difficulty) || 0;
  switch (diff) {
    case 0:
      return "gray";
    case 1:
      return "green";
    case 2:
      return "yellow";
    case 3:
      return "red";
    default:
      return "purple";
  }
};

export const getTopicDifficultyTitle = (difficulty) => {
  const diff = parseInt(difficulty) || 0;
  switch (diff) {
    case 0:
      return "Very Easy";
    case 1:
      return "Easy";
    case 2:
      return "Medium";
    case 3:
      return "Hard";
    default:
      return "Very Hard";
  }
};

export const getTopicDifficultyBgColor = (difficulty) => {
  switch (difficulty) {
    case 0:
      return "gray.500";
    case 1:
      return "green.500";
    case 2:
      return "yellow.500";
    case 3:
      return "red.500";
    default:
      return "red.900";
  }
};

// Function to render difficulty as stars
export const renderImportanceStars = (importance) => {
  return Array.from({ length: importance }, (_, index) => (
    <StarIcon key={index} boxSize="8px" color="yellow.500" />
  ));
};
