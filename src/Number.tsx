import React, { useState, useEffect } from "react";
import { Controller, Control } from "react-hook-form";

interface NumberInputProps {
  control: Control;
  initialValue?: number | null;
}

const NumberInput: React.FC<
  NumberInputProps &
    (
      | { mode: "integer" }
      | { mode: "decimal"; decimalPlaces?: number }
      | { mode: "whole" }
    )
> = ({ control, mode, initialValue = null, decimalPlaces = 2 }) => {
  const [inputValue, setInputValue] = useState<string | null>(null);

  useEffect(() => {
    if (
      initialValue !== null &&
      !isValidInitialValue(initialValue, mode, decimalPlaces)
    ) {
      setInputValue(null);
    } else if (initialValue !== null) {
      setInputValue(initialValue.toString());
    }
  }, [initialValue, mode, decimalPlaces]);

  const isValidInitialValue = (
    value: number,
    mode: string,
    decimalPlaces: number
  ): boolean => {
    if (mode === "integer") {
      return Number.isInteger(value);
    }
    if (mode === "whole") {
      return Number.isInteger(value) && value >= 0;
    }
    if (mode === "decimal") {
      if (typeof value !== "number" || isNaN(value)) return false;
      const decimalPartLength = value.toString().split(".")[1]?.length || 0;
      return decimalPartLength <= decimalPlaces;
    }
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field) => {
    let value = e.target.value;

    // Check for empty input
    if (!value.trim()) {
      field.onChange(null);
      setInputValue(null);
      return;
    }

    // Check for integer mode
    if (mode === "integer") {
      // Allow digits and optional minus sign, but remove leading minus if present
      value = value.replace(/^(-)?0*(\d+)/, "$1$2");
      value = value.replace(/[^-0-9]/g, "");
    }

    // Check for decimal mode
    if (mode === "decimal") {
      // Allow digits, optional minus sign, and decimal point
      value = value.replace(/^(-)?0*(\d+)?(\.\d*)?$/, "$1$2$3");
      value = value.replace(/[^\d.-]/g, "");

      const parts = value.split(".");
      if (parts.length > 1) {
        // Limit decimal places to the specified number
        value = `${parts[0]}.${parts[1].slice(0, decimalPlaces)}`;
        // Remove leading decimal point if present
        if (value.charAt(0) === ".") {
          value = "0" + value;
        }
      }
    }

    // Check for whole mode
    if (mode === "whole") {
      // Allow digits and an optional minus sign, but remove leading minus if present
      value = value.replace(/^(-)?0*(\d+)/, "$1$2");
      value = value.replace(/[^0-9]/g, "");
      // Ensure the value is not negative
      if (value.charAt(0) === "-") {
        value = "";
      }
    }

    // Convert value to a number if it's a valid number
    const parsedValue = parseFloat(value);
    // Check if parsedValue is a valid number
    if (!isNaN(parsedValue)) {
      // Update the field value using React Hook Form's onChange
      field.onChange(parsedValue);
    } else {
      // If it's not a valid number or empty, update with null
      field.onChange(null);
    }

    // Update the input value
    setInputValue(value);
  };

  return (
    <>
      <Controller
        name="numberInput"
        control={control}
        render={({ field }) => (
          <input
            {...field}
            type="text"
            value={inputValue === null ? "" : inputValue}
            onChange={(e) => {
              handleInputChange(e, field);
            }}
            placeholder={
              mode === "integer"
                ? "Enter Integer"
                : mode === "decimal"
                ? `Enter Decimal (Up to ${decimalPlaces} decimal places)`
                : "Enter Whole Number"
            }
          />
        )}
      />
    </>
  );
};

export default NumberInput;
