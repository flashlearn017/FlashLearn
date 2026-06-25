import React from 'react'

import Toolbar from "../components/toolbar"

export default function HomePage() {
  return <Home/>;
}

function Home(){
    return(
      <div>
        <Toolbar/>
        <h1>Home page</h1>
      </div>
    )
}