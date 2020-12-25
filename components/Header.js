import { useRef, useState } from "react";
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
  useToast,
  Box,
} from "@chakra-ui/react";
import cookieCutter from "cookie-cutter";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  AddIcon,
  SettingsIcon,
  TriangleUpIcon,
  TimeIcon,
  RepeatIcon,
  DownloadIcon,
} from "@chakra-ui/icons";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import fetcher from "../api/fetcher";
import { updateGoodsViaExcel } from "../api/goods";

export default function Header() {
  const refFile = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { data } = useSWR(`${endpoint}/car_goods/sum`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateOnMount: !router.pathname.includes("edit"),
  });
  console.log("dddd", data);
  const { data: userInfo } = useSWR(
    `${endpoint}/car_goods/user_info`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
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
              {!data && (
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
          <Link href="/actions">
            <a>
              <IconButton
                colorScheme="teal"
                aria-label="Добавить товар"
                icon={<TimeIcon />}
              />
            </a>
          </Link>
          {userInfo?.admin && (
            <IconButton
              colorScheme="teal"
              aria-label="Обновить с помощью Excel"
              onClick={async () => {
                await refFile.current.click();
              }}
              isLoading={loading}
              icon={<RepeatIcon />}
            />
          )}
          <IconButton
            colorScheme="teal"
            aria-label="Скачать Excel файл"
            onClick={async () => {
              alert("Не реализовано");
            }}
            icon={<DownloadIcon />}
          />
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Настройки"
              icon={<SettingsIcon />}
            />
            <MenuList>
              {userInfo && (
                <>
                  <MenuItem>{userInfo.name}</MenuItem>
                  <Divider />
                </>
              )}
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
      <Box display="none">
        <input
          type="file"
          name="file"
          ref={refFile}
          accept=".xlsx"
          onChange={async (el) => {
            console.log(el);
            const file = refFile.current.files[0];
            if (file) {
              try {
                setLoading(true);
                await updateGoodsViaExcel(file);
                toast({
                  title: "Выгрузка excel завершена",
                  status: "success",
                  duration: 25000,
                  isClosable: true,
                });
              } catch (e) {
                toast({
                  title: "Ошибка выгрузки excel",
                  status: "error",
                  duration: 25000,
                  isClosable: true,
                });
              } finally {
                setLoading(false);
                refFile.current.value = "";
              }
            }
          }}
        />
      </Box>
      <Divider />
    </>
  );
}
