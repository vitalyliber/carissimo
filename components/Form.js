import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Textarea,
  FormErrorMessage,
  Button,
  Select,
} from "@chakra-ui/react";

export default function Form({ onSubmit, values }) {
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
          <FormHelperText>Например: Легковые/Грузовые/Иномарки</FormHelperText>
          <FormErrorMessage>
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="balance">
          <FormLabel>Остаток</FormLabel>
          <Input type='number' name="balance" ref={register()} />
          <FormErrorMessage>
            {errors.balance && errors.balance.message}
          </FormErrorMessage>
          <FormHelperText>Количество товара в наличие на слкаде</FormHelperText>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="price">
          <FormLabel>Цена</FormLabel>
          <Input type='number' name="price" ref={register()} />
          <FormErrorMessage>
            {errors.price && errors.price.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isDisabled={!values} mt={4} id="purchase_price">
          <FormLabel>Закупочная цена</FormLabel>
          <Input type='number' name="purchase_price" ref={register()} />
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
