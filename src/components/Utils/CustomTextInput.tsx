import React from "react";

type CustomTextInputProps = {
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  required = false,
  className = "",
  ...props
}) => {
  const validTypes = ["text", "email", "password", "number", "search", "tel", "url"];
  const inputType = validTypes.includes(type) ? type : "text";

  const defaultStyles = `
  w-full
  bg-white
  h-14
  px-4
  py-3
  text-[14px]
  text-tinteddark8
  placeholder-tintedgray
  border
  border-softgray
  border-solid
  rounded-md
  focus:outline-none
  focus:ring-0
  focus:border-softgray
  appearance-none
  shadow-none
  transition-colors
`;


  const combinedClassName = `${defaultStyles} ${className}`;

  return (
    <input
      type={inputType}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={combinedClassName}
      {...props}
    />
  );
};

export default CustomTextInput;