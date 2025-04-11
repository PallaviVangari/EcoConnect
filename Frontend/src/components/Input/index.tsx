import React from "react";
import classnames from 'classnames';

const shapes = {
    round: "rounded-md",
} as const;

const variants = {
    fill: {
        blue_gray_50: "bg-blue_gray-50",
        white_A700: "bg-white-a700",
    },
} as const;

const sizes = {
    xs: "h-[44px] pl-[18px] pr-[34px] text-[16px]",
    sm: "h-[52px] px-3.5 text-[16px]",
} as const;

type InputProps = Omit<React.ComponentPropsWithoutRef<"input">, "prefix" | "size"> & Partial<{
    label: string;
    prefix: React.ReactNode;
    suffix: React.ReactNode;
    shape: keyof typeof shapes;
    variant: keyof typeof variants | null;
    size: keyof typeof sizes;
    color: string;
}>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
         className = "",
         name = '',
         placeholder = '',
         type = "text",
         label = "",
         prefix,
         suffix,
         onChange,
         shape,
         variant = "fill",
         size = "sm",
         color = "white_A700",
         ...restProps
     }, ref) => {

        const inputClassName = classnames(
            shape && shapes[shape],
            variant && variants[variant]?.[color as keyof typeof variants[typeof variant]],
            size && sizes[size],
            className // allows overriding or adding extra classes by consumer
        );

        return (
            <label className={`flex items-center justify-center cursor-text ${className}`}>
                {label && <span>{label}</span>}
                {prefix && <span>{prefix}</span>}
                <input
                    ref={ref}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={inputClassName}
                    {...restProps}
                />
                {suffix && <span>{suffix}</span>}
            </label>
        );
    }
);

export { Input };