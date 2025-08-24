import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router'
import SideBar from './components/SideBar'

function Layout() {

  return (
    <>
    <div className='h-screen flex flex-col overflow-hidden'>
      <div className='w-full fixed left-0 top-0 z-100'>
        <Header/>
      </div>
      <div className='flex flex-1 pt-16 h-full'>
        <div className='w-54 fixed top-16 left-0 bg-gray-500 h-full'>
          <SideBar/>
        </div>
        <div className='flex-1 ml-54 bg-gray-200 overflow-y-scroll'>
          <Outlet/>
        </div>
      </div>
    </div>
    </>
  )
}

export default Layout
