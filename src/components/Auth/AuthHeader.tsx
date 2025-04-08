import { Text } from "@mantine/core";

export const AuthHeader = () => (
  <>
    <Text className="mb-2 text-[36px]" fw={400}>
      Welcome to <span className="text-primary font-semibold">ORCA</span>
    </Text>
    <p className="text-gray mb-6 text-[18px]">Enter your credentials below</p>
  </>
);