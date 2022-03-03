

export type ButtonType
  = 'red'
  | 'yellow'
  | 'blue'
  | 'green'
  | 'dark'
  | 'light'

export type PopupButton = {
  type: ButtonType
  text: string
  onClick: () => boolean
}

export enum PopupType {
  MODAL = 0,
  NEW_PRODUCT = 1
}

export type Popup = {
  type: PopupType.MODAL
  title: string
  text: string
  buttons?: PopupButton[]
  onClose?: (handled: boolean) => any
} | {
  type: PopupType.NEW_PRODUCT
  callback: (url: string) => any
}

/*
 *
 */

export function openErrorModal(store: any, status: number, text: string, context?: any) {
  const details = context ? `\n${context.error}: ${context.message}` : ''
  const data: Popup = {
    type: PopupType.MODAL,
    title: 'An error occured',
    text: `http ${status}: ${text}${details}\nCheck devtools for more info.`,
    buttons: [ {
      type: 'light',
      text: 'Close',
      onClick: () => true
    } ]
  }
  store.commit('openPopup', data)
}
