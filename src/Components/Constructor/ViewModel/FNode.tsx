import React from 'react';
import { FNodeProps } from '../../../Types/ViewmodelTypes';


export const FNode: React.FC<FNodeProps> = (NodeProps) => {
    const { isFram, frameType, children } = NodeProps;
    const nodeCls = `flex-col   border-8  border-black bg-[#0f66ad] justify-items-start`;
    const typeCls = {
        'win': `h-[${isFram ? `4em` : `10em`}] min-w-[5em] border-double `,
        'door': `h-[${isFram ? `4em` : `20em`}] min-w-[8em] border-solid `
    };
    const cls = [nodeCls, typeCls[frameType!]].join(' ');

    return (
        <div className={cls}
        >
            {<div className='text-white  mt-2 text-[.8rem] flex-col '>
                {children}
            </div>}
        </div>
    );
};
