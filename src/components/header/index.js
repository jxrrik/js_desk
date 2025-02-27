import React, { useState, useEffect } from 'react'

import { Bar, Side, Space } from './styles'

import { IoMdClose } from 'react-icons/io'
import { VscChromeMinimize } from 'react-icons/vsc'
import { BiBrain } from 'react-icons/bi'

export default function Header() {
  function manageApp(str) {
    const remote = window.require('electron').remote

    const WIN = remote.getCurrentWindow()

    if (str === 'close') {
      window.close()
    }

    if (str === 'minimize') {
      WIN.minimize()
    }

    if(str === "terminal") {
      remote.ipcMain.emit("open-terminal");
    }
  }
  return (
    <Bar>
      <Side>
        <div className="btn ativ">
          <BiBrain onClick={() => manageApp("terminal")} />
        </div>
      </Side>
      <Space />
      <Side>
        <div className="btn" onClick={() => manageApp("minimize")}>
          <VscChromeMinimize />
        </div>
        <div className="btn close" onClick={() => manageApp("close")}>
          <IoMdClose />
        </div>
      </Side>
    </Bar>
  );
}
