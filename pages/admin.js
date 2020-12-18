import { useState, useMemo, useEffect } from "react";
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
  Checkbox,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import Tile from "../components/Tile";
import useDebounce from "../hooks/useDebounce";
import Header from "../components/Header";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();
  useEffect(() => {
    if (cookieCutter.get("token")?.length === 0) {
      router.push("/");
    }
  }, []);
  const [inactive, setInactive] = useState(false);
  const [value, setValue] = useState("");
  const [page, setPage] = useState(1);
  const debouncedValue = useDebounce(value, 500);

  const { data, mutate } = useSWR(
    `${endpoint}/car_goods?search=${debouncedValue}&limit=10&page=${page}&inactive=${
      inactive ? "true" : ""
    }`,
    getGoods
  );
  const handleChange = (event) => setValue(event.target.value);
  const splitValue = useMemo(() => debouncedValue.split(" "), [debouncedValue]);
  return (
    <>
      <Header />
      <Box p={4}>
        <InputGroup mb={2}>
          <Input
            focusBorderColor="pink.200"
            size="lg"
            onChange={handleChange}
            placeholder="Поиск по товарам"
            value={value}
          />
          <InputRightElement
            onClick={() => setValue("")}
            cursor="pointer"
            height="100%"
            display="flex"
            alignItems="center"
          >
            <CloseIcon color="gray.500" />
          </InputRightElement>
        </InputGroup>

        <Stack
          borderRadius="md"
          border="1px"
          borderColor="gray.200"
          spacing={10}
          direction="row"
          pl={4}
          pr={4}
          pt={2}
          pb={2}
          mb={10}
        >
          <Checkbox onChange={(e) => setInactive(e.target.checked)}>
            Показать скрытые
          </Checkbox>
        </Stack>
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
          <Tile key={el.id} {...el} search={splitValue} mutateList={mutate} />
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
    </>
  );
}
