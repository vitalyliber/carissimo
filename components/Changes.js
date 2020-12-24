import { Box, Center, Divider, CircularProgress } from "@chakra-ui/react";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import fetcher from "../api/fetcher";
import Change from "./Change";

export default function Changes({ id }) {
  const { data } = useSWR(`${endpoint}/car_goods/${id}/changes`, fetcher);
  if (!data) {
    return (
      <Center>
        <CircularProgress
          center
          isIndeterminate
          color="green.300"
          value={40}
          mb={5}
        />
      </Center>
    );
  }
  return (
    <Box>
      <Divider mb={5} />
      {data.map((el) => (
        <Change {...el} />
      ))}
    </Box>
  );
}
