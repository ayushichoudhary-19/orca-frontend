import { useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import CustomTextInput from "../Utils/CustomTextInput";

export const PasswordInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div>
     <label className="block text-sm font-semibold text-darker mb-1">
      Password
    </label>
      <div className="relative">
        <CustomTextInput
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder="Input your password"
          required
          className="pr-12"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute top-0 right-0 h-full w-10 flex items-center justify-center bg-white rounded-r-md border
  border-softgray
  border-solid
  rounded-md
  border-l-0
  rounded-tl-none
  rounded-bl-none
  hover:cursor-pointer
  appearance-none
  shadow-none"
        >
          {visible ? <IconEyeOff size={25} color="#292D32"/> : <IconEye size={25} color="#292D32"/>}
        </button>
      </div>
    </div>
  );
};
