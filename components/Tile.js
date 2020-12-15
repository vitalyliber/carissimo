import { Box, Heading, Badge, Stack } from "@chakra-ui/react";

export default function Tile({
  name,
  good_code,
  producer,
  bar_code,
  article_code,
}) {
  return (
    <Box borderRadius="md" border="1px" borderColor="gray.200" p={4} mb={4}>
      <Heading mb={3} size="md">
        {name}
      </Heading>
      <Stack direction="row">
        <Badge variant="outline" fontSize="0.8em">
          Код: {good_code}
        </Badge>
        {bar_code && (
          <Badge variant="outline" fontSize="0.8em">
            Штрихкод: {bar_code}
          </Badge>
        )}
        <Badge variant="outline" fontSize="0.8em">
          Арт: {article_code}
        </Badge>
        <Badge variant="outline" fontSize="0.8em">
          Пост: {producer}
        </Badge>
      </Stack>
    </Box>
  );
}
