const listeners = new Set()

export const notify = (message) => {
  listeners.forEach((listener) => listener(message))
}

export const onNotification = (listener) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}
