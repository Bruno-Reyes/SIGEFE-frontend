import React from 'react'
import { ProgressSpinner } from 'primereact/progressspinner'
import 'primereact/resources/themes/saga-blue/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const Loader = () => {
  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh'
  }

  return (
    <div style={loaderStyle}>
      <ProgressSpinner />
    </div>
  )
}

export default Loader