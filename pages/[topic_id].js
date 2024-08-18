import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Container,
  Badge,
  VStack,
  HStack,
  OrderedList,
  ListItem,
  UnorderedList,
  Center,
  IconButton,
  Icon,
  Tooltip,
  Flex,
  Tag,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Head from "next/head";
import {
  StarIcon,
  InfoIcon,
  InfoOutlineIcon,
  QuestionIcon,
} from "@chakra-ui/icons";
import { FaCode, FaVideo } from "react-icons/fa";
import { topicList } from "../data/topicList";
import { topicInfo, topicListProblems } from "../data/topicListFullData";
import SkeletonLoader from "../components/common/Skeleton";
import {
  capitalizeFirstLetter,
  getProblemDifficultyColor,
  getProblemDifficultyTitle,
  getTopicDifficultyBgColor,
  getTopicDifficultyColor,
  getTopicDifficultyTitle,
  renderImportanceStars,
} from "../utils/topicList";
import NProgress from "nprogress";
import { GrResources } from "react-icons/gr";
import { FaAlignLeft } from "react-icons/fa";
import { useTopicListColorMode } from "../lib/hooks";

const WEBSITE_SLUG_PAIRS = [
  ["vjudge", "vjudge"],
  ["atcoder.jp", "atcoder"],
  ["acmsguru", "acmsguru"],
  ["codechef.com", "codechef"],
  ["codeforces.com/edu", "cf_edu"],
  ["codeforces.com/gym", "cf_gym"],
  ["codeforces.com/group", "cf_group"],
  ["codeforces", "codeforces"],
  ["lightoj", "lightoj"],
  ["geeksforgeeks", "geeksforgeeks"],
  ["leetcode", "leetcode"],
  ["atcoder", "atcoder"],
  ["hackerrank", "hackerrank"],
  ["hackerearth", "hackerearth"],
  ["csacademy", "csacademy"],
  ["topcoder", "topcoder"],
  ["spoj", "spoj"],
  ["onlinejudge.org", "uva"],
  ["uva", "uva"],
  ["timus", "timus"],
  ["cses", "cses"],
  ["kickstart", "kickstart"],
  ["usaco", "usaco"],
  ["interviewbit", "interviewbit"],
  ["projecteuler", "projecteuler"],
  ["kattis", "kattis"],
  ["oj.uz", "uz"],
  ["yosupo", "yosupo"],
  ["poj", "poj"],
  ["szkopul", "szkopul"],
  ["hdu", "hdu"],
  ["acmicpc", "baekjoon"],
  ["eolymp", "eolymp"],
  ["luogu", "luogu"],
  ["vnoi", "vnoi"],
  ["tlx", "tlx"],
  ["yandex", "yandex"],
  ["drive.google", "codemarshal"],
  ["acmp.ru", "acmp"],
  ["boi2021", "boi2021"],
  ["scribd", "scribd"],
  ["codedrills", "codedrills"],
  ["urionlinejudge", "uri"],
];

const getProblemSource = (url) => {
  let parts = url.split("/");
  let answer = "";
  if (!parts.empty) {
    for (const [website, slug] of WEBSITE_SLUG_PAIRS) {
      if (url.includes(website)) {
        answer = slug;
        break;
      }
    }
  }
  if (answer == "" || !answer) {
    if (parts.length < 3) {
      answer = parts[0];
    } else {
      answer = parts[2].split(".")[0];
    }
  }
  return answer;
};

const getCodeforcesGroupID = (url) => {
  let parts = url.split("/");
  return "https://codeforces.com/group/" + parts[4];
};

const getTopicInfo = (topic_id) => {
  for (const category of topicList) {
    for (const subCategory of category.sub_categories) {
      const topic = subCategory.topics.find(
        (topic) => topic.topic_id === topic_id
      );
      if (topic) {
        return topic;
      }
    }
  }
  return null;
};

const LoadingSkeleton = ({ colorMode }) => (
  <SkeletonLoader height={20} count={2} colorMode={colorMode} />
);

