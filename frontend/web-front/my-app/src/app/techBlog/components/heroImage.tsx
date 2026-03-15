import React from 'react';
import { Russo_One } from 'next/font/google';

const russoOne = Russo_One({
    weight: "400",
    subsets: ['latin'],
    display: 'swap',
});

type Props = {
    label: string;
};

const HeroImage = ({ label }: Props) => {
    return (
        <div className="relative md:w-3/5 mx-auto w-full">
            <img src="/topImg.png" alt="Top Image" className="w-full h-auto" />
            <span
                className={`absolute top-[30%] right-[25%] -translate-y-1/2 text-gray-800 font-bold text-lg md:text-2xl lg:text-3xl ${russoOne.className}`}
            >
                {label}
            </span>
        </div>
    );
};

export default HeroImage;
