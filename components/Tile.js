import { useRef, useState } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Badge,
  Wrap,
  WrapItem,
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useToast,
  Text,
  HStack,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
  AddIcon,
  MinusIcon,
  EditIcon,
  ViewIcon,
  ViewOffIcon,
} from "@chakra-ui/icons";

import Highlighter from "react-highlight-words";
import { deleteGood, editGood } from "../api/goods";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { endpoint } from "../api/credentials";
import Changes from "./Changes";
import fetcher from "../api/fetcher";
import moment from "moment";
import NumberInput from "./NumberInput";

export default function Tile(props) {
  const {
    id,
    name,
    search,
    balance,
    price,
    updated_at,
    mutateList,
    active,
  } = props;
  const [isLoading, setIsLoading] = useState(false);
  const {
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
    isOpen: isConfirmationOpen,
  } = useDisclosure();
  const cancelRef = useRef();
  const { onOpen, onClose: initialOnClose, isOpen } = useDisclosure();
  const initialRef = useRef(null);
  const [stateBalance, setStateBalance] = useState(balance);
  const onClose = () => {
    initialOnClose();
    setStateBalance(balance);
  };
  const router = useRouter();
  const toast = useToast();
  const { data } = useSWR(`${endpoint}/car_goods/fields`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const updateBalance = async () => {
    initialOnClose();
    try {
      setIsLoading(true);
      await editGood({ data: { balance: stateBalance }, id });
      toast({
        title: "Баланс обновлен",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      mutate(`${endpoint}/car_goods/sum`, {});
      mutateList(async (data) => ({
        ...data,
        list: data?.list.map((el) =>
          el.id === id ? { ...el, balance: stateBalance } : el
        ),
      }));
      await router.push("/admin");
    } catch (e) {
      console.log(e);
      toast({
        title: "Ошибка обновления баланса",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Box
        position="relative"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        p={4}
        mb={4}
      >
        <Heading mb={3} size="md">
          <Highlighter
            highlightClassName="YourHighlightClass"
            searchWords={search}
            autoEscape={true}
            textToHighlight={name}
          />
        </Heading>
        <Wrap direction="row">
          {["article_code", "producer", "category"]
            .filter((field) => !!props[field])
            .map((field) => (
              <WrapItem>
                <Badge variant="outline" fontSize="0.8em">
                  {data && data[field]}: {props[field]}
                </Badge>
              </WrapItem>
            ))}
          <WrapItem>
            <Badge variant="outline" fontSize="0.8em">
              {props["active"] ? "Активно" : "Скрыто"}
            </Badge>
          </WrapItem>
        </Wrap>
        <Wrap mt={2} direction="row">
          <WrapItem>
            <Box
              fontSize="15px"
              fontWeight="bold"
              paddingLeft={3}
              paddingRight={3}
              paddingTop={1}
              paddingBottom={1}
              borderRadius={3}
              background={balance > 0 ? "green.500" : "gray.400"}
              color="white"
              variant="outline"
              onClick={onOpen}
              cursor="pointer"
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(price)}
              <Text ml={2} mr={2}>
                ×
              </Text>{" "}
              {balance}
              <EditIcon ml={2} />
            </Box>
          </WrapItem>
        </Wrap>
        <Box position="absolute" right={59} top={3}>
          {active && (
            <IconButton
              onClick={onConfirmationOpen}
              isLoading={isLoading}
              size="sm"
              colorScheme="red"
              aria-label="Hide"
              icon={<ViewOffIcon />}
            />
          )}
          {!active && (
            <IconButton
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await editGood({ data: { active: true }, id });
                  mutateList();
                  toast({
                    title: "Товар активирован",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                } catch (e) {
                  console.log(e);
                  toast({
                    title: "Ошибка активации товара",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                } finally {
                  setIsLoading(false);
                }
              }}
              size="sm"
              colorScheme="green"
              aria-label="Show"
              isLoading={isLoading}
              icon={<ViewIcon />}
            />
          )}
        </Box>
        <Box position="absolute" right={3} top={3}>
          <Link href={`/edit/${id}`}>
            <a>
              <IconButton
                size="sm"
                colorScheme="teal"
                aria-label="Search database"
                icon={<EditIcon />}
              />
            </a>
          </Link>
        </Box>
        <Box position="absolute" right={3} bottom={3}>
          <Text fontSize="14px" color="gray.500">
            {moment(updated_at).fromNow()}
          </Text>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактирования остатка</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateBalance();
              }}
            >
              <HStack>
                <IconButton
                  isDisabled={!stateBalance}
                  colorScheme="red"
                  onClick={() => setStateBalance(stateBalance - 1)}
                  aria-label="Minus"
                  icon={<MinusIcon color="white" />}
                  size="md"
                  variant="solid"
                />
                <NumberInput
                  type="number"
                  defaultValue={stateBalance}
                  value={stateBalance}
                  onChange={(value) => {
                    const parsedValue = parseFloat(value.target.value);
                    if (parsedValue < 0) return;
                    setStateBalance(parsedValue);
                  }}
                />
                <IconButton
                  variant="solid"
                  colorScheme="green"
                  onClick={() => setStateBalance((stateBalance || 0) + 1)}
                  aria-label="Plus"
                  icon={<AddIcon color="white" />}
                  size="md"
                  ml={3}
                />
              </HStack>
            </form>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Закрыть
            </Button>
            <Button
              isLoading={isLoading}
              onClick={updateBalance}
              colorScheme="blue"
            >
              Сохранить
            </Button>
          </ModalFooter>
          <ModalBody>
            <Changes id={id} />
          </ModalBody>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={onConfirmationClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Скрытие товара
            </AlertDialogHeader>

            <AlertDialogBody>Вы уверены?</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onConfirmationClose}>
                Отмена
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  onClose();
                  try {
                    setIsLoading(true);
                    await deleteGood(id);
                    toast({
                      title: "Товар скрыт",
                      status: "success",
                      duration: 9000,
                      isClosable: true,
                    });
                    mutateList();
                  } catch (e) {
                    console.log(e);
                    toast({
                      title: "Ошибка скрытия товара",
                      status: "error",
                      duration: 9000,
                      isClosable: true,
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                ml={3}
              >
                Скрыть
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
