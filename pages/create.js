import Header from "../components/Header";
import Form from "../components/Form";
import { Box, Center, Heading, useToast } from "@chakra-ui/react";
import { createGood } from "../api/goods";
import { useRouter } from "next/router";
export default function Create() {
  const toast = useToast()
  const router = useRouter();
  const onSubmit = (setError) => async (values) => {
    try {
      await createGood(values);
      toast({
        title: "Товар создан",
        status: "success",
        duration: 9000,
        isClosable: true,
      })
      await router.push('/admin')
    } catch (e) {
      Object.keys(e.response.data).forEach((key) =>
        setError(key, { type: "manual", message: e.response.data[key][0] })
      );
      console.log("Errors", e.response.data);
      toast({
        title: "Ошибка создания нового товара",
        description: "Убедитесь, что необходимые поля заполнены",
        status: "error",
        duration: 9000,
        isClosable: true,
      })
    }
  };
  return (
    <>
      <Header />
      <Center mt={5} p={4}>
        <Box width={["100%", "50%"]}>
          <Heading size="md" mb={5}>
            Создание товара
          </Heading>
          <Form onSubmit={onSubmit} />
        </Box>
      </Center>
    </>
  );
}
