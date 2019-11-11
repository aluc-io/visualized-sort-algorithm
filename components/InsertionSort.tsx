export default () => {

  const arr = [1,2,3,4,5,6,7,8,9,10]
  return (
    <div>
      <div className='board'>

        {arr.join(',')}
      
      </div>

      <div className='buttonBox'>
        <button>shuffle</button>
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
