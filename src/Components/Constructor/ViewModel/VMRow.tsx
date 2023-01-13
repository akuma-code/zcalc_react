import React, { useMemo } from 'react';
import { DataRow } from '../../../Models/DataModel';
import { VMRowProps } from '../../../Types/ViewmodelTypes';
import { IcMinus, IcPlus } from '../../Icons/IconsPack';
import { FNode } from './FNode';
import { RF } from './RowFactory';


//! NodesRow  *************************
export const VMRow: React.FC<VMRowProps> = (FC_Props) => {
    const { props: { isSelected, isOnEdit, isFram, frameType }, data } = FC_Props;

    // const NODES = RF.genNodes(data.row_id, isFram, frameType);
    const NodesRow = useMemo(() => {
        const dataRow = new DataRow(data.col, data.row_id)
        return RF.List({
            items: dataRow.nodes,
            renderItem: (nodeData) => <FNode {...nodeData} frameType={frameType} key={nodeData.id} isFram={isFram} />
        });
    }, [data.col, data.row_id, frameType, isFram]);

    const NodeControlButtonStack = useMemo(() => <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}>
        {data!.col > 1 &&
            <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
                onClick={() => FC_Props.remNode(data!.row_id)}
            >
                <IcMinus hw={6} />
            </button>}

        <button className='bg-[#08629e] p-1  m-1 rounded-md border-[#8a8a8a] ring-2 ring-red-700 ring-offset-1'
            onClick={() => FC_Props.addNode(data!.row_id)}
        >
            <IcPlus hw={6} />
        </button>


    </div>,
        [data.row_id, data.col]);

    const row_classlist = [`columns-${data.col}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ');



    return (
        <div className={` ${isSelected || !isOnEdit ? 'opacity-100' : '  opacity-50'} relative`}
        >
            <div className={row_classlist}>
                {NodesRow}
            </div>
            {isSelected && NodeControlButtonStack}

        </div>
    );
};
