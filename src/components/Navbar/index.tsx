"use client";

import React, { useState } from "react";
import { SideMenu } from "../Menu";
import { Hamburger } from "../Icons";

export default function Navbar({ text }: { text: string }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {showMenu && <SideMenu text={text} hideMenu={() => setShowMenu(false)} />}

      <header
        className="h-24 w-full flex items-center px-10 text-4xl text-white fixed top-0 left-0 z-10"
        style={{ backgroundColor: "#146AB9" }}
      >
        <button
          onClick={() => setShowMenu(true)}
          className="h-20 aspect-square"
        >
          <Hamburger />
        </button>
        {!showMenu && <h1 className="ml-10 uppercase lg:text-4xl md:text-2xl text-[75%]">{text}</h1>}
        <h2 className="ml-auto lg:text-4xl md:text-3xl text-[0px]">SMARTER: The RuleCraft</h2>
      </header>

      <div className="h-24 w-full" />
    </>
  );
}