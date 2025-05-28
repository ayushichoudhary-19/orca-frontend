import React from "react";

type CustomTextInputProps = {
  type?: React.HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  multiline?: boolean;
  rows?: number;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
  React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  type = "text",
  value = "",
  onChange,
  placeholder = "",
  required = false,
  className = "",
  multiline = false,
  rows = 4,
  leftSection,
  rightSection,
  ...props
}) => {
  const validTypes = ["text", "email", "password", "number", "search", "tel", "url"];
  const inputType = validTypes.includes(type) ? type : "text";

  const baseStyles = `
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
    resize-none
  `;

  const combinedClassName = `${baseStyles} ${className}`;

  const inputContent = multiline ? (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={combinedClassName}
      rows={rows}
      {...props}
    />
  ) : (
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

  return (
    <div className="relative w-full">
      {leftSection && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
          {leftSection}
        </div>
      )}
      {inputContent}
      {rightSection && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightSection}
        </div>
      )}
    </div>
  );
};

export default CustomTextInput;
