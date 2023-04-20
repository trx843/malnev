import Checkbox from 'antd/lib/checkbox/Checkbox';
import React, { FC } from 'react';

export interface CheckboxGroupOption {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  value: string[];
  className?: string;
  onChange: (value: string[]) => void;
}

export const CheckboxGroup: FC<CheckboxGroupProps> = ({
  options,
  value,
  className,
  onChange,
}) => {
  const handleOnChange = (newValue: string) => {
    const valueCopy = [...value];
    const index = valueCopy.findIndex((item) => item === newValue);
    if (index !== -1) {
      valueCopy.splice(index, 1);
      return onChange(valueCopy);
    }
    return onChange([...valueCopy, newValue]);
  };

  return (
    <div className={className}>
      {options.map((option) => (
        <Checkbox
          disabled={option.disabled}
          checked={!!value.find((item) => item === option.value)}
          onChange={() => handleOnChange(option.value)}
          key={option.value}
          style={{ marginLeft: '0' }}
        >
          {option.label}
        </Checkbox>
      ))}
    </div>
  );
};
