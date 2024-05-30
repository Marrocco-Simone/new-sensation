'use client'

import React from "react";
import { links } from "@/utils/links";
import Navbar from "@/components/Navbar";
import { withPageAuthorized } from "@/components/AuthValidation";

export default withPageAuthorized(function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='mb-44'>
      {/* <Navbar text={links.tutorial} /> */}
		{children}
    </div>
  );
},{
  returnTo: "/tutorial"
})
