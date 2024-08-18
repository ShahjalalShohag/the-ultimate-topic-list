import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Heading,
  Link,
  Text,
  VStack,
  Input,
  Button,
  Center,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  IconButton,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Divider,
  Tooltip,
  Select,
  UnorderedList,
  ListItem,
  Switch,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon, LinkIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import Head from "next/head";
import toast from "react-hot-toast";
import { topicList, usefulLinks } from "../data/topicList";
import { topicListProblems } from "../data/topicListFullData";
import {
  getTopicDifficultyBgColor,
  getTopicDifficultyTitle,
  renderImportanceStars,
} from "../utils/topicList";
import { useTopicListColorMode } from "../lib/hooks";

const getTopicIndex = (topic_id) => {
  let index = 0;
  for (let category of topicList) {
    for (let subCategory of category.sub_categories) {
      for (let topic of subCategory.topics) {
        if (topic.topic_id === topic_id) {
          return index;
        }
        index++;
      }
    }
  }
  return -1;
};

export default function TopicList() {
  const router = useRouter(); // State to track the active accordion item
  const [colorMode, toggleColorMode] = useTopicListColorMode();
  const isLightMode = colorMode === "light";

  const [highlightedTopic, setHighlightedTopic] = useState(null);
  const [highlightedSubCategory, setHighlightedSubCategory] = useState(null);

  // Change state to track an array of active accordion items
  const [activeIndices, setActiveIndices] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [importanceFilter, setImportanceFilter] = useState("");

  // Function to check if a topic matches the selected filters
  const matchesFilters = (topic) => {
    if (!topic) return false;
    return (
      (difficultyFilter === "" ||
        parseInt(topic.difficulty) === parseInt(difficultyFilter)) &&
      (importanceFilter === "" ||
        parseInt(topic.importance) === parseInt(importanceFilter))
    );
  };

  const totalTopics = topicList.reduce(
    (acc, category) =>
      acc +
      category.sub_categories.reduce(
        (acc, subCategory) =>
          acc + subCategory.topics.filter(matchesFilters).length,
        0
      ),
    0
  );

  const totalTopicListProblems = Object.keys(topicListProblems).length;

  useEffect(() => {
    if (router.query.topic) {
      const categoryIndex = topicList.findIndex((category) =>
        category.sub_categories.some((subCategory) =>
          subCategory.topics.some(
            (topic) => topic.topic_id === router.query.topic
          )
        )
      );

      if (categoryIndex !== -1) {
        // Instead of setting a single index, manage an array
        setActiveIndices((prevIndices) => [
          ...new Set([...prevIndices, categoryIndex]),
        ]);
        setHighlightedTopic(router.query.topic);

        setTimeout(() => {
          const element = document.getElementById(router.query.topic);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 1000); // Delay to allow time for accordion to open, change it if needed
      }
    }
  }, [router.query.topic]);

  // similarly do for subcategory under a category
  useEffect(() => {
    if (router.query.subCategory && router.query.category) {
      const categoryIndex = topicList.findIndex(
        (category) => category.category_id === router.query.category
      );
      if (categoryIndex !== -1) {
        const subCategoryIndex = topicList[
          categoryIndex
        ].sub_categories.findIndex(
          (subCategory) =>
            subCategory.sub_category_id === router.query.subCategory
        );
        if (subCategoryIndex !== -1) {
          setActiveIndices((prevIndices) => [
            ...new Set([...prevIndices, categoryIndex]),
          ]);
          setHighlightedSubCategory(router.query.subCategory);
          setTimeout(() => {
            const element = document.getElementById(
              `${router.query.category}_${router.query.subCategory}`
            );
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          }, 1000); // Delay to allow time for accordion to open, change it if needed
        }
      }
    }
  }, [router.query.subCategory, router.query.category]);

  // similarly do for category
  useEffect(() => {
    if (router.query.category && !router.query.subCategory) {
      const categoryIndex = topicList.findIndex(
        (category) => category.category_id === router.query.category
      );
      if (categoryIndex !== -1) {
        setActiveIndices((prevIndices) => [
          ...new Set([...prevIndices, categoryIndex]),
        ]);
        setTimeout(() => {
          const element = document.getElementById(router.query.category);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 1000); // Delay to allow time for accordion to open, change it if needed
      }
    }
  }, [router.query.category, router.query.subCategory]);

  // Accordion onChange handler to update the active index
  const handleAccordionChange = (newIndices) => {
    setActiveIndices(newIndices);
  };

  useEffect(() => {
    // Clear highlight after 2 second
    if (highlightedTopic) {
      const timer = setTimeout(() => {
        setHighlightedTopic(null);
      }, 2000); // 2 seconds

      return () => clearTimeout(timer); // Cleanup
    }
  }, [highlightedTopic]);

  useEffect(() => {
    // Clear highlight after 2 second
    if (highlightedSubCategory) {
      const timer = setTimeout(() => {
        setHighlightedSubCategory(null);
      }, 2000); // 2 second

      return () => clearTimeout(timer); // Cleanup
    }
  }, [highlightedSubCategory]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const initialRef = useRef(null);
  const handleClose = () => {
    onClose();
    setSearchTerm("");
  };
  // useEffect to add keydown event listener
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if "/" is pressed and the search modal is not already open
      if (event.key === "/" && !isOpen) {
        event.preventDefault(); // Prevent the default action of the "/" key
        onOpen(); // Open the search modal
      }
    };

    // Add event listener to the document
    document.addEventListener("keydown", handleKeyDown);

    // Remove event listener on component unmount
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onOpen]);

  const getSearchFilteredTopics = () => {
    let matches = [];
    let minifiedSearchTerm = searchTerm.trim();
    minifiedSearchTerm = minifiedSearchTerm.replace(/\s+/g, " ");
    minifiedSearchTerm = minifiedSearchTerm.toLowerCase();
    for (let category of topicList) {
      for (let subCategory of category.sub_categories) {
        for (let topic of subCategory.topics.filter(matchesFilters)) {
          if (
            topic.topic_title.toLowerCase().includes(minifiedSearchTerm) ||
            subCategory.sub_category_title
              .toLowerCase()
              .includes(minifiedSearchTerm) ||
            category.category_title.toLowerCase().includes(minifiedSearchTerm)
          ) {
            if (matches.length < 10) {
              matches.push({
                ...topic,
                categoryName: category.category_title,
                subCategoryName: subCategory.sub_category_title,
              });
            } else {
              return matches;
            }
          }
        }
      }
    }
    return matches;
  };
  const filteredTopics = getSearchFilteredTopics();
  // Utility function to split the topic title into parts based on the search term
  const highlightMatchingText = (title, searchTerm) => {
    let minifiedSearchTerm = searchTerm.trim();
    minifiedSearchTerm = minifiedSearchTerm.replace(/\s+/g, " ");
    minifiedSearchTerm = minifiedSearchTerm.toLowerCase();
    if (!minifiedSearchTerm) return title;
    // remove non-word characters
    minifiedSearchTerm = minifiedSearchTerm.replace(/[^\w\s]/gi, " ");
    const regex = new RegExp(`(${minifiedSearchTerm})`, "gi");
    const parts = title.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <Text as="span" key={index} color="yellow.600">
          {part}
        </Text>
      ) : (
        part
      )
    );
  };

  return (
    <Box minH="95vh" bg={isLightMode ? "gray.100" : "#212225"}>
      <Head>
        <title>The Ultimate Topic List | Static </title>
        <meta
          name="description"
          content="A comprehensive list of topics in Competitive Programming"
        />
      </Head>
      <Box
        p={{ base: 5, md: 10 }}
        maxW="5xl"
        mx="auto"
        px={{ base: 4, md: 8 }}
        bg={isLightMode ? "gray.50" : "#212225"}
        minH={"95vh"}
        color={`textPrimary.${colorMode}`}
      >
        <Center>
          <Flex direction="column" align="center" textAlign="center" mb={5}>
            <Heading
              size={"lg"}
              cursor={"pointer"}
              onClick={() => router.push("")}
            >
              The Ultimate Topic List
              <Badge
                colorScheme="blue"
                ml="2"
                fontSize="xs"
                verticalAlign="super"
              >
                static
              </Badge>
            </Heading>
            <Text>
              A comprehensive list of topics in Competitive Programming
            </Text>
          </Flex>
        </Center>
        <Flex
          direction={"row"}
          mr={4}
          alignItems="center"
          justifyContent={"flex-end"}
        >
          <Tooltip
            label={`Switch to ${
              colorMode === "light" ? "dark" : "light"
            } mode.`}
            aria-label="Switch color mode"
          >
            <Box>
              <Switch
                isChecked={colorMode === "dark"}
                onChange={toggleColorMode}
                size="md"
                colorScheme="gray"
              />
            </Box>
          </Tooltip>
        </Flex>
        <Flex justifyContent="flex-end" p={[2, 4]}>
          <SearchBar onOpen={onOpen} isLightMode={isLightMode} />
        </Flex>
        <Flex
          justify={{ base: "flex-start", md: "space-between" }}
          alignItems={{ base: "flex-start", md: "center" }}
          mb={4}
          pr={{ base: 0, md: 4 }}
          direction={{ base: "column-reverse", md: "row" }}
        >
          <Flex direction={"row"} alignItems="center">
            <Select
              placeholder="Difficulty"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              size={"sm"}
              width={{ base: "120px", md: "160px" }}
              mr={2}
              borderRadius={"md"}
              boxShadow={"md"}
              borderColor={isLightMode ? null : "gray.600"}
              _hover={{ borderColor: isLightMode ? null : "gray.500" }}
            >
              <option value="0">Very Easy</option>
              <option value="1">Easy</option>
              <option value="2">Medium</option>
              <option value="3">Hard</option>
              <option value="4">Very Hard</option>
            </Select>
            <Select
              placeholder="Importance"
              value={importanceFilter}
              onChange={(e) => setImportanceFilter(e.target.value)}
              size={"sm"}
              width={{ base: "120px", md: "160px" }}
              borderRadius={"md"}
              boxShadow={"md"}
              borderColor={isLightMode ? null : "gray.600"}
              _hover={{ borderColor: isLightMode ? null : "gray.500" }}
            >
              <option value="3">★★★</option>
              <option value="2">★★☆</option>
              <option value="1">★☆☆</option>
            </Select>
          </Flex>
          <Box>
            <Text
              ml={2}
              mb={{ base: 2, md: 0 }}
              mt={{ base: 2, md: 0 }}
              color={isLightMode ? "gray.600" : "gray.400"}
              fontSize={"sm"}
            >
              Total Topics: {totalTopics}
            </Text>
          </Box>
        </Flex>
        <Accordion
          allowMultiple
          index={activeIndices}
          onChange={handleAccordionChange}
        >
          {topicList.map((category) => (
            <AccordionItem
              key={category.category_id}
              borderColor={isLightMode ? "gray.200" : "gray.600"}
            >
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left" id={category.category_id}>
                    {category.category_title}{" "}
                    <Text
                      as="span"
                      color={isLightMode ? "gray.500" : "gray.400"}
                      fontSize={"xs"}
                    >
                      {" "}
                      {category.sub_categories.reduce(
                        (acc, subCategory) =>
                          acc +
                          subCategory.topics.filter(matchesFilters).length,
                        0
                      )}
                    </Text>
                  </Box>

                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <TopicAccordion
                category={category}
                getTopicDifficultyBgColor={getTopicDifficultyBgColor}
                renderImportanceStars={renderImportanceStars}
                highlightedTopic={highlightedTopic}
                highlightedSubCategory={highlightedSubCategory}
                matchesFilters={matchesFilters}
                activeIndices={activeIndices}
                isLightMode={isLightMode}
              />
            </AccordionItem>
          ))}
          {/* Useful Links Section */}
          <AccordionItem borderColor={isLightMode ? "gray.200" : "gray.600"}>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left">
                  Useful Links
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel
              pb={4}
              border="1px solid"
              borderColor={isLightMode ? "gray.200" : "gray.600"}
              rounded={"lg"}
            >
              <UnorderedList pl={{ base: 3, md: 4 }}>
                {usefulLinks.map((link, index) => (
                  <ListItem key={index}>
                    <Box key={index} display="flex" alignItems="center">
                      <Link
                        href={link.link}
                        isExternal
                        color={isLightMode ? "blue.500" : "#4493f8"}
                        _focus={{ outline: "none" }}
                        ml={2}
                      >
                        {link.title}
                      </Link>
                    </Box>
                  </ListItem>
                ))}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <Flex flexDirection="column" alignItems="flex-end" mr={2}>
          <Box>
            <Text
              mt={4}
              color={isLightMode ? "gray.600" : "gray.400"}
              fontSize="sm"
            >
              Total Practice Problems: {totalTopicListProblems}
            </Text>
          </Box>
          <Box>
            <Text color={isLightMode ? "gray.600" : "gray.400"} fontSize="sm">
              Author:{" "}
              <Link
                href="https://codeforces.com/profile/YouKn0wWho"
                isExternal
                color="red.500"
              >
                YouKn0wWho
              </Link>
            </Text>
          </Box>
        </Flex>
        <Center mt={20}>
          <Text color={isLightMode ? "gray.400" : "gray.500"} fontSize="sm">
            This is a <i>static</i>{" "}
            <Link
              href="https://github.com/ShahjalalShohag/the-ultimate-topic-list"
              isExternal
              color="blue.400"
            >
              open-source
            </Link>{" "}
            backup of the original topic list. The original topic list is
            available at{" "}
            <Link
              href="https://youkn0wwho.academy/topic-list"
              isExternal
              color="blue.400"
            >
              YouKn0wWho Academy
            </Link>
            .
          </Text>
        </Center>
      </Box>

      {/* Search Modal */}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        size="3xl"
        initialFocusRef={initialRef}
      >
        <ModalOverlay
          bg="rgba(0,0,0,0.5)"
          style={{ backdropFilter: "blur(10px)" }}
        />
        <ModalContent bg={isLightMode ? "gray.50" : "gray.800"}>
          <ModalHeader mb={-4} color={isLightMode ? "gray.700" : "gray.400"}>
            Search Topics
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={4}>
            <Input
              ref={initialRef}
              placeholder="Type to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              boxShadow="inset 4px 0 6px -1px rgba(0, 0, 0, 0.4), inset 8px 0 8px -1px rgba(0, 0, 0, 0.4)"
              _hover={{
                boxShadow:
                  "inset 0 6px 8px -1px rgba(0, 0, 0, 0.5), inset 0 6px 5px -1px rgba(0, 0, 0, 0.6)", // Deeper inset shadows on hover
              }}
              _focus={{
                boxShadow:
                  "inset 4px 0 6px -1px rgba(0, 0, 0, 0.4), inset 8px 0 8px -1px rgba(0, 0, 0, 0.4)", // Deeper inset shadows on focus
              }}
              border="2px solid"
              borderColor="gray.600"
              focusBorderColor="gray.600"
              color={isLightMode ? "gray.700" : "gray.400"}
              bg={isLightMode ? "white" : "gray.700"}
            />

            {filteredTopics.length > 0 ? (
              <>
                <Text
                  mt={2}
                  color={
                    difficultyFilter || importanceFilter
                      ? isLightMode
                        ? "yellow.600"
                        : "yellow.500"
                      : isLightMode
                      ? "gray.600"
                      : "gray.400"
                  }
                >
                  Matching Topics{" "}
                  {difficultyFilter &&
                    `Having Difficulty ${getTopicDifficultyTitle(
                      difficultyFilter
                    )} `}
                  {importanceFilter &&
                    `${difficultyFilter ? "and" : "with"} Importance ${
                      importanceFilter === "1"
                        ? "★☆☆"
                        : importanceFilter === "2"
                        ? "★★☆"
                        : "★★★"
                    }`}{" "}
                  {filteredTopics.length >= 10
                    ? "(at most 10 results are shown)"
                    : ""}
                  :
                </Text>
                {filteredTopics.map((topic, index) => (
                  <Box key={index} p={2}>
                    <Divider
                      my={1}
                      borderColor={isLightMode ? "gray.400" : "gray.500"}
                    />
                    <Text
                      fontWeight="bold"
                      size={"sm"}
                      color={isLightMode ? "gray.700" : "gray.400"}
                    >
                      {highlightMatchingText(topic.categoryName, searchTerm)}
                      {" > "}
                      {highlightMatchingText(topic.subCategoryName, searchTerm)}
                    </Text>
                    <Flex justifyContent={"space-between"} alignItems="center">
                      <Link
                        href={`/${topic.topic_id}`}
                        isExternal
                        color="blue.500"
                      >
                        {highlightMatchingText(topic.topic_title, searchTerm)}
                      </Link>

                      <Button
                        ml={2}
                        onClick={() => {
                          const currentParams = new URLSearchParams(
                            window.location.search
                          );
                          currentParams.set("topic", topic.topic_id); // Use set to add or update the topic parameter
                          router.push(
                            `${
                              window.location.pathname
                            }?${currentParams.toString()}`
                          );
                          onClose(); // Close the modal
                        }}
                        size={"xs"}
                        colorScheme="blue"
                        minWidth="fit-content"
                      >
                        Scroll to Topic
                      </Button>
                    </Flex>
                  </Box>
                ))}
              </>
            ) : (
              searchTerm && (
                <Text mt={4} color={isLightMode ? "gray.700" : "gray.400"}>
                  No matching topics found {":(("} Note that we perform a
                  case-insensitive substring match on the titles.
                </Text>
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}

const SearchBar = ({ onOpen, isLightMode }) => {
  return (
    <InputGroup maxW="300px" cursor="pointer" onClick={onOpen}>
      <InputLeftElement
        cursor="pointer"
        children={<SearchIcon color="gray.500" />}
      />
      <Input
        placeholder="Search Topics..."
        readOnly
        _placeholder={{ opacity: 0.7, color: "inherit" }}
        borderColor={isLightMode ? "gray.300" : "gray.600"}
        cursor="pointer"
        _focus={{
          outline: "none",
          borderColor: isLightMode ? "gray.300" : "gray.600",
        }}
      />
      <InputRightElement
        cursor="pointer"
        children={
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            border="1px solid gray"
            borderRadius="md" // Rounded corners
            w="24px" // Width of the box
            h="24px" // Height of the box
            marginRight="2" // Adjust as needed for alignment
            color={isLightMode ? "gray.500" : "gray.400"}
            fontSize="sm" // Adjust the font size as needed
          >
            /
          </Box>
        }
      />
    </InputGroup>
  );
};

// do not compare function props
const areEqualAccordion = (prevProps, nextProps) => {
  // check if this category is under active indices, otherwise no need to re-render
  if (
    !nextProps.activeIndices.includes(
      topicList.findIndex(
        (category) => category.category_id === nextProps.category.category_id
      )
    )
  ) {
    return true;
  }
  let ok =
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.highlightedTopic === nextProps.highlightedTopic &&
    prevProps.highlightedSubCategory === nextProps.highlightedSubCategory &&
    prevProps.isLightMode === nextProps.isLightMode;

  // console.log("areEqualAccordion", ok);
  return ok;
};

const TopicAccordion = React.memo(
  ({
    category,
    getTopicDifficultyBgColor,
    renderImportanceStars,
    highlightedSubCategory,
    highlightedTopic,
    matchesFilters,
    activeIndices, // to check if this category is under active indices
    isLightMode,
  }) => {
    // console.log("Rendering TopicAccordion", category.category_title);
    return (
      <AccordionPanel
        pb={4}
        border="1px solid"
        borderColor={isLightMode ? "gray.200" : "gray.700"}
        borderTopRadius={"2xl"}
      >
        <HStack>
          <IconButton
            aria-label="Copy link"
            icon={<LinkIcon />}
            size="xs"
            bg={"transparent"}
            color={"gray.400"}
            onClick={() => {
              navigator.clipboard.writeText(
                window.location.origin + "/?category=" + category.category_id
              );
              toast.success(
                `Link to ${category.category_title} copied to clipboard!`
              );
            }}
            mr={-2}
            _hover={{
              bg: "transparent",
              color: isLightMode ? "gray.400" : "gray.500",
            }}
          />
          <Text fontSize="sm" color={isLightMode ? "gray.400" : "gray.500"}>
            Copy Link to {category.category_title}
          </Text>
        </HStack>
        {category.category_desc && (
          <Text
            mt={2}
            mb={4}
            color={isLightMode ? "gray.600" : "gray.400"}
            maxW="768px"
          >
            💡{"  "}
            {category.category_desc}
          </Text>
        )}
        {category.sub_categories.map((subCategory) => (
          <VStack
            align="start"
            key={subCategory.sub_category_title}
            mb={subCategory.topics.filter(matchesFilters).length > 0 ? 4 : 0}
            bg={
              subCategory.sub_category_id === highlightedSubCategory
                ? isLightMode
                  ? "gray.200"
                  : "gray.700"
                : "transparent"
            }
            id={`${category.category_id}_${subCategory.sub_category_id}`}
          >
            {subCategory.topics.filter(matchesFilters).length > 0 && (
              <>
                <HStack>
                  <IconButton
                    aria-label="Copy link"
                    icon={<LinkIcon />}
                    size="xs"
                    bg={"transparent"}
                    color={"gray.400"}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        window.location.origin +
                          "/?category=" +
                          category.category_id +
                          "&subCategory=" +
                          subCategory.sub_category_id
                      );
                      toast.success(
                        `Link to ${subCategory.sub_category_title} copied to clipboard!`
                      );
                    }}
                    mr={-2}
                    _hover={{
                      bg: "transparent",
                      color: "gray.600",
                    }}
                  />
                  <Heading size="sm">{subCategory.sub_category_title}</Heading>
                </HStack>

                {subCategory.sub_category_desc && (
                  <Text
                    mt={-2}
                    color={isLightMode ? "gray.600" : "gray.400"}
                    maxW="512px"
                  >
                    💡{"  "}
                    {subCategory.sub_category_desc}
                  </Text>
                )}

                {subCategory.topics.filter(matchesFilters).map((topic) => {
                  const isFocused = highlightedTopic === topic.topic_id;

                  return (
                    <TopicItem
                      key={topic.topic_id}
                      topic={topic}
                      isFocused={isFocused}
                      getTopicDifficultyBgColor={getTopicDifficultyBgColor}
                      renderImportanceStars={renderImportanceStars}
                      isLightMode={isLightMode}
                    />
                  );
                })}
              </>
            )}
          </VStack>
        ))}
      </AccordionPanel>
    );
  },
  areEqualAccordion
);

