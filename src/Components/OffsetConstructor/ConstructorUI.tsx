import React, { useRef, useState, useId } from 'react'
import { _ID } from '../Constructor/ViewModel/ViewModelConst'
import { ICoords, IModelSize, OffsetFrameModel } from './Model/OffsetModel'

type Props = {}

export const ConstructorUI = (props: Props) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [model, setModel] = useState<OffsetFrameModel>(new OffsetFrameModel(6, 10))
  const [MStack, setMStack] = useState([] as OffsetFrameModel[])

  function addModelRight(newmodel: OffsetFrameModel) {
    const newOffset = { x: offset.x + newmodel.w, y: offset.y + newmodel.h }
    setOffset(prev => ({ ...newOffset }))
    setMStack(prev => [...prev, newmodel])
  }
  return (
    <div className='border bg-red-200 mt-14 p-2'>
      <h1 className='text-2xl text-center cursor-pointer'
        onClick={() => addModelRight(new OffsetFrameModel(10, 10))}
      >
        Container
      </h1>
      <div className='w-[30em] h-[30em] bg-red-500  outline-double outline-4 outline-black mt-2 relative'>
        {
          MStack.map(model =>
            <div className={`relative left-${offset.x} top-${offset.y}`} key={model.id}

            >{view(model)}</div>)

        }
      </div>
    </div>

  )
}

function view(size: IModelSize) {
  const id = _ID()
  const DIV = () => (
    <div key={id} className={`w-[${size.w}em] h-[${size.h}em]
    bg-green-500
    `}
    >w: {size.w} -- h: {size.h} -- ID: {id}
    </div>)
  return DIV()
}