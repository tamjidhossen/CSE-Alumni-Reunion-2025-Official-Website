import React, { forwardRef } from "react";
import { Input } from "@/components/ui/input";

const NumberInput = forwardRef((props, ref) => {
  return (
    <Input
      type="number"
      className="[appearance:textfield] [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
      ref={ref} // Pass ref to the underlying Input
      {...props}
    />
  );
});

export default NumberInput;
