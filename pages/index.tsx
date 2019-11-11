import React from 'react'
import Head from 'next/head'
import InsertionSort from '../components/InsertionSort'

const Home = () => (
  <div>
    <Head>
      <title>Visualized Sort Algorithm</title>
      <link rel='icon' href='/favicon.ico' />
    </Head>

    <div className='hero'>
      <h1 className='title'>Visualized Sort Algorithm</h1>
      <InsertionSort/>
    </div>

    <style jsx>{`
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        margin: 0;
        width: 100%;
        padding-top: 80px;
        line-height: 1.15;
        font-size: 48px;
      }
      .title,
      .description {
        text-align: center;
      }
    `}</style>
  </div>
)

export default Home
