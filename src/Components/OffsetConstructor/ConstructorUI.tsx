import React, { useRef, useState, useId } from 'react'
import { DivProps } from '../../Types'
import ButtonFr from '../Constructor/ViewModel/UI/ButtonFr'
import { _ID } from '../Constructor/ViewModel/ViewModelConst'
import { IcFrameRight, IcFrameUp, IcPlus, IcReset } from '../Icons/IconsPack'
import { ICoords, IModelSize, OffsetCanvas, OffsetFrameModel } from './Model/OffsetModel'

type Props = {}

export const ConstructorUI = (props: Props) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [model, setModel] = useState<OffsetFrameModel>(new OffsetFrameModel(6, 10))
  const [MStack, setMStack] = useState([] as OffsetFrameModel[])
  const [Canvas, setCanvas] = useState(new OffsetCanvas())


  function restart() {
    Canvas.reset()
    Canvas.init()
    updateCanvas()
  }
  function updateCanvas() {
    setCanvas(prev => prev.getCopy())

  }

  function addR() {
    Canvas.appendRight(3, 5)
    updateCanvas()
  }
  function addT() {
    Canvas.appendTop(3, 5)
    updateCanvas()
  }
  return (
    <div className='border bg-red-200 mt-14 p-2'>
      <h1 className='text-2xl text-center cursor-pointer'
      // onClick={() => { }}
      >
        Container
      </h1>
      <div>
        <ButtonFr logo={<IcPlus hw={6} />} bgColor='teal' clickFn={() => restart()} >INIT</ButtonFr>
        <ButtonFr logo={<IcFrameRight hw={6} />} bgColor='red' clickFn={() => addR()} >AppendR</ButtonFr>
        <ButtonFr logo={<IcFrameUp hw={6} />} bgColor='green' clickFn={() => addT()} >Reset</ButtonFr>
      </div>
      <div className='w-[30em] h-[30em] bg-red-500  outline-double outline-4 outline-black mt-2 relative'>
        {
          Canvas.VMs.map(m =>
            <OffModel {...m} key={m.id} pos={m.pos}
            // className={`relative left-${m.pos?.x} top-${m.pos?.y}`} key={model.id}
            />
          )


        }
        {/* <OffModel w={3} h={4} off={{ x: 0, y: 0 }} /> */}
      </div>
    </div>

  )
}


const OffModel: React.FC<{ w: number, h: number, pos?: ICoords } & DivProps> = (props) => {
  const id = _ID()
  const { w, h, pos } = props
  return (
    <div className={`relative  left-[${pos?.x}em] top-[${pos?.y}em] block w-fit`} key={id}  >
      <div className={`w-[${w}em] h-[${h}em] bg-green-500 absolute outline outline-slate-500`}></div>
    </div>
  )
}