import { Input } from "@chakra-ui/react";
import { useEffect, useRef } from "react";

export default function NumberInput(props) {
  const inputRef = useRef(null);
  useEffect(() => {
    const handleWheel = (e) => e.preventDefault();
    inputRef.current.addEventListener("wheel", handleWheel);
    return () => {
      inputRef.current?.removeEventListener("wheel", handleWheel);
    };
  }, []);
  return (
    <Input
      {...props}
      min={0}
      type="number"
      step="0.01"
      ref={(ref) => {
        inputRef.current = ref;
        props?.register?.(ref);
      }}
    />
  );
}
