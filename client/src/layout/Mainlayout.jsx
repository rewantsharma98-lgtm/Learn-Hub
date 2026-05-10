import Navbar from '@/components/ui/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Mainlayout = () => {
  return (
    <div>
      <Navbar/>
    <div>
        <Outlet/>
    </div>
    </div>
  )
}

export default Mainlayout
