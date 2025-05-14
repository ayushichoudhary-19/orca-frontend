"use client";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import { Button, Divider } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const slides = [
  {
    title: "Our user audition process focuses on highlighting our callers' strengths",
    desc: "Get to know each caller in more detail by hearing them introduce themselves, engage in roleplay for your campaign and field common objections that they may encounter.",
    img: "/pending-rep-1.png",
  },
  {
    title: "User Introductions",
    desc: "Callers will have a chance to introduce themself and share more about their sales background and experience.",
    img: "/pending-rep-2.png",
  },
  {
    title: "Roleplay the campaign script",
    desc: "Callers will use your campaign script and qualification criteria to book a meeting as if they are on a call with a lead.",
    img: "/pending-rep-3.png",
  },
  {
    title: "Field common objections",
    desc: "Callers will be given common objections that a lead may respond with and then the caller will have an opportunity to overcome the objection.",
    img: "/pending-rep-4.png",
  },
  {
    title: "That's it! Caller auditions will show on your dashboard under pending callers",
    desc: "Once a caller audition has been submitted, you'll have an opportunity to review, approve or block callers from participating.",
    img: "/pending-rep-5.png",
  },
];

export default function AuditionCarousel({ onClose }: { onClose: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel);
    },
  });

  const next = () => instanceRef.current?.next();
  const isLast = currentSlide === slides.length - 1;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="relative w-full max-w-3xl bg-[#0C0A1C] rounded-xl overflow-hidden shadow-xl">
        <Button className="absolute border size-[24px] rounded-md border-lighter bg-transparent top-4 hover:bg-lighter hover:text-black right-4 text-lighter z-10 p-0" onClick={onClose}>
          <IconX size={13}/>
        </Button>
        <div ref={sliderRef} className="keen-slider">
          {slides.map((slide, i) => (
            <div
              key={i}
              className="keen-slider__slide relative flex flex-col items-center justify-center h-[500px] text-white px-10 py-6"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.img})`,
                }}
              />
              <div className="absolute inset-0 backdrop-blur-[6px] bg-black/40" />
              <div className="relative z-10 flex flex-col items-center">
                <h2 className="text-3xl font-bold text-center">{slide.title}</h2>
                <p className="mt-4 text-lg text-center font-normal max-w-xl text-tinteddark1">{slide.desc}</p>
                <Divider c="#9E9DA4" className="w-[70%] my-6" />
                <Button 
                size="md"
                radius="lg"
                className="mt-6 bg-lighter text-primary font-normal h-[45px] w-[110px]" onClick={next}>
                  {isLast && i === slides.length - 1 ? "Finish" : "Next"}
                </Button>
              </div>
              <div className="absolute bottom-6 flex justify-center gap-2 z-10">
                {slides.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 w-2 rounded-full ${
                      currentSlide === idx ? "bg-primary" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}