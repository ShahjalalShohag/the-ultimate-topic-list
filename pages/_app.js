import { ChakraProvider } from "@chakra-ui/react";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/inter/800.css";
import "../styles/global.css";
import "nprogress/nprogress.css";
import "react-loading-skeleton/dist/skeleton.css";
import NProgress from "nprogress";
import Router from "next/router";
import customTheme from "../styles/customTheme";
import { Toaster } from "react-hot-toast";
import { Box } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

NProgress.configure({ showSpinner: false });
// Start the NProgress bar
Router.events.on("routeChangeStart", () => {
  NProgress.start();
});

// End the NProgress bar
Router.events.on("routeChangeComplete", () => {
  NProgress.done();
});

// If there's an error, stop the NProgress bar
Router.events.on("routeChangeError", () => {
  NProgress.done();
});

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={customTheme}>
      <Box bg="#212225">
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </Box>
    </ChakraProvider>
  );
}

export default MyApp;
