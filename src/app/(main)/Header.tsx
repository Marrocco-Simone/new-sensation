"use client";

import Controller from "@/svg/Controller";
import Docs from "@/svg/Docs";
import Hamburger from "@/svg/Hamburger";
import Joystick from "@/svg/Joystick";
import Plus from "@/svg/Plus";
import Question from "@/svg/Question";
import { links } from "@/utils/links";
import React, { useState } from "react";

const links_svgs = {
  create: <Plus />,
  rules: <Docs />,
  elements: <Controller />,
  games: <Joystick />,
  tutorial: <Question />,
} as const;

function SideMenu({ text, hideMenu }: { text: string; hideMenu: () => void }) {
  return (
    <aside
      className="flex flex-col gap-10 text-4xl text-white h-screen w-2/7 fixed top-0 left-0 z-20"
      style={{ backgroundColor: "#146AB9" }}
    >
      <div className="h-32 flex items-center px-10">
        <button onClick={() => hideMenu()} className="h-20 aspect-square">
          <Hamburger />
        </button>
      </div>
      <nav className="flex flex-col">
        {Object.keys(links).map((link) => (
          <a
            href={link}
            key={link}
            className={`flex items-center gap-2 w-full px-10 py-6 ${
              links[link as keyof typeof links] === text ? "bg-orange-400" : ""
            } hover:bg-orange-300 ease-in-out duration-75`}
          >
            <div className="h-12 w-12">
              {links_svgs[link as keyof typeof links]}
            </div>
            <p className="uppercase">{links[link as keyof typeof links]}</p>
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default function Header({ text }: { text: string }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <>
      {showMenu && <SideMenu text={text} hideMenu={() => setShowMenu(false)} />}

      <header
        className="h-32 w-full flex items-center px-10 text-6xl text-white fixed top-0 left-0 z-10"
        style={{ backgroundColor: "#146AB9" }}
      >
        <button
          onClick={() => setShowMenu(true)}
          className="h-20 aspect-square"
        >
          <Hamburger />
        </button>
        {!showMenu && <h1 className="ml-10 uppercase">{text}</h1>}
        <h2 className="ml-auto">Smarter: the Rulebook</h2>
      </header>

      <div className="h-32 w-full" />
    </>
  );
}
