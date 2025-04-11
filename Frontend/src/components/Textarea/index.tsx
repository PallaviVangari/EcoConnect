import React from "react";

export type TextareaProps = {
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    className?: string;
};

const Textarea: React.FC<TextareaProps> = ({ placeholder, value, onChange, className }) => {
    return (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={className}
        />
    );
};

export { Textarea };