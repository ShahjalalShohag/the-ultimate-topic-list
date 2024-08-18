import {
  Heading,
  Button,
  Text,
  Image,
  Flex,
  Box,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import styles from "../styles/navbar.module.css";
import logostyles from "../styles/logo.module.css";
import Link from "next/link";
import Router from "next/router";

const NavLink = ({ href, isExternal, children, isBold }) => {
  return (
    <Link
      href={href}
      passHref
      className={styles.navLink}
      style={isBold ? { fontWeight: "bold", fontStyle: "italic" } : {}}
      target={isExternal ? "_blank" : "_self"}
    >
      <Box as="a">{children}</Box>
    </Link>
  );
};

export default function Navbar() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    mounted && (
      <Box p={2} bg="transparent">
        <Box
          maxW="7xl"
          mx="auto"
          border={"none"}
          py={1}
          px={isMobile ? 1 : 3}
          borderRadius={5}
          borderColor="gray.700"
          bg="rgba(33, 34, 37, 0.9)"
        >
          <Flex align="center" justify="space-between" wrap="wrap">
            <Box>
              <Link href="/">
                <Flex
                  cursor={"pointer"}
                  justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Logo />
                  <Heading pl="0.5rem" size="md">
                    <Text
                      className={logostyles.logo}
                      textShadow="0.1em 0.1em 0.15em rgba(0, 0, 0, 0.4)"
                      color="whiteAlpha.900"
                    >
                      The Ultimate Topic List
                    </Text>
                  </Heading>
                </Flex>
              </Link>
            </Box>
            <Spacer />

            <Flex align="center" flexGrow={1} justify="center">
              <div>
                <NavLink href="/about">About</NavLink>
                <NavLink href="/guideline">
                  {isMobile ? "Start" : "Start Here"}
                </NavLink>
                <NavLink
                  href="https://github.com/ShahjalalShohag/code-library"
                  isExternal
                >
                  {isMobile ? "Library" : "Code Library"}
                </NavLink>
              </div>
              <Spacer />

              <Flex align="center">
                <Button
                  size={isMobile ? "xs" : "sm"}
                  colorScheme="whiteAlpha"
                  onClick={() =>
                    open(
                      " https://github.com/ShahjalalShohag/the-ultimate-topic-list",
                      "_blank"
                    )
                  }
                >
                  GitHub
                </Button>
                <Button
                  ml={2}
                  size={isMobile ? "xs" : "sm"}
                  colorScheme="whiteAlpha"
                  onClick={() =>
                    open("https://youkn0wwho.academy/topic-list", "_blank")
                  }
                >
                  Main Website
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Box>
    )
  );
}

const Logo = () => {
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    // Start rotating when the route starts to change
    const handleRouteChange = () => {
      // Add +/-360 degrees to the rotation angle randomly
      setRotationAngle(
        (prevAngle) => prevAngle + (Math.random() < 0.5 ? -1 : 1) * 360
      );
    };

    // Listen to route changes
    Router.events.on("routeChangeStart", handleRouteChange);

    // Cleanup event listeners
    return () => {
      Router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  const handleMouseEnter = () => {
    setRotationAngle(
      (prevAngle) => prevAngle + (Math.random() < 0.5 ? -1 : 1) * 720
    );
  };

  const handleMouseLeave = () => {
    setRotationAngle(
      (prevAngle) => prevAngle + (Math.random() < 0.5 ? -1 : 1) * 720
    );
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "inline-block",
        transition: "transform 2s ease",
        transform: `rotate(${rotationAngle}deg)`,
      }}
    >
      <Image
        height={"40px"}
        width={"40px"}
        src="/logo.png"
        alt="YouKn0wWho Logo"
      />
    </div>
  );
};
