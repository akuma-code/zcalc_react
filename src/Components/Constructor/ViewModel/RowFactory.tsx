import React from 'react';
import { ListProps } from '../../../Types/ModelsTypes';
import { IFrameType } from '../../../Types/ViewmodelTypes';
import { FNode } from './FNode';
import { _ID } from './ViewModel';



export class RowFactory {
    genNodes(row_id: string, isFram: boolean, ft: IFrameType) {
        const nodes = [] as { id: string; row_id: string; isFram: boolean; frameType: IFrameType; }[];
        return function (count: number) {
            while (count > 0) {
                nodes.push({ id: _ID(), row_id, isFram, frameType: ft });
                count--;
            }
            return nodes;
        };

    }

    NodesArray(row_id: string, cols: number, isFram: boolean, frameType: IFrameType) {
        const t = frameType;
        const ROW = this.genNodes(row_id, isFram, t);
        const NODES = ROW(cols);
        return (
            NODES.map((node, idx) => (<FNode {...node} key={node.id}>{idx + 1}</FNode>))
        );
    }

    Elems(row_id: string, cols: number, isFram: boolean, frameType: IFrameType) {

        const ROW = this.genNodes(row_id, isFram, frameType);
        const NODES = ROW(cols);
        function el(Elem: any): JSX.Element[] {


            return (NODES.map(node => (<Elem {...node} key={node.id} />)));
        }


        return el;
    }
    List<T>({ items, renderItem }: ListProps<T>) {
        return (
            <div>
                {items.map(renderItem)}
            </div>
        );
    }
}
