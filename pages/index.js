import { useState } from "react";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import { getGoods } from "../api/goods";
import {
  Input,
  Box,
  CircularProgress,
  Center,
  Heading,
} from "@chakra-ui/react";
import Tile from "../components/Tile";

export default function Home() {
  const [value, setValue] = useState("");
  const { data, error } = useSWR(
    `${endpoint}/car_goods?search=${value}&limit=10`,
    getGoods
  );
  const handleChange = (event) => setValue(event.target.value);
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
        <Tile key={el.id} {...el} search={value} />
      ))}
      {data?.list?.length === 0 && (
        <Center mt={4}>
          <Heading size="sx">Ничего не найдено</Heading>
        </Center>
      )}
    </Box>
  );
}
