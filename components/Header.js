import {
  Flex,
  Spacer,
  Heading,
  Divider,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import Link from "next/link";
import { AddIcon, SettingsIcon } from "@chakra-ui/icons";

export default function Header() {
  return (
    <>
      <Flex alignItems="center" p={4}>
        <Link href="/">
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
          <IconButton aria-label="Настройки" icon={<SettingsIcon />} />
        </Stack>
      </Flex>
      <Divider />
    </>
  );
}
