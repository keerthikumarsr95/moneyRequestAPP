import React from 'react';
import { Button } from 'antd';

export const ButtonComponent = (props) => (
  <Button
    type={props.type}
    onClick={props.onClick}
    disabled={!!props.disabled}
    style={props.style}
    className={props.className}
  >
    {props.children || props.name}
  </Button>
);
