'use client'

import React from "react";
import { deleteLocalStorageUserWithJwt } from "@/services/auth/localStorageService";
import { links, linksPermissions } from "@/utils/links";
import { useRouter } from "next/navigation";
import { Plus, Docs, Controller, Joystick, Question, Hamburger, Logout } from "../Icons";
import { useCustomUserContext } from "@/app/context/userStore";

const links_svgs = {
  create: <Plus />,
  rules: <Docs />,
  elements: <Controller />,
  games: <Joystick />,
//   tutorial: <Question />,
  vocabularies: <Docs />
} as const;

export function SideMenu({
  text,
  hideMenu
}: {
  text: string;
  hideMenu: () => void;
}) {
  const {user} = useCustomUserContext();
  const router = useRouter();

  if(!user) {
    return null;
  }
  console.log(user);

  return (
    <aside
      className="flex flex-col text-3xl text-white h-screen w-5/12 fixed top-0 left-0 z-20"
      style={{ backgroundColor: "#146AB9" }}
    >
      <div className="h-32 flex items-center px-10">
        <button onClick={() => hideMenu()} className="h-20 aspect-square mt-6">
          <Hamburger />
        </button>
      </div>
      <nav className="flex flex-col h-full my-10">
        {Object.keys(links).filter((link) => user?.permissions?.includes(linksPermissions[link as keyof typeof linksPermissions])).map((link) => (
          <a
            href={link}
            key={link}
            className={`flex items-center gap-2 w-full px-10 py-3 hover:bg-orange-300 ease-in-out duration-75 ${
              links[link as keyof typeof links] === text ? "bg-orange-400" : ""
            }`}
          >
            <div className="h-12 w-12">
              {links_svgs[link as keyof typeof links]}
            </div>
            <p className="uppercase">{links[link as keyof typeof links]}</p>
          </a>
        ))}
        <div
          className="flex items-center gap-2 w-full px-10 py-3 hover:bg-orange-300 ease-in-out duration-75 mt-auto cursor-pointer"
          onClick={() => {
            router.push("/api/auth/logout");
          }}
        >
          <div className="w-12">
            <Logout color="white" />
          </div>
          <p className="uppercase">Logout</p>
        </div>
      </nav>
    </aside>
  );
}
