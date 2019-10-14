import React, { PropsWithoutRef, useCallback, useState } from 'react';


interface NumberFieldProps {
  value: number
  min: number
  max: number
  placeholder: string
  onChange: (val: number) => void
}

const numbers = /^\d+$/;
export default function NumberField(props: PropsWithoutRef<NumberFieldProps>) {
  const [value, setValue] = useState<number>(props.value);
  const [error, setError] = useState<boolean>(false);
  const handlerChangeWidth = useCallback((event) => {
    const val = event.target.value;
    if (val === '') {
      setValue(val);
      setError(false);
    } else if (numbers.test(val)) {
      setValue(val);
      let n = Number(val);
      if (props.min <= n && n <= props.max) {
        props.onChange(n);
        setError(false);
      } else {
        setError(true);
      }
    }
  }, [props.onChange, props.min, props.max]);
  return (
    <input
      type="text"
      placeholder={ props.placeholder }
      onChange={ handlerChangeWidth }
      value={ value }
    />
  );
}
