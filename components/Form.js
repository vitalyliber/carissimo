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
import { createGood } from "../api/goods";

export default function Form() {
  const { handleSubmit, errors, register, formState, setError } = useForm();
  async function onSubmit(values) {
    try {
      await createGood(values);
    } catch (e) {
      Object.keys(e.response.data).forEach((key) =>
        setError("key", { type: "manual", message: e.response.data[key][0] })
      );

      console.log("Errors", e.response.data);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.name} id="name" isRequired>
          <FormLabel htmlFor="name">Наименование</FormLabel>
          <Input name="name" ref={register({ required: true })} />
          <FormErrorMessage>
            {errors.name && errors.name.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl
          isInvalid={errors.article_code}
          mt={4}
          id="article_code"
          isRequired
        >
          <FormLabel>Артикул</FormLabel>
          <Input name="article_code" ref={register({ required: true })} />
          <FormHelperText>Например: АС-317</FormHelperText>
          <FormErrorMessage>
            {errors.article_code && errors.article_code.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={4} id="good_code" isRequired>
          <FormLabel>Код товара</FormLabel>
          <Input name="good_code" ref={register({ required: true })} />
          <FormHelperText>Например: 071017</FormHelperText>
          <FormErrorMessage>
            {errors.good_code && errors.good_code.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={4} id="producer" isRequired>
          <FormLabel>Производитель</FormLabel>
          <Input name="producer" ref={register({ required: true })} />
          <FormHelperText>Например: Grass</FormHelperText>
          <FormErrorMessage>
            {errors.producer && errors.producer.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={4} id="price" isRequired>
          <FormLabel>Цена</FormLabel>
          <NumberInput defaultValue={0} min={0}>
            <NumberInputField name="price" ref={register({ required: true })} />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormErrorMessage>
            {errors.price && errors.price.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl mt={4} id="bar_code">
          <FormLabel>Штрихкод</FormLabel>
          <Input name="bar_code" />
          <FormHelperText>Например: 234002634987</FormHelperText>
        </FormControl>
        <FormControl mt={4} id="balance">
          <FormLabel>Остаток</FormLabel>
          <NumberInput defaultValue={0} min={0}>
            <NumberInputField
              name="balance"
              ref={register({ required: true })}
            />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <FormHelperText>Количество товара в наличие на слкаде</FormHelperText>
        </FormControl>
        <FormControl mt={4} id="package">
          <FormLabel>Единица измерения</FormLabel>
          <Select ref={register({ required: true })} name="package" isRequired>
            <option>шт</option>
          </Select>
        </FormControl>
        <FormControl mt={4} id="comment">
          <FormLabel>Комментарий</FormLabel>
          <Textarea name="comment" size="sm" />
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
          Создать
        </Button>
      </form>
    </>
  );
}
