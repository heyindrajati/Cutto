/* eslint-disable @next/next/no-img-element */
import { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: "scissors" | "download";
  busy?: boolean;
  children: ReactNode;
};

/** Figma "Button": main gradient, 56px tall, radius 20, hard purple ledge. Presses down on click. */
export default function PrimaryButton({ icon, busy, children, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`flex h-14 shrink-0 items-center justify-center gap-2 rounded-[20px] bg-main-grad px-[26px] font-body text-base font-bold uppercase leading-6 tracking-[0.49px] text-white shadow-button outline-none transition-[transform,box-shadow,filter] hover:brightness-105 focus-visible:ring-4 focus-visible:ring-brand-purple/30 active:translate-y-2 active:shadow-none disabled:cursor-not-allowed disabled:hover:brightness-100 disabled:active:translate-y-0 disabled:active:shadow-button ${className}`}
    >
      {busy ? (
        <span className="h-5 w-5 animate-spin rounded-full border-[2.5px] border-white/40 border-t-white" aria-hidden />
      ) : (
        icon && <img src={`/icons/${icon}.svg`} alt="" width={20} height={20} className="h-5 w-5" />
      )}
      {children}
    </button>
  );
}
