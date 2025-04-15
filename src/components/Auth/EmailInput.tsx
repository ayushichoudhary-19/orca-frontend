import CustomTextInput from "../Utils/CustomTextInput";

export const EmailInput = ({
  value,
  onChange,
  label = "Email",
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}) => (
  <div className="mt-4">
    <label className="block text-sm font-semibold text-darker mb-1">
      {label}
    </label>
    <CustomTextInput
      type="email"
      value={value}
      onChange={onChange}
      placeholder="your.email@example.com"
    />
  </div>
);
