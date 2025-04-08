import React from "react";

const sizes = {
    texts: "text-[14px] font-medium",
    textmd: "text-[16px] font-medium sm:text-[13px]",
    textlg: "text-[18px] font-medium sm:text-[15px]",
    headingxs: "text-[12px] font-semibold",
    headings: "text-[14px] font-semibold",
    headingmd: "text-[16px] font-semibold sm:text-[13px]",
    headinglg: "text-[24px] font-semibold md:text-[22px] sm:text-[20px]",
};

export type HeadingProps = Partial<{
    className: string;
    as: any;
    size: keyof typeof sizes;
}> &
    React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

const Heading: React.FC<React.PropsWithChildren<HeadingProps>> = ({
                                                                      children,
                                                                      className = '',
                                                                      size = "headingmd",
                                                                      as,
                                                                      ...restProps
                                                                  }) => {
    const Component = as || "h6";
    return (
        <Component
            {...restProps}
            className={`text-blue_gray-900 font-inter ${className} ${sizes[size]}`}
        >
            {children}
        </Component>
    );
};

export { Heading };