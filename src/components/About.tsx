'use client';

import Image from 'next/image';
import React from 'react';
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion'; 

const VisualExperience: React.FC = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6, ease: 'easeOut' }} 
      className="flex flex-col md:flex-row justify-between items-center w-full md:w-[65vw] mx-auto px-4 md:px-0 py-8"
    >
      <div className="w-full md:w-2/5 mb-8 md:mb-0 flex flex-col md:items-start items-center text-center md:text-left">
        <p className="text-gray-500 text-xs tracking-widest mb-2 select-none">
          ABOUT THE APPLICATION
        </p>
        <h1 className="text-purple-500 font-extrabold text-4xl md:text-5xl leading-tight md:leading-[3.5rem] mb-4 select-none">
          AI Safety
          <br />
          Incident Tracker
        </h1>
        <p className="text-gray-600 font-mono text-sm max-w-md mb-6 select-none">
          This application allows users to view and log AI safety incidents, supporting HumanChain&apos;s mission to build a safer, more trustworthy digital world. 
          Users can explore a list of AI safety incidents, each displaying key information such as the incident&apos;s Title, Severity level, and Reported Date. 
        </p>

        <button
          type="button"
          className="bg-purple-500 text-white rounded-sm px-6 py-2 text-sm font-semibold hover:bg-purple-600 transition select-none"
          onClick={() => {
            router.push('/');
          }}
        >
          VIEW INCIDENTS
        </button>
      </div>

      <div className="relative w-full md:w-1/2 h-[300px] sm:h-[350px] md:h-[500px] flex justify-center">
        <Image
          src="https://storage.googleapis.com/a1aa/image/f36c96ce-95bf-4f3e-0a9d-4fbbe83b0720.jpg"
          alt="Illustration of a person wearing VR glasses"
          layout="fill"
          objectFit="contain"
          priority
          className="object-contain"
        />
      </div>
    </motion.div>
  );
};

export default VisualExperience;
