import { Subtract } from "@/components/Icons";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute top-0 right-0 h-screen w-screen -z-40 flex justify-end"
        style={{ backgroundColor: "#146AB9" }}
      >
        <Subtract />
      </div>
      <div className="h-screen relative flex flex-col items-center overflow-scroll">
        <header className="flex justify-between px-10 py-5 bg-transparent w-full">
          <h1 className="text-white text-4xl">SMARTER: The RuleCraft</h1>
          <button
            className="bg-orange-100 p-4 text-2xl hover:bg-orange-200 hover:scale-110 ease-in-out duration-100 rounded-xl"
            style={{ color: "#0E599D" }}
          >
            Go back to SMARTGAME
          </button>
        </header>
        <main className="w-1/2 h-full text-3xl text-center flex flex-col justify-center items-center">
          {children}
        </main>
      </div>
    </div>
  );
}
