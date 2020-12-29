import { useEffect, useRef, useState } from "react";
import moment from "moment";
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
  Tooltip,
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
import { generateExcelFile, getSum, updateGoodsViaExcel } from "../api/goods";

export default function Header({ category = "" }) {
  const [checkingGeneration, setCheckingGeneration] = useState(false);
  const refFile = useRef(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const { data } = useSWR(
    `${endpoint}/car_goods/sum?category=${category}`,
    (url) => getSum(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: userInfo } = useSWR(
    `${endpoint}/car_goods/user_info`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const { data: generationStatus, mutate: mutateGenerationStatus } = useSWR(
    `${endpoint}/car_goods/generation_status`,
    fetcher,
    {
      refreshInterval: checkingGeneration ? 3000 : 0,
    }
  );
  useEffect(() => {
    const status = generationStatus?.processing_status;
    if (
      status?.length > 0 &&
      !["new_processing", "in_processing"].includes(
        generationStatus?.processing_status
      )
    ) {
      setCheckingGeneration(false);
    }
  }, [generationStatus?.processing_status]);
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
              <Tooltip label="Добавить товар" aria-label="A tooltip">
                <IconButton
                  colorScheme="teal"
                  aria-label="Добавить товар"
                  icon={<AddIcon />}
                />
              </Tooltip>
            </a>
          </Link>
          <Link href="/actions">
            <a>
              <Tooltip label="История изменений" aria-label="A tooltip">
                <IconButton
                  colorScheme="teal"
                  aria-label="История изменений"
                  icon={<TimeIcon />}
                />
              </Tooltip>
            </a>
          </Link>
          {userInfo?.admin && (
            <Tooltip
              label="Выгрузить товары на портал из Excel"
              aria-label="A tooltip"
            >
              <IconButton
                colorScheme="red"
                aria-label="Выгрузить товары на портал из Excel"
                onClick={async () => {
                  await refFile.current.click();
                }}
                isLoading={loading}
                icon={<RepeatIcon />}
              />
            </Tooltip>
          )}
          <Menu>
            <Tooltip
              label="Скачать все товары в формате Excel"
              aria-label="A tooltip"
            >
              <MenuButton
                isLoading={["new_processing", "in_processing"].includes(
                  generationStatus?.processing_status
                )}
                colorScheme="blue"
                aria-label="Скачать все товары в формате Excel"
                as={IconButton}
                icon={<DownloadIcon />}
              />
            </Tooltip>
            <MenuList>
              <MenuItem
                onClick={async () => {
                  try {
                    await generateExcelFile();
                    mutateGenerationStatus(
                      async (dataEl) => ({
                        ...dataEl,
                        processing_status: "new_processing",
                      }),
                      false
                    );
                    setCheckingGeneration(true);
                    toast({
                      title: "Начат процесс создания Excel файла",
                      status: "success",
                      duration: 25000,
                      isClosable: true,
                    });
                  } catch (e) {
                    toast({
                      title: "Ошибка генерации файла",
                      status: "error",
                      duration: 25000,
                      isClosable: true,
                    });
                  }
                }}
              >
                Сгенерировать Excel
              </MenuItem>
              <Divider />
              {generationStatus?.url && (
                <a href={`${endpoint}/${generationStatus?.url}`}>
                  <MenuItem>
                    <Box fontSize="14px">
                      <Text fontSize="16px">Скачать Excel</Text>
                      <Text color="gray.500">
                        {moment(generationStatus?.updated_at).fromNow()}
                      </Text>
                    </Box>
                  </MenuItem>
                </a>
              )}
            </MenuList>
          </Menu>

          <Menu>
            <Tooltip label="Настройки" aria-label="A tooltip">
              <MenuButton
                as={IconButton}
                aria-label="Настройки"
                icon={<SettingsIcon />}
              />
            </Tooltip>
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
