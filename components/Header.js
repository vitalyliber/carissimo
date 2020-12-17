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
} from "@chakra-ui/react";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import Link from "next/link";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";

export default function Header() {
  const router = useRouter();
  return (
    <>
      <Flex alignItems="center" p={4}>
        <Link href="/admin">
          <a>
            <Heading size="md">Учет товаров</Heading>
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
                  cookieCutter.set('token', '')
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