const TopicData = () => {
  const router = useRouter();

  const { topic_id } = router.query;
  const [colorMode, toggleColorMode] = useTopicListColorMode();
  const isLightMode = colorMode === "light";
  const [topicTitle, setTopicTitle] = useState("");
  const [topicDesc, setTopicDesc] = useState("");
  const [topicPrerequisites, setTopicPrerequisites] = useState("");
  const [topicBlog, setTopicBlog] = useState("");
  const [topicDifficulty, setTopicDifficulty] = useState(0);
  const [topicImportance, setTopicImportance] = useState(0);
  const [topicData, setTopicData] = useState(null);
  const [isTopicDataLoading, setIsTopicDataLoading] = useState(true);
  const [problems, setProblems] = useState([]);
  const [isProblemLoading, setIsProblemLoading] = useState(true);
  const subCategory = topicList
    .map((category) => category.sub_categories)
    .flat()
    .find((subCategory) =>
      subCategory.topics.some((topic) => topic.topic_id === topic_id)
    );
  const isNoobTopic = ["intro_to_programming"].includes(
    subCategory?.sub_category_id
  );

  const orderProblemData = (data, problemData) => {
    if (data?.problem_order && data?.problem_order?.length > 0) {
      // Sort by custom order if problem_order exists
      const problemOrderIndex = {};
      data.problem_order.forEach((id, index) => {
        problemOrderIndex[id] = index;
      });
      problemData.sort((a, b) => {
        const diff_a = parseInt(a.difficulty) ?? 69;
        const diff_b = parseInt(b.difficulty) ?? 69;
        if (diff_a === diff_b) {
          const idx_a = problemOrderIndex[a.problem_id] ?? 69;
          const idx_b = problemOrderIndex[b.problem_id] ?? 69;
          if (idx_a === idx_b) {
            return (a.created_at?.seconds ?? 0) - (b.created_at?.seconds ?? 0);
          } else return idx_a - idx_b;
        } else return diff_a - diff_b;
      });
    } else {
      // Sort by (difficulty, created_at) if no custom order is defined
      problemData.sort((a, b) => {
        const diff_a = parseInt(a.difficulty) ?? 69;
        const diff_b = parseInt(b.difficulty) ?? 69;
        if (diff_a === diff_b) {
          return (a.created_at?.seconds ?? 0) - (b.created_at?.seconds ?? 0);
        } else return diff_a - diff_b;
      });
    }
    return problemData;
  };

  useEffect(() => {
    // Find topic details from the static list
    topicList.some((category) =>
      category.sub_categories.some((subCategory) =>
        subCategory.topics.some((topic) => {
          if (topic.topic_id === topic_id) {
            setTopicTitle(topic.topic_title);
            setTopicDesc(topic?.topic_desc || "");
            setTopicPrerequisites(topic?.prerequisites || "");
            setTopicBlog(topic?.topic_blog || "");
            setTopicDifficulty(topic.difficulty);
            setTopicImportance(topic.importance);
            return true; // Found the topic, break the loop
          }
          return false;
        })
      )
    );
  }, [topic_id]);

  useEffect(() => {
    if (topic_id) {
      // Get additional topic data (e.g., resources, template codes)
      setIsTopicDataLoading(true);
      // Fetch problems associated with this topic
      setIsProblemLoading(true);
      NProgress.start();

      const data = topicInfo?.[topic_id] || {};
      let problemData = Object.values(topicListProblems).filter((p) =>
        p.topics.includes(topic_id)
      );

      problemData = orderProblemData(data, problemData);

      setTopicData(data);
      setProblems(problemData);

      setIsTopicDataLoading(false);
      setIsProblemLoading(false);
      NProgress.done();
    }
  }, [topic_id]);

  const getFormattedUrl = (url) => {
    if (url.includes("ShahjalalShohag")) {
      return (
        "github.com/ShahjalalShohag/code-library/" +
        url.split("/").pop().replace(/%20/g, "_")
      );
    } else {
      // remove starting https:// or http://
      return url.replace(/^(https?:\/\/)?(www\.)?/i, "");
    }
  };

  const bgColor = isLightMode ? "whiteAlpha.900" : "#303030";
  const tableColor = isLightMode ? "whiteAlpha.900" : "#303030";

  if (!isTopicDataLoading && !topicTitle) {
    return (
      <Box bg="gray.100">
        <Container maxW="5xl" p={5} bg="gray.50" minH="95vh">
          No topic found!
        </Container>
      </Box>
    );
  }

  if (!topicTitle) {
    return (
      <Box bg="gray.100">
        <Container maxW="5xl" p={5} bg="gray.50" minH="95vh">
          <Flex flexDir="column" align="center">
            <Spinner size="sm" />
          </Flex>
        </Container>
      </Box>
    );
  }

  return (
    <Box bg={isLightMode ? "gray.100" : "#212225"}>
      <Container
        maxW="5xl"
        mx="auto"
        p={{ base: 2, md: 5 }}
        bg={isLightMode ? "gray.50" : "#212225"}
        minH={"95vh"}
        color={`textPrimary.${colorMode}`}
      >
        <Head>
          <title>{topicTitle}</title>
          <meta name="description" content="The Ultimate Topic List" />
        </Head>

        <Center p={5}>
          <VStack w="100%" spacing={0}>
            <HStack spacing={2} maxW={{ base: "95%", md: "70%" }}>
              <Heading size="lg" align="center">
                {topicTitle}
              </Heading>
            </HStack>
            <Box align="center">
              <HStack spacing={2}>
                <Link href="/about#topic-difficulty" isExternal>
                  <IconButton
                    aria-label="A tooltip"
                    icon={<QuestionIcon />}
                    colorScheme={isLightMode ? "gray" : "whiteAlpha"}
                    size="xs"
                  />
                </Link>
                <Text
                  fontSize="md"
                  color={isLightMode ? "gray.500" : "gray.400"}
                >
                  Difficulty:{" "}
                </Text>
                <Box
                  bg={getTopicDifficultyBgColor(topicDifficulty)}
                  w="4px"
                  h="18px"
                  mr={-2}
                />
                <Badge colorScheme={getTopicDifficultyColor(topicDifficulty)}>
                  {getTopicDifficultyTitle(topicDifficulty)}
                </Badge>
              </HStack>
              <HStack spacing={2} mt={1}>
                <Link href="/about/#topic-importance" isExternal>
                  <IconButton
                    aria-label="A tooltip"
                    icon={<QuestionIcon />}
                    colorScheme={isLightMode ? "gray" : "whiteAlpha"}
                    size="xs"
                  />
                </Link>
                <Text
                  fontSize="md"
                  color={isLightMode ? "gray.500" : "gray.400"}
                >
                  Importance: {renderImportanceStars(topicImportance)}
                </Text>
              </HStack>
              <Box>
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
              </Box>
            </Box>
            {topicDesc && (
              <Text
                fontSize="md"
                color={isLightMode ? "gray.500" : "gray.400"}
                maxW="800px"
                align="center"
              >
                {topicDesc}
              </Text>
            )}
            {topicPrerequisites && (
              <Text
                fontSize="md"
                color="yellow.600"
                maxW="800px"
                align="center"
              >
                Prerequisites: {topicPrerequisites}
              </Text>
            )}
          </VStack>
        </Center>

        <VStack spacing={3} align="stretch">
          <Box bg={bgColor} p={5} rounded="md" shadow="base">
            <Heading size="md">
              <Icon as={FaAlignLeft} mr={2} boxSize={4} />
              Resources
            </Heading>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color={isLightMode ? "gray.500" : "gray.400"}
              mb={2}
            >
              The resources are given in the recommended order of learning. The
              best idea would be to go through all of them.
            </Text>
            {topicTitle?.endsWith("(2D)") || topicTitle?.endsWith("(3D)") ? (
              <Text fontSize="sm" color="gray.800" mb={2}>
                <InfoOutlineIcon mr={2} />
                Please go through the template code to understand this topic
                better.
              </Text>
            ) : null}
            {!isTopicDataLoading && topicBlog && (
              <>
                <Text
                  fontSize="sm"
                  color={isLightMode ? "gray.600" : "gray.400"}
                  ml={4}
                >
                  Short Description:
                </Text>
                <Box
                  ml={8}
                  px={4}
                  mb={4}
                  textColor={isLightMode ? "gray.600" : "gray.400"}
                  fontSize={"sm"}
                  dangerouslySetInnerHTML={{ __html: topicBlog }}
                />
              </>
            )}
            {isTopicDataLoading ? (
              <LoadingSkeleton colorMode={colorMode} />
            ) : topicData?.resources?.length > 0 ? (
              <OrderedList px={4}>
                {topicData.resources.map((resource, index) => (
                  <ListItem key={index}>
                    <HStack>
                      <VStack alignItems={"start"} spacing={0}>
                        <Link
                          href={resource.resource_url}
                          isExternal
                          color={isLightMode ? "blue.500" : "#4493f8"}
                        >
                          <HStack>
                            <Text>{resource.resource_title}</Text>
                            <Box>
                              {resource?.is_video_type && (
                                <FaVideo size={"14px"} />
                              )}
                            </Box>
                            {resource?.is_starred && (
                              <Tooltip
                                label="It is recommended to go through this resource"
                                hasArrow
                              >
                                <StarIcon color={"yellow.500"} boxSize="12px" />
                              </Tooltip>
                            )}
                          </HStack>
                        </Link>
                        {resource?.resource_comments && (
                          <Text color={"gray.500"} size={"sm"} ml={2}>
                            <InfoOutlineIcon boxSize={"14px"} />{" "}
                            {capitalizeFirstLetter(resource?.resource_comments)}
                          </Text>
                        )}
                      </VStack>
                    </HStack>
                  </ListItem>
                ))}
              </OrderedList>
            ) : (
              <Text>No resources available</Text>
            )}
          </Box>{" "}
          {!isNoobTopic && (
            <Box bg={bgColor} p={5} rounded="md" shadow="base">
              <Heading size="md">
                <Icon as={FaCode} mr={2} boxSize={4} />
                Templates
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={isLightMode ? "gray.500" : "gray.400"}
                mb={2}
              >
                Some example codes for this topic. These can be used as a
                reference to solve problems. It is strongly recommended to write
                your own templates.
              </Text>

              {isTopicDataLoading ? (
                <LoadingSkeleton colorMode={colorMode} />
              ) : topicData?.template_codes?.length > 0 ? (
                <UnorderedList px={4}>
                  {topicData.template_codes.map((url, index) => (
                    <ListItem key={index}>
                      <>
                        <Link
                          href={url}
                          isExternal
                          color={isLightMode ? "blue.500" : "#4493f8"}
                        >
                          {getFormattedUrl(url)}
                        </Link>
                      </>
                    </ListItem>
                  ))}
                </UnorderedList>
              ) : (
                <Text>No template codes available</Text>
              )}
            </Box>
          )}
          {!isNoobTopic && (
            <Box bg={tableColor} p={5} rounded="md" shadow="base">
              <Heading size="md">
                <Icon as={GrResources} mr={2} boxSize={4} />
                Problems
              </Heading>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={isLightMode ? "gray.500" : "gray.400"}
                mb={2}
              >
                The problems are given in the recommended order of solving. It
                would be wiser if you solve all of them except few hard
                problems.
              </Text>

              {isProblemLoading ? (
                <LoadingSkeleton colorMode={colorMode} />
              ) : problems?.length > 0 ? (
                <>
                  <Box overflowX={"auto"}>
                    <Table variant="simple" size={{ base: "md", md: "md" }}>
                      <Thead>
                        <Tr>
                          <Th
                            color={isLightMode ? "gray.600" : "gray.400"}
                            borderBottom={isLightMode ? null : "1px solid gray"}
                          >
                            Problem
                          </Th>
                          <Th
                            color={isLightMode ? "gray.600" : "gray.400"}
                            borderBottom={isLightMode ? null : "1px solid gray"}
                          >
                            Difficulty
                            <Link href="/about/#problem-difficulty" isExternal>
                              <IconButton
                                aria-label="A tooltip"
                                icon={<QuestionIcon />}
                                colorScheme={
                                  isLightMode ? "gray" : "whiteAlpha"
                                }
                                size="xs"
                                ml={2}
                              />
                            </Link>
                          </Th>

                          <Th
                            color={isLightMode ? "gray.600" : "gray.400"}
                            borderBottom={isLightMode ? null : "1px solid gray"}
                          >
                            Tags
                          </Th>
                          <Th
                            color={isLightMode ? "gray.600" : "gray.400"}
                            borderBottom={isLightMode ? null : "1px solid gray"}
                          >
                            Source
                          </Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {problems.map((problem, index) => (
                          <Tr key={problem.problem_id}>
                            <>
                              <Td
                                borderBottom={
                                  isLightMode ? null : "1px solid gray"
                                }
                              >
                                <HStack>
                                  <Link
                                    href={problem.problem_url}
                                    isExternal
                                    color={isLightMode ? "blue.500" : "#4493f8"}
                                  >
                                    {index + 1}. {problem.problem_title}
                                  </Link>
                                  {problem?.is_starred && (
                                    <Tooltip
                                      label="Starred problems are highly
                                                recommended to grasp the topic thoroughly."
                                      aria-label="A tooltip"
                                      hasArrow
                                    >
                                      <StarIcon
                                        color="yellow.500"
                                        boxSize="12px"
                                      />
                                    </Tooltip>
                                  )}
                                </HStack>
                                {(problem?.problem_comments ||
                                  problem?.problem_id.includes("cf_group") ||
                                  problem?.problem_id.includes("cf_gym") ||
                                  problem?.problem_url.includes("gymProblem") ||
                                  problem?.problem_id.includes("cf_edu")) && (
                                  <ShowProblemDescription
                                    isLightMode={isLightMode}
                                  >
                                    <Text
                                      color={
                                        isLightMode ? "gray.500" : "gray.400"
                                      }
                                      size={"sm"}
                                      mb={5}
                                    >
                                      {problem?.problem_id.includes("cf_group")
                                        ? "Please join this group on Codeforces to access this problem: " +
                                          getCodeforcesGroupID(
                                            problem?.problem_url
                                          ) +
                                          " \n"
                                        : ""}
                                      {problem?.problem_id.includes("cf_edu")
                                        ? "Please enroll in this ITMO Academy: pilot course to view this problem: https://codeforces.com/edu/courses" +
                                          " \n"
                                        : ""}
                                      {problem?.problem_id.includes("cf_gym") ||
                                      problem?.problem_url.includes(
                                        "gymProblem"
                                      ) ? (
                                        <>
                                          You might have to paste the URL in the
                                          search bar manually to get access to
                                          GYM problems. Problem URL:{" "}
                                          {problem?.problem_url}
                                          {" \n"}
                                          {problem?.problem_comments && (
                                            <>
                                              <br />
                                              <br />
                                            </>
                                          )}
                                        </>
                                      ) : (
                                        ""
                                      )}
                                      {capitalizeFirstLetter(
                                        problem?.problem_comments
                                      )}
                                    </Text>
                                  </ShowProblemDescription>
                                )}
                              </Td>
                              <Td
                                borderBottom={
                                  isLightMode ? null : "1px solid gray"
                                }
                              >
                                <Badge
                                  colorScheme={getProblemDifficultyColor(
                                    problem.difficulty
                                  )}
                                  opacity={isLightMode ? 1 : 0.8}
                                >
                                  {getProblemDifficultyTitle(
                                    problem.difficulty
                                  )}
                                </Badge>
                              </Td>

                              <Td
                                borderBottom={
                                  isLightMode ? null : "1px solid gray"
                                }
                              >
                                <TagList
                                  tags={problem?.topics || []}
                                  isLightMode={isLightMode}
                                />
                              </Td>
                              <Td
                                borderBottom={
                                  isLightMode ? null : "1px solid gray"
                                }
                              >
                                <Badge opacity={isLightMode ? 1 : 0.8}>
                                  {getProblemSource(problem.problem_url)}
                                </Badge>
                              </Td>
                            </>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </>
              ) : (
                <Text>No problems available</Text>
              )}
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default TopicData;

// take a chakra text component and open a modal that will show the full text
// also this will return a button that will open the modal
const ShowProblemDescription = ({ children, isLightMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IconButton
        aria-label="A tooltip"
        icon={<InfoIcon />}
        colorScheme={isLightMode ? "gray" : "whiteAlpha"}
        size="xs"
        onClick={() => setIsOpen(true)}
      />
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent bg={isLightMode ? "gray.50" : "gray.800"}>
          <ModalHeader color={isLightMode ? "gray.700" : "gray.400"}>
            More Details About the Problem
          </ModalHeader>
          <ModalCloseButton color={isLightMode ? "gray.700" : "gray.400"} />
          <ModalBody color={isLightMode ? "gray.700" : "gray.400"}>
            {children} {/* Inject children here */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
const TagList = ({ tags, isLightMode }) => {
  return (
    <Accordion allowToggle>
      <AccordionItem border="none" w="150px" size="sm">
        <h2>
          <AccordionButton>
            <AccordionIcon />
            <Box flex="1" textAlign="left" ml={2} fontSize="sm">
              Show Tags
            </Box>
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <HStack wrap="wrap">
            {tags.map((tag, index) => {
              const info = getTopicInfo(tag);
              return (
                info && (
                  <Tag
                    key={index}
                    size="sm"
                    colorScheme={
                      getTopicDifficultyBgColor(info.difficulty).split(".")[0]
                    }
                    wordBreak={"break-all"}
                    p={1}
                    onClick={() => window.open("/" + tag, "_blank")}
                    cursor="pointer"
                    textDecoration={"underline"}
                    textUnderlineOffset={"2px"}
                    opacity={isLightMode ? 1 : 0.8}
                  >
                    {info.topic_title}
                  </Tag>
                )
              );
            })}
          </HStack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};
