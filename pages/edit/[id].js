import Header from "components/Header";
import Form from "components/Form";
import { useState, useRef } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import { createGood, deleteGood, editGood, getGoods } from "api/goods";
import useSWR from "swr";
import { useRouter } from "next/router";
import { endpoint } from "../../api/credentials";
export default function Create() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const router = useRouter();
  const toast = useToast();
  const {
    query: { id },
  } = router;
  const { data } = useSWR(`${endpoint}/car_goods/${id}`, getGoods, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const onSubmit = (setError) => async (values) => {
    try {
      await editGood({ data: values, id });
      toast({
        title: "Товар отредактирован",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      await router.push("/");
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
      });
    }
  };
  return (
    <>
      <Header />
      <Center mt={5} p={4}>
        <Box width={["100%", "50%"]}>
          <Heading size="md" mb={5}>
            Редактирование
          </Heading>
          <Form values={data} onSubmit={onSubmit} />
          <Button
            mb={4}
            isFullWidth
            mt={2}
            colorScheme="red"
            onClick={() => setIsOpen(true)}
            isLoading={isLoading}
            type="button"
          >
            Удалить
          </Button>
        </Box>
      </Center>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Удаление товара
            </AlertDialogHeader>

            <AlertDialogBody>
              Вы уверены? Вернуть товар будет невозможно
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Отмена
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  onClose();
                  try {
                    setIsLoading(true)
                    await deleteGood(id);
                    toast({
                      title: "Товар удален",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    });
                    await router.push("/");
                  } catch (e) {
                    console.log(e);
                    toast({
                      title: "Ошибка удаления товара",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  } finally {
                    setIsLoading(false)
                  }
                }}
                ml={3}
              >
                Удалить
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
