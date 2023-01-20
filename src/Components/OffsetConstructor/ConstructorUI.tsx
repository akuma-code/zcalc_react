import React, { useEffect, useState } from 'react'
import ButtonFr from '../Constructor/ViewModel/UI/ButtonFr'
import { IcFrameRight, IcFrameUp, IcReset } from '../Icons/IconsPack'
import { OffsetCanvas } from './Model/OffsetModel'
import { Blueprint, BlueprintModel } from "./Model/BlueprintModel"

type Props = {}

export const ConstructorUI = () => {
  const [BP, setBp] = useState<Blueprint>(new Blueprint())
  const [Canvas, setCanvas] = useState(new OffsetCanvas())


  function restart() {
    Canvas.reset()
    Canvas.init()
    BP.init && BP.init(4, 6)
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

  function updBP() {
    setBp(prev => prev.HandleUpdate())
  }

  function bpmCb(newmod: BlueprintModel) {
    setBp(BP.add(newmod))
    updBP()
  }
  useEffect(() => {
    const off = BP.maxX()
    console.log('off', off)

  }, [BP.bpModels])


  return (
    <div className='border bg-red-200 mt-14 p-2'>
      <h1 className='text-2xl text-center'
      // onClick={() => { }}
      >
        Container
      </h1>
      <div>
        <ButtonFr logo={<IcReset hw={6} />} bgColor='teal' clickFn={() => restart()} >INIT</ButtonFr>
        <ButtonFr logo={<IcFrameRight hw={6} />} bgColor='red' clickFn={() => addR()} >AppendR</ButtonFr>
        <ButtonFr logo={<IcFrameUp hw={6} />} bgColor='green' clickFn={() => addT()} >Reset</ButtonFr>
      </div>
      <div className='w-[30em] h-[30em] bg-red-500  outline-double outline-4 outline-black mt-2 relative'>
        {
          BP.bpModels.map(m =>
            <BpModel model={m} key={m.id} clickFn={bpmCb} />
          )


        }
        {/* <OffModel w={3} h={4} off={{ x: 0, y: 0 }} /> */}
      </div>
    </div>

  )
}



const BpModel: React.FC<{ model: BlueprintModel, clickFn: (models: BlueprintModel) => void }> = (props) => {
  const M = props.model
  const { Pos, Size } = M

  function appendBP(e: React.MouseEvent) {
    const side = !!e.ctrlKey ? 'bot' : 'right'
    const size = prompt("Input Size")
    let sw = parseInt(size!, 10) || 4
    let sh = sw * 1.5
    const mds = M.appendAsSize(sw, sh)

    props.clickFn(mds(side))
  }


  return (
    <div className={`relative  left-[${Pos.x}em] top-[${Pos.y}em] block w-fit h-fit`} >
      <div className={`w-[${Size.w}em] h-[${Size.h}em] bg-green-500 absolute outline outline-orange-800 overflow-hidden`}
        onClick={appendBP}
      >
        <ul className='text-sm text-center'>
          <li>Pos: {M.Pos.x}, {M.Pos.y}</li>
          <li>Size: {M.Size.w}x{M.Size.h}</li>
          <li>ID: {M.id}</li>
        </ul>
      </div>
    </div>
  )
}