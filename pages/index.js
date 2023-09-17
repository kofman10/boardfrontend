import Board from '@/components/Board';
import React, { useState } from 'react';
import { ConnectButton } from "web3uikit"


export default function Home() {
  return (
    <>
    <div className="flex justify-end">
    <ConnectButton moralisAuth={false}/>
    </div>
    <div>
    <Board />
    </div>
    </>
  )
}





