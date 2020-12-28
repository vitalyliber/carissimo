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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import Highlighter from "react-highlight-words";
import { editGood } from "../api/goods";
import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { endpoint } from "../api/credentials";
import Changes from "./Changes";
import fetcher from "../api/fetcher";

export default function Tile(props) {
  const { id, name, search, balance, price, mutateList } = props;
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
            <Badge colorScheme="green" variant="outline" fontSize="0.8em">
              Цена:{" "}
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(price)}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge
              onClick={onOpen}
              cursor="pointer"
              colorScheme={balance > 0 ? "blue" : "green"}
              variant="outline"
              fontSize="0.8em"
            >
              Остаток: {balance}
              <EditIcon ml={2} />
            </Badge>
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
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={initialRef}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Редактирования остатка</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NumberInput
              defaultValue={stateBalance}
              min={0}
              onChange={(value) => setStateBalance(value)}
            >
              <NumberInputField ref={initialRef} />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Закрыть
            </Button>
            <Button
              isLoading={isLoading}
              onClick={async () => {
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
              }}
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
