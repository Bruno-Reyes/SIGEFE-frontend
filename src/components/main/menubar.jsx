import React from 'react'
import { Menubar } from 'primereact/menubar'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'

export default function Menu( {toggleSidebar} ) {

  const accept = () => {
    localStorage.clear() // Eliminar todo el contenido de localStorage
    window.location.reload() // Recargar la página
  }

  const reject = () => {
    console.log('reject')
  }

  const confirm1 = () => {
    confirmDialog({
      group: 'headless',
      message: '¿Estas seguro que quieres cerrar sesión?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      defaultFocus: 'accept',
      accept,
      reject
    })
  }

  const itemRenderer = (item) => (
    <a className="flex align-items-center p-menuitem-link">
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    </a>
  )

  const items = [
    {
      label: 'Home',
      icon: 'pi pi-home',
      command : toggleSidebar
    },
  ]

  const end = (
    <Button icon="pi pi-sign-out" rounded outlined severity="info" aria-label="User" onClick={confirm1} />
  )

  return (
    <div>
      <Menubar model={items} end={end} />

      <ConfirmDialog
        group="headless"
        content={({ headerRef, contentRef, footerRef, hide, message }) => (
          <div className="flex flex-column align-items-center p-5 surface-overlay border-round">
            <div className="border-circle bg-primary inline-flex justify-content-center align-items-center h-6rem w-6rem -mt-8">
              <i className="pi pi-question text-5xl"></i>
            </div>
            <span className="font-bold text-2xl block mb-2 mt-4" ref={headerRef}>
              {message.header}
            </span>
            <p className="mb-0" ref={contentRef}>
              {message.message}
            </p>
            <div className="flex align-items-center gap-2 mt-4" ref={footerRef}>
              <Button
                label="Seguro"
                onClick={(event) => {
                  hide(event)
                  accept()
                }}
                className="w-8rem"
              ></Button>
              <Button
                label="Cancelar"
                outlined
                onClick={(event) => {
                  hide(event)
                  reject()
                }}
                className="w-8rem"
              ></Button>
            </div>
          </div>
        )}
      />
    </div>
  )
}   