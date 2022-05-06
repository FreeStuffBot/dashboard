import Dismissables from './dismissables'


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
  NEW_PRODUCT = 1,
  EDIT_PLATFORM = 2,
  EDIT_CURRENCY = 3,
  QUESTION = 4,
  FORM = 5,
}

type PopupHelper = {
  type: PopupType.MODAL
  title: string
  text: string
  buttons?: PopupButton[]
  onClose?: (handled: boolean) => any
} | {
  type: PopupType.NEW_PRODUCT
  callback: (url: string) => any
} | {
  type: PopupType.EDIT_PLATFORM
  data: any
  callback?: (reload: boolean) => any
} | {
  type: PopupType.EDIT_CURRENCY
  data: any
  callback?: (reload: boolean) => any
} | {
  type: PopupType.QUESTION
  title: string
  text?: string
  label?: string
  placeholder?: string
  validate?: (input: string) => string
  callback?: (input: string) => any
} | {
  type: PopupType.FORM
  title: string
  text?: string
  inputs: {
    id: string
    type: 'text' | 'multiline' | 'toggle'
    label?: string
    placeholder?: string
  }[]
  validate?: (input: string) => string
  callback?: (input: string) => any
}

export type Popup<T extends PopupType> = { type: T } & PopupHelper

/*
 *
 */

export function openErrorModal(store: any, status: number, text: string, context?: any) {
  const details = context ? `\n${context.error}: ${context.message}` : ''
  const data: Popup<PopupType.MODAL> = {
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

export function openModal(store: any, data: Omit<Popup<PopupType.MODAL>, 'type'>) {
  store.commit('openPopup', { type: PopupType.MODAL, ...data })
}

export function openPopup(store: any, data: Popup<any>) {
  store.commit('openPopup', data)
}

/**
 * Runs the treasure function but opens a gatekeep modal if not dismissed
 * @param store The vue/nuxt store
 * @param modal The modal data to show. Excluding buttons
 * @param dismissable The dismissable to tie this popup to
 * @param treasure The function to call if approved
 */
export function openDismissableModal<T extends any>(store: any, modal: { title: string, text: string }, dismissable: Dismissables, treasure: () => T): Promise<T> {
  if (!dismissable.show)
    return Promise.resolve(treasure())

  return new Promise((res) => {
    const clickOkay = () => {
      dismissable.dismiss()
      res(treasure())
      return true
    }

    store.commit('openPopup', {
      ...modal,
      type: PopupType.MODAL,
      buttons: [
        {
          type: 'green',
          text: 'Continue',
          onClick: clickOkay
        },
        {
          type: 'light',
          text: 'Cancel',
          onClick: () => true
        }
      ]
    })
  })
}

export function openInfoDialogue(store: any, title: string, text: string): Promise<void> {
  return new Promise((res) => {
    store.commit('openPopup', {
      title,
      text,
      type: PopupType.MODAL,
      buttons: [
        {
          type: 'green',
          text: 'Close',
          onClick() {
            res()
            return true
          }
        }
      ],
      onClose(handled: boolean) {
        if (!handled) res()
      }
    })
  })
}

export function openConfirmDialogue(store: any, title: string, text: string): Promise<boolean> {
  return new Promise((res) => {
    store.commit('openPopup', {
      title,
      text,
      type: PopupType.MODAL,
      buttons: [
        {
          type: 'green',
          text: 'Continue',
          onClick() {
            res(true)
            return true
          }
        },
        {
          type: 'light',
          text: 'Cancel',
          onClick() {
            res(false)
            return true
          }
        }
      ],
      onClose(handled: boolean) {
        if (!handled) res(false)
      }
    })
  })
}

export function openQuestionDialogue(store: any, title: string, text?: string, label?: string, placeholder?: string, validate?: (input: string) => string): Promise<string | null> {
  return new Promise((callback) => {
    store.commit('openPopup', {
      title,
      text,
      type: PopupType.QUESTION,
      label,
      placeholder,
      validate,
      callback,
      onClose(handled: boolean) {
        if (!handled) callback(null)
      }
    })
  })
}

export function openFormDialogue(store: any, data: Omit<Popup<PopupType.FORM>, 'type'>): Promise<any> {
  return new Promise((callback) => {
    store.commit('openPopup', {
      type: PopupType.FORM,
      ...data,
      callback,
      onClose(handled: boolean) {
        // eslint-disable-next-line node/no-callback-literal
        if (!handled) callback({} as any)
      }
    })
  })
}
