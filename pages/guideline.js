import {
  Box,
  Text,
  Heading,
  Link,
  ListItem,
  UnorderedList,
  Button,
} from "@chakra-ui/react";
import Head from "next/head";

const GuidelinePage = () => {
  return (
    <Box bg="gray.100">
      <Box maxW="5xl" mx="auto" p={4} bg="gray.50" minH="95vh">
        <Head>
          <title>Guideline</title>
        </Head>
        <Box p={2}>
          <Heading size="lg" mb={4}>
            How to Use the Topic List
          </Heading>
          <Text fontSize={"md"} mb={2}>
            First check the{" "}
            <Link
              color={"blue.500"}
              isExternal
              href={"/about"}
              textDecoration={"underline"}
            >
              About
            </Link>{" "}
            section of the topic list.
          </Text>
          <Text fontSize="md" mb={2}>
            The Topic List is designed to provide structured learning paths for
            Competitive Programming. Each topic is categorized by difficulty and
            importance to guide learners from basic to advanced levels.
          </Text>
          <Heading size="md" my={2} mt={4}>
            If You are a Beginner
          </Heading>
          <Text fontSize="md" mb={2}>
            Check the{" "}
            <Link
              color={"blue.500"}
              isExternal
              href={"/?category=basics"}
              textDecoration={"underline"}
            >
              Basics
            </Link>{" "}
            category at the top to start learning the fundamental concepts of
            Programming.
            <br />
            It contains a step by step guide to learn a language and all the
            basic topics of Competitive Programming. So even if you don't want
            to become a Competitive Programmer, you can still learn programming
            following this guide.
            <br />
            And, if you know nothing about programming, no worries! This guide
            will help you to start from scratch.
            <br />
            Also check this guideline:{" "}
            <Box mr={2}>
              <Button
                onClick={() =>
                  window.open(
                    "https://github.com/ShahjalalShohag/Competitive-Programming-A-Complete-Guideline",
                    "_blank"
                  )
                }
                colorScheme="gray"
                size={"sm"}
                boxShadow={"md"}
              >
                <Text mr="2">CP Guideline</Text>
                <img src="https://img.shields.io/github/stars/ShahjalalShohag/Competitive-Programming-A-Complete-Guideline" />
              </Button>
            </Box>
          </Text>
          <Heading size="md" my={2} mt={4}>
            If You are not a Beginner
          </Heading>
          <Text fontSize="md" mb={2}>
            If you already know the basics of programming, you can do the
            following:
            <br />
            <UnorderedList>
              <ListItem>
                Select the difficulty level you want to practice. You can filter
                topics by difficulty level.
              </ListItem>
              <ListItem>
                Then select the importance level of the topic. You can filter
                topics by importance level too. Start with 3 stars topics first.
              </ListItem>
              <ListItem>Then select the topic you want to learn.</ListItem>
              <ListItem>
                Click on the topic to see the resources and list of problems
                related to that topic.
              </ListItem>
              <ListItem>
                Check the resources to learn the topic. The resources may
                include articles, tutorials, videos, etc and they are given in
                the recommended order to learn the topic.
              </ListItem>
              <ListItem>
                Solve the problems to practice the topic. The problems are
                categorized by difficulty so that you can start with easy
                problems and gradually move to harder problems.
              </ListItem>
              <ListItem>
                Check the attached template codes to understand the topic
                better.
              </ListItem>
              <ListItem>
                Don't forget to participate in contests and solve random
                problems on different platforms to improve your problem-solving
                skills.
              </ListItem>
              <ListItem>
                You should also try to do rating-wise practice from time to
                time. Do not always stick to topic-wise practice. While doing
                rating-wise practice, pick a rating that is slightly higher than
                your current rating to challenge yourself.
              </ListItem>
            </UnorderedList>
          </Text>
          <br />
          <Text fontSize="md" mb={2}>
            <i>
              Do not get overwhelmed by the number of topics. Just start with
              the basics and keep going. If you are done with the basics, then
              you are already better than 80% of the people and ready to be an
              Expert in Codeforces. And, if you are done with most of the 3*
              topics of easy and medium difficulty, and solve enough problems in
              Codeforces, then that is enough for you to be a Grandmaster in
              Codeforces, and this should also be enough for ICPC contests. Of
              course if you want to perform the best in ICPC, you might need to
              learn more.
            </i>
          </Text>
          <br />
          If you are still confused, feel free to join our{" "}
          <Link
            href="https://discord.gg/gFeaK5g86w"
            isExternal
            color="blue.500"
          >
            Discord Server
          </Link>{" "}
          and ask for help.
        </Box>
      </Box>
    </Box>
  );
};

export default GuidelinePage;
