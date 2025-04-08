import React from "react";

const shapes = {
  square: "rounded-[0px]",
  circle: "rounded-[50%]",
  round: "rounded-md",
} as const;

const variants = {
  fill: {
    indigo_50: "bg-indigo-50",
    black_900_01: "bg-black-900_01 text-white-a700",
    red_400: "bg-red-400",
    blue_A200: "bg-blue-a200",
    blue_gray_50: "bg-blue_gray-50",
    white_A700: "bg-white-a700",
    blue_gray_100: "bg-blue_gray-100 text-blue_gray-400_01",
    blue_A700_01: "bg-blue-a700_01 text-white-a700",
  },
  outline: {
    blue_A700_01: "border-blue-a700_01 border border-solid text-blue-a700_01",
  },
} as const;

const sizes = {
  md: "h-[34px]",
  "4xl": "h-[64px] px-2 text-[18px]",
  xl: "h-[48px] px-[34px] text-[16px]",
  "3xl": "h-[56px] px-3",
  xs: "h-[24px] px-1",
  "2xl": "h-[50px] px-3",
  lg: "h-[40px] px-[18px] text-[14px]",
  sm: "h-[28px] px-[34px] text-[14px]",
} as const;

type ButtonProps = Omit<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >,
  "onClick"
> &
  Partial<{
    className: string;
    leftIcon: React.ReactNode;
    rightIcon: React.ReactNode;
    onClick: () => void;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
  }>;

const Button: React.FC<React.PropsWithChildren<ButtonProps>> = ({
  children,
  className = "",
  leftIcon,
  rightIcon,
  shape,
  variant = "fill",
  size = "sm",
  color = "[#1D3016]",
  ...restProps
}) => {
  return (
    <button
      {...restProps}
      className={`${className} flex flex-row items-center justify-center text-center cursor-pointer whitespace-nowrap ${
        shape && shapes[shape]
      } ${size && sizes[size]} ${variant && variants[variant][color]}`}
    >
      {!!leftIcon && leftIcon}
      {children}
      {!!rightIcon && rightIcon}
    </button>
  );
};

export { Button };
