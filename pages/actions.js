import Header from "../components/Header";
import { Box } from "@chakra-ui/react";
import Changes from "../components/Changes";

export default function Actions() {
  return (
    <>
      <Header />
      <Box p={4}>
        <Changes />
      </Box>
    </>
  );
}
