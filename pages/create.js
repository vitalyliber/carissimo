import Header from "../components/Header";
import Form from "../components/Form";
import { Box, Center, Heading } from "@chakra-ui/react";
export default function Create() {
  return (
    <>
      <Header />
      <Center mt={5} p={4}>
        <Box width={["100%", "50%"]}>
          <Heading size="md" mb={5}>
            Создание товара
          </Heading>
          <Form />
        </Box>
      </Center>
    </>
  );
}
