import { useRef, useState } from "react";
import Link from "next/link";
import {
  Box,
  Heading,
  Badge,
  Wrap,
  WrapItem,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
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
  Input,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, EditIcon } from "@chakra-ui/icons";

import Highlighter from "react-highlight-words";
import { editGood } from "../api/goods";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { endpoint } from "../api/credentials";
import Changes from "./Changes";
import fetcher from "../api/fetcher";
import moment from "moment";

export default function Tile(props) {
  const { id, name, search, balance, price, updated_at, mutateList } = props;
  const [isLoading, setIsLoading] = useState(false);
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
                <Input
                  type="number"
                  defaultValue={stateBalance}
                  value={stateBalance}
                  step="0.01"
                  min={0}
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
    </>
  );
}
