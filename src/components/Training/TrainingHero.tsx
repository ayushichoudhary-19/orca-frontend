import Image from "next/image";
import { Button, Text } from "@mantine/core";

export const TrainingHero = () => {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden mb-10 h-[280px]">
      <Image
        src="/trainingHero.png"
        alt="Training Hero"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-12">
        <Text className="text-white font-bold text-[32px] md:text-3xl mb-3 max-w-2xl">
          Set up your knowledge-base & educate your reps
        </Text>
        <Text className="text-tinteddark1 font-normal text-md max-w-2xl mb-5 leading-relaxed">
          Curate and manage the training material that your campaign callers will read in order to better understand your brand, company and product goals. Share data and insights into your ideal customers and any tips and tricks that will help callers connect with prospects.
        </Text>
        <Button radius="12px" className="w-fit font-normal text-[16px] px-[20px] py-[13px] h-[46px]">
          Watch Our Training Setup Video
        </Button>
      </div>
    </div>
  );
};
