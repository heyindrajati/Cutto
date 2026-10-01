"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  icon?: ReactNode;
};

export default function GradientButton({ children, icon, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`group relative inline-flex w-full items-center justify-center gap-2 rounded-[20px] bg-brand-gradient px-[26px] py-4 font-display text-base font-bold uppercase tracking-[0.8px] text-white shadow-button transition-transform active:translate-y-2 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
