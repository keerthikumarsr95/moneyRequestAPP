import React from 'react';
import { Input } from 'antd';

export const InputComponent = (props) => {
  const className = `${props.className || ''}${props.hasError ? ' error' : ''}`
  return (
    <Input
      placeholder={props.placeholder}
      disabled={!!props.disabled}
      size="large"
      value={props.value}
      onChange={props.onChange}
      type={props.type || 'text'}
      name={props.name}
      className={className}
    />
  );
}