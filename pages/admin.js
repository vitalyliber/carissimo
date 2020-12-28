import { useState, useMemo, useEffect } from "react";
import useSWR from "swr";
import { Select } from "@chakra-ui/react";
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
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import Tile from "../components/Tile";
import useDebounce from "../hooks/useDebounce";
import Header from "../components/Header";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import fetcher from "../api/fetcher";
const ALL = "Все";

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
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const { data: categoriesData } = useSWR(
    `${endpoint}/car_goods/categories`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const categories = useMemo(() => {
    if (categoriesData) {
      return [ALL, ...categoriesData];
    }
  }, [categoriesData]);
  const filterCategory = useMemo(
    () => (selectedCategory === ALL ? "" : selectedCategory),
    [selectedCategory]
  );
  const { data, mutate } = useSWR(
    `${endpoint}/car_goods?search=${debouncedValue}&limit=10&page=${page}&inactive=${
      inactive ? "true" : ""
    }&category=${filterCategory}`,
    getGoods
  );
  const handleChange = (event) => {
    setValue(event.target.value);
    setPage(1);
  };
  const splitValue = useMemo(() => debouncedValue.split(" "), [debouncedValue]);
  return (
    <>
      <Header category={filterCategory} />
      <Box p={4}>
        <InputGroup mb={2}>
          <Input
            focusBorderColor="pink.200"
            size="lg"
            onChange={handleChange}
            placeholder="Поиск по товарам"
            value={value}
          />
          <IconButton
            onClick={() => setValue("")}
            aria-label="Search database"
            icon={<CloseIcon color="gray.500" />}
            size="lg"
            ml={3}
          />
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
          {categories && (
            <Box>
              <Select
                onChange={(e) => setSelectedCategory(e.target.value)}
                isFullWidth={false}
              >
                {categories.map((category) => (
                  <option value={category}>{category}</option>
                ))}
              </Select>
            </Box>
          )}
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
