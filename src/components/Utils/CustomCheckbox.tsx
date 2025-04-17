"use client";

import { Checkbox, CheckboxProps } from "@mantine/core";

export default function CustomCheckbox(props: CheckboxProps) {
  return (
    <div onClick={() => props.onChange?.(({ target: { checked: !props.checked } } as React.ChangeEvent<HTMLInputElement>))} className="cursor-pointer">
      <Checkbox
        radius="xl"
        size="md"
        labelPosition="left"
        styles={{
          root: {
            height: "50px",
            border: "1px solid #E7E7E9",
            borderRadius: "10px",
            padding: "0 14px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          },
          body: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pointerEvents: "none",
          },
          inner: {
            marginLeft: 0,
          },
          input: {
            borderRadius: "6px",
          },
          icon: {
            width: "60%",
            height: "60%",
            strokeWidth: 1.5,
            transform: "scale(0.85)",
          },
          label: {
            fontSize: "14px",
            cursor: "pointer",
            padding: 0,
            margin: 0,
          },
        }}
        {...props}
      />
    </div>
  );
}
