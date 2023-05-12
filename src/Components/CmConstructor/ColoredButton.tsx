import React, { ButtonHTMLAttributes } from 'react';

type ButtonProps = {
    onClickFn: () => void;
    label: string;
    bgColor?: string;
    textcolor?: string;
    className?: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
};
export const ColoredButton = React.forwardRef((props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
    const styleCls = [
        `bg-${props.bgColor || 'slate-200'}`,
        `text-${props.textcolor || 'slate-900'}`,
        `border-2 border-blue-500 
         active:bg-blue-100
         active:border-red-600
          px-1 ring-4 rounded-lg`,
    ].join(' ');
    return (
        <button className={styleCls + ' ' + props.className}
            onClick={props.onClickFn}
            ref={ref}
            type={props.type || 'button'}
        >
            {props.label}
        </button>
    );
});
