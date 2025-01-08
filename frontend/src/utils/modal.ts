let addModalFunction: any

export const setModalFunction = (func: (eid: string) => void) => {
  addModalFunction = func
}

export const modal = (eid: string) => {
  if (addModalFunction) {
    addModalFunction(eid)
  } else {
    console.warn('Modal function is not initialized.')
  }
}
