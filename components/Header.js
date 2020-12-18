import {
  Flex,
  Spacer,
  Heading,
  Divider,
  IconButton,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  CircularProgress,
} from "@chakra-ui/react";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import Link from "next/link";
import { AddIcon, SettingsIcon, TriangleUpIcon } from "@chakra-ui/icons";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import { getGoods } from "../api/goods";

export default function Header() {
  const router = useRouter();
  const { data } = useSWR(`${endpoint}/car_goods/sum`, getGoods, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: !router.pathname.includes('edit')
  });
  return (
    <>
      <Flex alignItems="center" p={4}>
        <Link href="/admin">
          <a>
            <Heading size="md">Учет товаров</Heading>
            <Text fontSize="14px" fontWeight="bold" color="green.500">
              <TriangleUpIcon />{" "}
              {new Intl.NumberFormat("ru-RU", {
                style: "currency",
                currency: "RUB",
              }).format(data?.sum || 0)}
              {!data?.sum && (
                <CircularProgress
                  center
                  isIndeterminate
                  color="green.300"
                  value={40}
                  size="15px"
                  thickness="20px"
                  ml={2}
                />
              )}
            </Text>
          </a>
        </Link>
        <Spacer />
        <Stack direction="row" spacing={4} align="center">
          <Link href="/create">
            <a>
              <IconButton
                colorScheme="teal"
                aria-label="Добавить товар"
                icon={<AddIcon />}
              />
            </a>
          </Link>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Настройки"
              icon={<SettingsIcon />}
            />
            <MenuList>
              <MenuItem
                onClick={() => {
                  cookieCutter.set("token", "");
                  router.push("/");
                }}
              >
                Выйти
              </MenuItem>
            </MenuList>
          </Menu>
        </Stack>
      </Flex>
      <Divider />
    </>
  );
}
