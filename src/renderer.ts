import type { API } from './types'

const form = document.querySelector<HTMLFormElement>('form')
const decrementButton =
  document.querySelector<HTMLButtonElement>('#decrement-btn')
const incrementButton =
  document.querySelector<HTMLButtonElement>('#increment-btn')
const teamSizeDisplay =
  document.querySelector<HTMLSpanElement>('#team-size-display')

const status = {
  teamSize: 1
}

decrementButton?.addEventListener('click', () => {
  if (status.teamSize <= 1 || !teamSizeDisplay?.textContent) return
  status.teamSize--
  teamSizeDisplay.textContent = `0${status.teamSize}`
})

incrementButton?.addEventListener('click', () => {
  if (status.teamSize >= 5 || !teamSizeDisplay?.textContent) return
  status.teamSize++
  teamSizeDisplay.textContent = `0${status.teamSize}`
})

form?.addEventListener('submit', handleSubmit)

function handleSubmit(event: SubmitEvent) {
  event.preventDefault()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const api: API = (window as any).api
  api.createRoom(status.teamSize)
}
