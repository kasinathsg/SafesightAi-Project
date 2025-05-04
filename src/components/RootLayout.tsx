'use client';

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from 'next/image';
import { RingLoader } from 'react-spinners';
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [fadeOutSplash, setFadeOutSplash] = useState(false);
  const router = useRouter();
  const pathname = usePathname(); 

  const menuItems = [
    { label: "Dashboard", href: "/" },
    { label: "Analytics", href: "/analytics" },
    { label: "About", href: "/about" },
  ];

  const activeTab = menuItems.find(item => item.href === pathname)?.label || "Dashboard";

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFadeOutSplash(true);
      setTimeout(() => setShowSplash(false), 1000); 
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showSplash) {
      const timeout = setTimeout(() => {
        const stepTwoExists = document.querySelector('#step-two-target');
        const stepThreeExists = document.querySelector('#step-three-target');

        if (stepTwoExists && stepThreeExists) {
          const driverObj = driver({
            showProgress: true,
            showButtons: ['next', 'previous'],
            steps: [
              {
                element: '#step-one-target',
                popover: {
                  title: 'Sidebar Navigation',
                  description: 'Use this panel to switch between Dashboard, Analytics, and About sections.',
                  side: 'right',
                  align: 'start',
                },
              },
              {
                element: '#step-two-target',
                popover: {
                  title: 'Control Buttons',
                  description: 'Use these filters and sorting options to refine the data displayed below.',
                  side: 'bottom',
                  align: 'start',
                },
              },
              {
                element: '#step-three-target',
                popover: {
                  title: 'Report Incident',
                  description: 'Click here to report a new AI safety incident. You can provide all relevant details.',
                  side: 'top',
                  align: 'start',
                },
              },
              {
                element: '#final-tour-step',
                popover: {
                  title: 'All Set to Go!',
                  description: "You're now ready to explore the application. Click around to get started.",
                  align: 'center',
                },
              }
            ],
          });

          driverObj.drive();
        }
      }, 1000); 

      return () => clearTimeout(timeout);
    }
  }, [showSplash]);

  return (
    <div className="bg-[#fcb75e] min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {showSplash && (
        <div className={`absolute inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-1000 ${fadeOutSplash ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <RingLoader 
            color="#4a3619" 
            size={80} 
            loading={true}
            speedMultiplier={1.5}
          />
        </div>
      )}

      <div className={`w-full max-w-[1450px] flex flex-col md:flex-row gap-8 md:gap-12 rounded-3xl overflow-hidden transition-opacity duration-1000 ${showSplash ? 'opacity-0' : 'opacity-100'}`}>
        <aside className="flex flex-col gap-8 min-w-[220px] bg-[#fcb75e] px-6 py-8 rounded-l-3xl z-10">
          <div className="relative">
            <div className="w-16 h-16 rounded-lg bg-[#4a3619] flex items-center justify-center overflow-hidden">
              <Image 
                src="https://res.cloudinary.com/dvdljupjx/image/upload/v1663236711/cld-sample.jpg" 
                alt="Illustration of a person wearing VR glasses" 
                width={64}
                height={64}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="absolute -top-1 -right-1 bg-gray-200 text-[10px] font-semibold text-black rounded-full w-5 h-5 flex items-center justify-center select-none">
              4
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold leading-none text-red">Kasinath S G</h2>
            <p className="text-xs text-[#4a3619] mt-1">kasinathsg@gmail.com</p>
          </div>

          <nav id="step-one-target" className="flex font-mono flex-col gap-3 font-bold text-lg leading-none items-start w-full">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => router.push(item.href)}
                className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ease-in-out transform ${
                  activeTab === item.label
                    ? "bg-white/70 text-[#4a3619] shadow-md scale-[1.02]"
                    : "hover:bg-white/30 hover:text-[#4a3619] scale-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div id="#final-tour-step" className="bg-white rounded-3xl flex-1 flex flex-col md:flex-row p-6 md:p-12 gap-8 md:gap-12 min-h-[670px]">
          {children}
        </div>
      </div>
    </div>
  );
}
