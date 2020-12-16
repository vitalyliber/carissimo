import { Box, Heading, Badge, Wrap, WrapItem } from "@chakra-ui/react";
import Highlighter from "react-highlight-words";

export default function Tile({
  name,
  good_code,
  producer,
  bar_code,
  article_code,
  search,
}) {
  return (
    <Box borderRadius="md" border="1px" borderColor="gray.200" p={4} mb={4}>
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
    </Box>
  );
}
