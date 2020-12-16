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
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

import Highlighter from "react-highlight-words";

export default function Tile({
  id,
  name,
  good_code,
  producer,
  bar_code,
  article_code,
  search,
  balance,
  price,
}) {
  const { onOpen, onClose: initialOnClose, isOpen } = useDisclosure();
  const initialRef = useRef(null);
  const [stateBalance, setStateBalance] = useState(balance);
  const onClose = () => {
    initialOnClose();
    setStateBalance(balance);
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
          <WrapItem>
            <Badge variant="outline" fontSize="0.8em">
              Код: {good_code}
            </Badge>
          </WrapItem>

          {bar_code && (
            <WrapItem>
              <Badge variant="outline" fontSize="0.8em">
                Штрихкод: {bar_code}
              </Badge>
            </WrapItem>
          )}
          <WrapItem>
            <Badge variant="outline" fontSize="0.8em">
              Арт: {article_code}
            </Badge>
          </WrapItem>
          <WrapItem>
            <Badge variant="outline" fontSize="0.8em">
              Пост: {producer}
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
              colorScheme="green"
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
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Закрыть
            </Button>
            <Button variant="ghost">Сохранить</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
