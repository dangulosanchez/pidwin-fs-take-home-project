import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

interface NumericInputProps extends Omit<TextFieldProps, 'onChange' | 'value'> {
  value: string;
  onChange: (newValue: string) => void;
  maxValue?: number;
  minValue?: number;
}

const NumericInput: React.FC<NumericInputProps> = ({ minValue, maxValue, value, onChange, ...textFieldProps }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let digitsOnly = e.target.value.replace(/\D+/g, '');
    if(maxValue && +digitsOnly > maxValue){
        digitsOnly = String(maxValue);
    }
    if(minValue && +digitsOnly < minValue){
        digitsOnly = String(minValue);
    }
    onChange(digitsOnly);
  };

  return (
    <TextField
      {...textFieldProps}
      value={value}
      onChange={handleChange}
      inputProps={{
        inputMode: 'numeric',
        pattern: '[0-9]*',
        ...textFieldProps.inputProps,
      }}
    />
  );
};

export default NumericInput;
