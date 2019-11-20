import { range, shuffle, uniqueId } from 'lodash'
import { useState, FC, SetStateAction, Dispatch, memo, useRef, MutableRefObject, useEffect } from 'react'
import { tween } from 'tweening-js'
import browserBeep from 'browser-beep'
import Button from '@material-ui/core/Button'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import IconShuffle from '@material-ui/icons/Shuffle'
import IconSort from '@material-ui/icons/Sort'
import getColorMap from 'colormap'

const colorMapNameArr = [
  "jet", "hsv", "hot", "cool", "spring", "summer", "autumn", "winter", "bone", "copper",
  "greys", "yignbu", "greens", "yiorrd", "bluered", "rdbu", "picnic", "rainbow", "portland",
  "blackbody", "earth", "electric", "alpha", "viridis", "inferno", "magma", "plasma",
  "warm", "cool", "rainbow-soft", "bathymetry", "cdom", "chlorophyll", "density",
  "freesurface-blue", "freesurface-red", "oxygen", "par", "phase", "salinity", "temperature",
  "turbidity", "velocity-blue", "velocity-green", "cubehelix",
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    buttonSort: {
      color: 'black',
      backgroundColor: '#90caf9',
      '&:hover': {
        backgroundColor: 'rgb(100, 141, 174)',
      }
    },
  }),
)

type TSetIdx = Dispatch<SetStateAction<number>>
type TSetX = Dispatch<SetStateAction<number>>

const DURATION = 50
const SIZE = 15
const BAR_WIDTH = 20
const BAR_MARGIN = 2

const getArr = () => shuffle(range(1,SIZE+1))
const initArr = range(1,SIZE+1).map(() => 1)
const getX = (idx: number) => idx*(BAR_MARGIN+BAR_WIDTH)

const swap = (arr: IExtendedBar[], a: number, b: number) => {
  const tmp = arr[a]
  arr[a] = arr[b]
  arr[b] = tmp
}

interface IExtendedBar {
  value: number
  refSetX: MutableRefObject<TSetX>
}

const sort = async (extendedBarArr: IExtendedBar[], setIdxI: TSetIdx, setIdxJ: TSetIdx) => {
  const beepA = browserBeep({ frequency: 830 })
  const beepB = browserBeep({ frequency: 230 })

  // https://en.wikipedia.org/wiki/Insertion_sort
  let i = 1, j = 1
  while (i < extendedBarArr.length) {
    await tween(j, i, setIdxJ, DURATION).promise()
    j = i
    while (j > 0 && extendedBarArr[j - 1].value > extendedBarArr[j].value) {
      beepA(1)
      await Promise.all([
        tween(getX(j), getX(j-1), extendedBarArr[j].refSetX.current, DURATION).promise(),
        tween(getX(j-1), getX(j), extendedBarArr[j-1].refSetX.current, DURATION).promise(),
      ])
      swap(extendedBarArr, j, j - 1)

      await tween(j, j-1, setIdxJ, DURATION).promise()
      j = j - 1
    }
    beepB(1)
    await tween(i, i+1, setIdxI, DURATION).promise()
    i = i + 1
  }
}

interface IPropsBar {
  value: number
  idx: number
  refSetX: MutableRefObject<TSetX>
  colorArr: string[]
}

const Bar: FC<IPropsBar> = (props) => {
  const { value, idx, refSetX, colorArr } = props
  const [x, setX] = useState(getX(idx))
  const style = {
    height: value * 10,
    transform: `translateX(${x}px)`,
    backgroundColor: colorArr[value-1],
  }
  refSetX.current = setX

  return (
    <>
      <div style={style} className='bar'/>
      <style jsx>{`
        .bar {
          position: absolute;
          width: 20px;
        }
      `}</style>
    </>
  )
}

interface IPropsBoard {
  arr: number[]
  refExtendedBarArr: MutableRefObject<IExtendedBar[]>
}

const isArrEqual = (oldProps: IPropsBoard, props: IPropsBoard) => {
  return oldProps.arr === props.arr
}

const Board: FC<IPropsBoard> = (props) => {
  const { arr, refExtendedBarArr } = props
  const extendedBarArr = arr.map(value => ({ value, refSetX: useRef<TSetX>(null) }))
  useEffect(() => {
    refExtendedBarArr.current = extendedBarArr
  }, [arr])

  const colorMapIdx = Math.floor(Math.random() * colorMapNameArr.length)
  const colormap = colorMapNameArr[colorMapIdx]
  const colorArr = getColorMap({ colormap, nshades: arr.length, format: 'hex', alpha: 1 })

  return (
    <div className='board'>
      {extendedBarArr.map((item, i) => {
        return (
          <Bar
            key={`${uniqueId('set')}:${i}`}
            value={item.value} idx={i} refSetX={item.refSetX}
            colorArr={colorArr}
          />
        )
      })}
      <style jsx>{`
        .board {
          width: 100%;
          height: 200px;
          background-color: #333;
          color: white;
          transform: rotateX(180deg);
        }
      `}</style>
    </div>
  )
}

const MemorizedBoard = memo(Board, isArrEqual)

export default () => {
  const [arr, setArr] = useState(initArr)
  const [idxI, setIdxI] = useState(1)
  const [idxJ, setIdxJ] = useState(1)
  const [isRunning, setIsRunning] = useState(false)
  const refExtendedBarArr = useRef<IExtendedBar[]>([])
  useEffect(() => setArr(getArr()), [])

  const handleShuffle = () => {
    setArr(getArr())
    setIdxI(1)
    setIdxJ(1)
  }
  const handleSort = async () => {
    setIsRunning(true)
    await sort(refExtendedBarArr.current, setIdxI, setIdxJ)
    setIsRunning(false)
  }

  const classes = useStyles({})

  return (
    <div>
      <h3>Insertion Sort</h3>
      <MemorizedBoard arr={arr} refExtendedBarArr={refExtendedBarArr}/>
      <div className='index i' style={{ transform: `translateX(${getX(idxI)}px)`}}>i</div>
      <div className='index j' style={{ transform: `translateX(${getX(idxJ)}px)`}}>j</div>

      <div className='buttonBox'>
        <Button
          variant="contained"
          color="default"
          disabled={isRunning}
          className={classes.button}
          startIcon={<IconShuffle />}
          onClick={handleShuffle}
        >
          Shuffle
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={isRunning}
          className={classes.buttonSort}
          startIcon={<IconSort />}
          onClick={handleSort}
        >
          Sort
        </Button>

      </div>

      <style jsx>{`
        h3 {
          font-size: 24px;
          font-family: "Roboto", "Helvetica", "Arial", sans-serif;
          margin: 0px;
          color: white;
        }
        .buttonBox {
          width: 100%;
          height: 60px;
          text-align: right;
        }
        button {
          font-size: 40px;
        }
        .running {
          font-size: 40px;
        }
        .index {
          position: absolute;
          width: 20px;
          opacity: 0.8;
        }
        .index.j {
          background-color: blue;
          color: white;
        }
        .index.i {
          background-color: yellow;
          color: black;
        }
      `}</style>

    </div>
  )
}
