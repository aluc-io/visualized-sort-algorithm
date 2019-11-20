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
      :global(body) {
        background-color: #121212;
      }
      .hero {
        width: 100%;
        color: #333;
      }
      .title {
        width: 100%;
        line-height: 1.15;
        font-size: 48px;
        font-family: "Roboto", "Helvetica", "Arial", sans-serif;
        margin: 0;
        margin-bottom: 100px;
        color: white;
      }
      .title,
      .description {
        text-align: center;
      }
    `}</style>
  </div>
)

export default Home
