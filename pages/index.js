import { useState, useMemo } from "react";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import { getGoods } from "../api/goods";
import {
  Input,
  Box,
  CircularProgress,
  Center,
  Heading,
  Stack,
  Button,
  Text,
} from "@chakra-ui/react";
import Tile from "../components/Tile";
import useDebounce from "../hooks/useDebounce";

export default function Home() {
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const debouncedValue = useDebounce(value, 500);

  const { data, error } = useSWR(
    `${endpoint}/car_goods?search=${debouncedValue}&limit=10&page=${page}`,
    getGoods
  );
  const handleChange = (event) => setValue(event.target.value);
  const splitValue = useMemo(() => debouncedValue.split(" "), [debouncedValue]);
  return (
    <Box p={4}>
      <Input
        focusBorderColor="pink.200"
        size="lg"
        onChange={handleChange}
        placeholder="Поиск по товарам"
        mb={5}
      />
      {!data && (
        <Center>
          <CircularProgress
            center
            isIndeterminate
            color="green.300"
            value={40}
          />
        </Center>
      )}
      {data?.list?.map((el) => (
        <Tile key={el.id} {...el} search={splitValue} />
      ))}
      {data?.list?.length === 0 && (
        <Center mt={4}>
          <Heading size="sx">Ничего не найдено</Heading>
        </Center>
      )}
      {data && (
        <Center mt={10} mb={10}>
          <Stack direction="row" spacing={4} align="center">
            <Button
              isDisabled={page === 1}
              onClick={() => setPage(page - 1)}
              colorScheme="teal"
              variant="solid"
            >
              Назад
            </Button>
            <Stack direction="row" spacing={4} align="center">
              <Text>{page}</Text>
              <Text>из</Text>
              <Text>{data?.total_pages}</Text>
            </Stack>
            <Button
              isDisabled={page === data?.total_pages}
              onClick={() => setPage(page + 1)}
              colorScheme="teal"
              variant="solid"
            >
              Вперед
            </Button>
          </Stack>
        </Center>
      )}
    </Box>
  );
}
