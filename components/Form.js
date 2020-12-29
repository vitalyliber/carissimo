import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  Text,
  Textarea,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import useSWR from "swr";
import { endpoint } from "../api/credentials";
import fetcher from "../api/fetcher";

export default function Form({ onSubmit, values }) {
  const { data: categoriesData } = useSWR(
    `${endpoint}/car_goods/categories`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  const {
    handleSubmit,
    errors,
    register,
    formState,
    setError,
    setValue,
  } = useForm();
  useEffect(() => {
    if (values) {
      Object.keys(values).forEach((key) => setValue(key, values[key]));
    }
  }, [values]);
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit(setError))}>
        <FormControl
          isDisabled={!values}
          isInvalid={errors.name}
          id="name"
          isRequired
        >
          <FormLabel htmlFor="name">Наименование</FormLabel>
          <Input name="name" ref={register({ required: true })} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isDisabled={!values}
          isInvalid={errors.article_code}
          mt={4}
          id="article_code"
        >
          <FormLabel>Артикул</FormLabel>
          <Input name="article_code" ref={register()} />
          <FormHelperText>Например: АС-317</FormHelperText>
          <FormErrorMessage>
            {errors.article_code && errors.article_code.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="oem_article_code">
          <FormLabel>Оригинальный Артикул</FormLabel>
          <Input name="oem_article_code" ref={register()} />
          <FormErrorMessage>
            {errors.oem_article_code && errors.oem_article_code.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="producer">
          <FormLabel>Производитель</FormLabel>
          <Input name="producer" ref={register()} />
          <FormHelperText>Например: Grass</FormHelperText>
          <FormErrorMessage>
            {errors.producer && errors.producer.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="category">
          <FormLabel>Категория</FormLabel>
          <Input name="category" ref={register()} />
          <FormHelperText>
            Выберите:{" "}
            {categoriesData?.map((category, index) => (
              <>
                {index !== 0 ? " / " : ""}
                <Text
                  onClick={() => setValue("category", category)}
                  cursor="pointer"
                  color="blue.500"
                  display="inline"
                >
                  {category}
                </Text>
              </>
            ))}
          </FormHelperText>
          <FormErrorMessage>
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="balance">
          <FormLabel>Остаток</FormLabel>
          <Input min={0} type="number" name="balance" ref={register()} />
          <FormErrorMessage>
            {errors.balance && errors.balance.message}
          </FormErrorMessage>
          <FormHelperText>Количество товара в наличие на слкаде</FormHelperText>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="price">
          <FormLabel>Цена</FormLabel>
          <Input min={0} type="number" name="price" ref={register()} />
          <FormErrorMessage>
            {errors.price && errors.price.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="purchase_price">
          <FormLabel>Закупочная цена</FormLabel>
          <Input min={0} type="number" name="purchase_price" ref={register()} />
          <FormErrorMessage>
            {errors.purchase_price && errors.purchase_price.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="package">
          <FormLabel>Единица измерения</FormLabel>
          <Input name="package" ref={register()} />
          <FormHelperText>Например: Шт/Упаковка/Короб/Палета</FormHelperText>
          <FormErrorMessage>
            {errors.package && errors.package.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="comment">
          <FormLabel>Комментарий</FormLabel>
          <Textarea ref={register()} name="comment" size="sm" />
          <FormHelperText>Замечания о товаре</FormHelperText>
        </FormControl>
        <Button
          mb={4}
          isFullWidth
          mt={4}
          colorScheme="teal"
          isLoading={formState.isSubmitting}
          type="submit"
        >
          Сохранить
        </Button>
      </form>
    </>
  );
}