const areEqual = (prevProps, nextProps) => {
  let ok =
    prevProps.isFocused === nextProps.isFocused &&
    prevProps.isLightMode === nextProps.isLightMode;
  // console.log("areEqual", ok);
  return ok;
};

const TopicItem = React.memo(
  ({
    topic,
    isFocused,
    getTopicDifficultyBgColor,
    renderImportanceStars,
    isLightMode,
  }) => {
    // use useMemo for getting the topic index
    const topic_number = useMemo(() => {
      return getTopicIndex(topic.topic_id) + 1;
    }, [topic.topic_id]);
    // console.log(`topic ${topic_number}:`, topic);
    return (
      <Box
        key={topic.topic_id}
        pl={{ base: 3, md: 4 }}
        display="flex"
        alignItems="top"
        justifyContent="top"
        id={topic.topic_id}
        bg={isFocused ? (isLightMode ? "blue.100" : "blue.800") : "transparent"} // Highlight if focused
        transition="background-color 0.5s"
      >
        <Tooltip
          placement="top"
          label={getTopicDifficultyTitle(topic.difficulty)}
          hasArrow
        >
          <Box
            mt={1}
            bg={getTopicDifficultyBgColor(topic.difficulty)} // Background color based on difficulty
            w="4px" // Width of the box
            h="16px" // Height of the box
            mr={2} // Right margin for spacing
            ml={2}
            flexShrink={0} // Prevent shrinking
          />
        </Tooltip>
        <Flex alignItems={"top"}>
          <Box mr={2}>
            <Text minWidth={topic_number < 100 ? "24px" : "32px"}>
              {topic_number}.
            </Text>
          </Box>

          <Box>
            <Link
              href={`/${topic.topic_id}`}
              isExternal
              color={isLightMode ? "blue.500" : "#4493f8"}
              _focus={{ outline: "none" }}
            >
              {topic.topic_title} {renderImportanceStars(topic.importance)}
            </Link>
          </Box>
        </Flex>
      </Box>
    );
  },
  areEqual
);
