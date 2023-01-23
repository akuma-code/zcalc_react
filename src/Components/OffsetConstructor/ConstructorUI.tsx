import React, { useEffect, useState } from 'react'
import ButtonFr from '../Constructor/ViewModel/UI/ButtonFr'
import { IcDoubleRight, IcDoubleTop, IcFrameRight, IcFrameUp, IcReset } from '../Icons/IconsPack'
import { OffsetCanvas } from './Model/OffsetModel'
import { Blueprint, BlueprintModel } from "./Model/BlueprintModel"
import useInput from '../../hooks/useInput'

type Props = {}

export const ConstructorUI = () => {
  const [BP, setBp] = useState<Blueprint>(new Blueprint())
  const [Canvas, setCanvas] = useState(new OffsetCanvas())
  const [w, setW] = useInput('4')

  function restart() {
    BP.init(parseInt(w), parseInt(w || '4') * 1.5)
    updBP()
  }


  function updBP() {

    setBp(prev => prev.HandleUpdate())

  }

  function bpmCb(newmod: BlueprintModel) {
    setBp(BP.add(newmod))
    updBP()
  }
  useEffect(() => {
    // if (BP.GlobalOffset.y === 0 && BP.GlobalOffset.x === 0) return
    updBP()
    console.log(BP.bpModels);


  }, [BP.GlobalOffset.y, BP.GlobalOffset.x])



  return (
    <div className='border bg-red-200 mt-14 p-2'>
      <div className='text-2xl text-center flex justify-around'>
        <input type="number" value={parseInt(w) || '0'} onChange={setW} className={`w-[5em]`} />
        Ширина рамы
      </div>
      <div>
        <ButtonFr logo={<IcReset hw={6} />} bgColor='teal' clickFn={() => restart()} >INIT</ButtonFr>
        <ButtonFr logo={<IcFrameRight hw={6} />} bgColor='red' clickFn={() => { }} >AppendR</ButtonFr>
        <ButtonFr logo={<IcFrameUp hw={6} />} bgColor='green' clickFn={() => { }} >Reset</ButtonFr>
      </div>
      <div className='w-[30em] h-[30em] bg-red-500  outline-double outline-4 outline-black mt-2 relative p-4'>
        {
          BP.bpModels.map(m =>
            <BpModel model={m} key={m.id} clickFn={bpmCb} topIDs={BP.topIDs()} />
          )


        }
        {/* <OffModel w={3} h={4} off={{ x: 0, y: 0 }} /> */}
      </div>
    </div>

  )
}

interface BpModelProps {
  model: BlueprintModel,
  clickFn: (model: BlueprintModel) => void
  topIDs?: string[]
}

const BpModel: React.FC<BpModelProps> = (props) => {
  const M = props.model
  const { Pos, Size } = M

  function appendBP(e: React.MouseEvent) {
    const side = e.ctrlKey ? 'bot' : 'right'

    const mds = M.appendAsSize(5, 7)

    props.clickFn(mds(side))
  }
  const isTopId = props.topIDs?.includes(M.id)
  const bg = isTopId ? 'bg-orange-200' : 'bg-green-500'


  return (
    <div className={`relative  left-[${Pos.x}em] top-[${Pos.y}em] block w-fit h-fit`} >
      <div className={`absolute left-[${(Size.w / 2) - 1}em] top-[-22px]`}>
        {
          isTopId && <ButtonFr
            bgColor='green'
            clickFn={() => props.clickFn(M.appendAsSize(4, 6)('top'))}
            logo={<IcDoubleTop hw={4} />} />
        }
      </div>
      <div className={`absolute left-[${Size.w - .5}em] top-[${Size.h / 2 - 1}em]`}>
        {
          isTopId && <ButtonFr
            bgColor='green'
            clickFn={() => props.clickFn(M.appendAsSize(4, 6)('right'))}
            logo={<IcDoubleRight hw={4} />} />
        }
      </div>
      <div className={`w-[${Size.w}em] h-[${Size.h}em] ${bg} absolute outline outline-orange-800 overflow-hidden`}
      // onClick={appendBP}
      >
        <ul className='text-sm text-center my-auto'>
          <li>Pos: {M.Pos.x}, {M.Pos.y}</li>
          <li>Size: {M.Size.w}x{M.Size.h}</li>
          <li>ID: {M.id}</li>
        </ul>
      </div>

    </div>
  )
}