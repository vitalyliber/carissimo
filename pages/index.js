import { useState, useEffect } from "react";
import cookieCutter from "cookie-cutter";
import {
  Input,
  Box,
  Center,
  Heading,
  Button,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";
import { checkAuth } from "../api/credentials";
import { useRouter } from "next/router";

export default function Home({}) {
  const toast = useToast();
  const [key, setKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (cookieCutter.get('token')?.length > 0) {
      router.push('/admin')
    }
  },[])

  return (
    <Center alignItems="center" height="100vh">
      <Flex alignItems="center" flexDirection="column" width="100%">
        <Heading mb={2} size="lg">
          Учет товаров
        </Heading>
        <Text color="gray.500" mb={10}>
          ИП Моргунова Оксана Георгиевна
        </Text>

        <Box pl={[4, 0]} pr={[4, 0]} width={["100%", "30%"]}>
          <Input
            type="password"
            value={key}
            onChange={(el) => setKey(el.target.value)}
            placeholder="Введите ключ доступа"
          />
          <Button
            onClick={async () => {
              try {
                setIsLoading(true);
                await checkAuth({ token: key });
                await cookieCutter.set("token", key);
                toast({
                  title: "Авторизация прошла успешно",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
                router.push("/admin");
              } catch (e) {
                console.log(e);
                toast({
                  title: "Неверный ключ доступа",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              } finally {
                setIsLoading(false);
              }
            }}
            mb={4}
            isFullWidth
            mt={8}
            colorScheme="teal"
            isDisabled={!key}
            isLoading={isLoading}
          >
            Войти
          </Button>
        </Box>
      </Flex>
    </Center>
  );
}
