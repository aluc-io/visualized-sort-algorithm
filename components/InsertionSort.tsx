import { range, shuffle } from 'lodash'
import { useState } from 'react'

const getArr = () => shuffle(range(1,11))

export default () => {

  const [arr, setArr] = useState(getArr())

  const handleShuffle = () => {
    setArr(getArr())
  }

  return (
    <div>
      <div className='board'>

        {arr.join(',')}
      
      </div>

      <div className='buttonBox'>
        <button onClick={handleShuffle}>shuffle</button>
        <button>sort</button>
      </div>

      <style jsx>{`
        .board {
          width: 100%;
          height: 200px;
          background-color: green;
          color: white;
          font-size: 40px;
        }
        .buttonBox {
          width: 100%;
          height: 60px;
          background-color: gray;
          text-align: right;
        }
        button {
          font-size: 40px;
        }
      `}</style>

    </div>
  )
}
