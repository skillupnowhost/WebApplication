"use client";

import { cn } from "@/lib/cn";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMagnetic } from "@/hooks/useMagnetic";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "brand-gradient-bg text-white shadow-[var(--shadow-lift)] hover:brightness-110 hover:-translate-y-0.5",
  secondary:
    "bg-surface-2 text-foreground border border-border-soft hover:border-brand-400 hover:-translate-y-0.5",
  ghost: "bg-transparent text-foreground hover:bg-surface-2",
  outline:
    "bg-transparent border border-brand-400 text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-900/20",
  danger: "bg-danger text-white hover:brightness-110",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2 gap-1.5",
  md: "text-sm px-5 py-2.5 gap-2",
  lg: "text-base px-7 py-3.5 gap-2.5",
};

const base =
  "group inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 ease-out active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none cursor-pointer select-none";

function ButtonIcon({ icon }: { icon: ReactNode }) {
  if (!icon) return null;
  return (
    <span className="inline-flex transition-transform duration-300 ease-out group-hover:translate-x-1 group-active:translate-x-0">
      {icon}
    </span>
  );
}

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
  icon?: ReactNode;
};

// framer-motion's drag/animation event handlers collide in type with the
// native DOM ones of the same name — omit the ones Button has no use for.
type MotionConflictingProps = "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd";

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children" | MotionConflictingProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps & {
  href: string;
  target?: string;
  rel?: string;
};

const MotionLink = motion.create(Link);

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = "primary", size = "md", className, children, icon, ...rest } = props;
  const classes = cn(base, size === "lg" && "glow-ring", variantClasses[variant], sizeClasses[size], className);
  // Only large CTAs get the magnetic pull — keeps mousemove listeners off the
  // dozens of small buttons in tables/toolbars where it'd add cost for no effect.
  const magnetic = useMagnetic();
  const magneticProps =
    size === "lg"
      ? {
          onMouseMove: magnetic.onMouseMove,
          onMouseLeave: magnetic.onMouseLeave,
          style: { x: magnetic.x, y: magnetic.y },
          "data-cursor": "magnetic" as const,
        }
      : {};

  if ("href" in rest && rest.href) {
    const { href, target, rel } = rest as { href: string; target?: string; rel?: string };
    return (
      <MotionLink
        href={href}
        target={target}
        rel={rel}
        className={classes}
        ref={size === "lg" ? (magnetic.ref as React.Ref<HTMLAnchorElement>) : undefined}
        {...magneticProps}
      >
        <ButtonIcon icon={icon} />
        {children}
      </MotionLink>
    );
  }

  const { type = "button", ...domProps } = rest as Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    MotionConflictingProps
  >;
  return (
    <motion.button
      type={type}
      className={classes}
      ref={size === "lg" ? (magnetic.ref as React.Ref<HTMLButtonElement>) : undefined}
      {...magneticProps}
      {...domProps}
    >
      {icon}
      {children}
    </motion.button>
  );
}
