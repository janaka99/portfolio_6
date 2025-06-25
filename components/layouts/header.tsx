import React, { ReactNode } from "react";
import Container from "./container";
import Logo from "../logo";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function Header() {
  return (
    <div className="w-full h-24 flex items-center">
      <Container className="w-full hidden lg:flex justify-between  py-6">
        <Logo />
        <div className="flex gap-6">
          <NavLink href="#projects">Work</NavLink>
          <NavLink href="#experience">Experience</NavLink>
          <NavLink href="#specializations">Specializations</NavLink>
          <Button variant="darkBlue">Contact Me</Button>
        </div>
      </Container>
      <Container className="w-full flex items-center justify-between lg:hidden ">
        <Logo />
        <Sheet>
          <SheetTrigger asChild>
            <button className="flex flex-col justify-start gap-[6px] cursor-pointer h-fit">
              <span className="w-8 rounded-sm h-[3px] bg-white"></span>
              <span className="w-6 rounded-sm h-[3px] bg-white"></span>
              <span className="w-8 rounded-sm h-[3px] bg-white"></span>
            </button>
          </SheetTrigger>
          <SheetContent className="bg-black">
            <SheetHeader></SheetHeader>
            <div className="flex flex-col gap-6 h-full justify-center items-center ">
              <NavLink className="text-3xl" href="#work">
                Work
              </NavLink>
              <NavLink className="text-3xl" href="#experience">
                Experience
              </NavLink>
              <NavLink className="text-3xl" href="#skills">
                Skills
              </NavLink>
              <NavLink className="text-3xl" href="#testimonials">
                Testimonials
              </NavLink>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </div>
  );
}

const NavLink = ({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) => {
  return (
    <Link
      href={`${href}`}
      className={twMerge(
        "capitalize flex items-center text-muted-foreground hover:text-primary transition  duration-150",
        className
      )}
    >
      {children}
    </Link>
  );
};
