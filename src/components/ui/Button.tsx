import Link from "next/link";
import { cn } from "@/lib/utils";

const variantClasses = {
  primary:
    "bg-navy-900 text-cream-50 hover:bg-navy-800 border border-navy-900",
  outline:
    "bg-transparent text-navy-900 border border-navy-900 hover:bg-navy-900 hover:text-cream-50",
  "outline-light":
    "bg-transparent text-cream-50 border border-cream-50/60 hover:bg-cream-50 hover:text-navy-900",
  light: "bg-cream-50 text-navy-900 hover:bg-cream-200 border border-cream-50",
  ghost: "bg-transparent text-navy-900 hover:text-gold-600",
} as const;

type ButtonVariant = keyof typeof variantClasses;

type CommonProps = {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-medium tracking-wide transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.97]";

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as ButtonAsButton)}>
      {children}
    </button>
  );
}
