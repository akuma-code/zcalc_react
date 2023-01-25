import React, { useEffect, useMemo, useState } from 'react';
import { useHookContext } from '../../../Context/HookModelCTX';
import { DataNode, DataRow } from '../../../Models/DataModel';
import { VMRowProps } from '../../../Types/ViewmodelTypes';
import { IcMinus, IcPlus } from '../../Icons/IconsPack';
import { ISavedModelData } from '../ConstructorMainRedux';
import { FNode } from './FNode';
import { RF } from './RowFactory';
import ButtonFr from './UI/ButtonFr';


//! NodesRow  *************************
export const VMRow: React.FC<VMRowProps> = ({ props: { isSelected, isFram, frameType, fs_id }, data, FrameFN }) => {
    const dataRow = new DataRow(data.col, data.row_id)
    const { editInfo, setExport } = useHookContext()
    const isHighLighted = isSelected || !editInfo.isEditing

    const NodeControlButtonStack = useMemo(() =>
        <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}>
            {data!.col > 1 &&
                <ButtonFr
                    logo={<IcMinus hw={6} />}
                    bgColor='teal'
                    clickFn={() => FrameFN!.rem(data.row_id)} />}
            <ButtonFr
                logo={<IcPlus hw={6} />}
                bgColor='teal'
                clickFn={() => FrameFN!.add(data.row_id)} />
        </div>,
        [data.row_id, data.col]);

    const row_classlist = [`columns-${data.col}`, `gap-x-6 max-w-[55em] bg-[#ffffff] p-5 border-t-0 border-b-0 `].join(' ');



    const NodesRow = useMemo(() => {
        const dataRow = new DataRow(data.col, data.row_id)
        const nodes = dataRow.nodes!

        const child = (node: DataNode) =>
            <div className="flex flex-col align-middle">
                <div>id: {node.id}</div>
                <div>row: {node.row_id}</div>
            </div>


        return RF.List({
            items: nodes,
            renderItem: (nodeData) => <FNode {...nodeData} frameType={frameType} key={nodeData.id} isFram={isFram} >{child(nodeData)}</FNode>
        });
    }, [data.col, data.row_id, frameType, isFram]);



    return (
        <div className={` ${isHighLighted ? ' opacity-100 ' : '  opacity-50 '} relative `}
        >
            <div className={row_classlist}>
                {NodesRow}
            </div>
            {isSelected && NodeControlButtonStack}

        </div>
    );
};



function BTNStack(data: { row_id: string; col: number; }, FrameFN: { add: (row_id: string) => void; rem: (row_id: string) => void; rowUp: () => void; rowDown: (row_id?: string | undefined) => void; }): JSX.Element {
    return <div className={`absolute p-1 z-22  bottom-1 flex flex-col`}>
        {data!.col > 1 &&
            <ButtonFr
                logo={<IcMinus hw={6} />}
                bgColor='teal'
                clickFn={() => FrameFN!.rem(data.row_id)} />}
        <ButtonFr
            logo={<IcPlus hw={6} />}
            bgColor='teal'
            clickFn={() => FrameFN!.add(data.row_id)} />
    </div>;
}

