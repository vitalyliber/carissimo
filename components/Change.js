import {
  Box,
  Stack,
  Text,
  VStack,
  StackDivider,
  HStack,
  Spacer,
  useClipboard,
  IconButton,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import moment from "moment";
import "moment/locale/ru";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import fetcher from "../api/fetcher";
moment.locale("ru");

export default function Change({ user, created_at, object, object_changes }) {
  const { data } = useSWR(`${endpoint}/car_goods/fields`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const name = object?.name || object_changes?.name?.[1];
  const { hasCopied, onCopy } = useClipboard(name);
  return (
    <Box mb={7}>
      <Stack
        justifyContent="space-between"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        spacing={1}
        pl={4}
        pr={4}
        pt={2}
        pb={2}
        mb={2}
      >
        <HStack>
          <Text fontWeight="bolder">{user}</Text>
          <Spacer />
          <Text color="gray.500">{moment(created_at).fromNow()}</Text>
        </HStack>
        <HStack>
          <Text onClick={onCopy} color="gray.500" mt={1}>
            {name}
          </Text>
          <IconButton
            onClick={onCopy} ml={2}
            colorScheme="teal"
            aria-label="Скопировать название"
            icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
            size="xs"
          />
        </HStack>
      </Stack>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={2}
        align="stretch"
      >
        {Object.keys(object_changes).map((key) => (
          <Box ml={2} mr={2}>
            <Text fontSize="14px" fontWeight="bolder">
              {data && data[key]}
            </Text>
            <Text fontSize="14px">Было: {object_changes[key][0]}</Text>
            <Text fontSize="14px">Стало: {object_changes[key][1]}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
