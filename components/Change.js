import { Box, Stack, Text, VStack, StackDivider } from "@chakra-ui/react";
import moment from "moment";

export default function Change({ user, created_at, object_changes }) {
  return (
    <Box>
      <Stack
        justifyContent="space-between"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        spacing={10}
        direction="row"
        pl={4}
        pr={4}
        pt={2}
        pb={2}
        mb={5}
      >
        <Text fontWeight="bolder">{user}</Text>
        <Text color="gray.500">{moment(created_at).fromNow()}</Text>
      </Stack>
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
      >
        {Object.keys(object_changes).map((key) => (
          <Box ml={2} mr={2}>
            <Text fontSize="14px" fontWeight="bolder">
              {key}
            </Text>
            <Text fontSize="14px">Было: {object_changes[key][0]}</Text>
            <Text fontSize="14px">Стало: {object_changes[key][1]}</Text>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
