import React from "react";

const sizes = {
    textxs: "text-[12px] font-normal",
    textsm: "text-[14px] font-normal",
    textmd: "text-[16px] font-normal",
    textlg: "text-[18px] font-normal",
    textxl: "text-[20px] font-normal",
};

export type TextProps = Partial<{
    className: string;
    as: any;
    size: keyof typeof sizes;
}> &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Text: React.FC<React.PropsWithChildren<TextProps>> = ({
                                                                children,
                                                                className,
                                                                as,
                                                                size = "textxs",
                                                                ...restProps
                                                            }) => {
    const Component = as || "p";
    return (
        <Component
            {...restProps}
            className={`text-blue_gray-900 font-inter ${className} ${sizes[size as keyof typeof sizes]}`}
        >
            {children}
        </Component>
    );
};

export { Text };