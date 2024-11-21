let detectedHotkey = ''

// Функция для получения "чистого" названия клавиши
function getCleanKey(event) {
  if (event.code.startsWith('Key')) {
    return event.code.replace('Key', '') // Для букв возвращаем, например, "R"
  }
  if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) {
    return ''
  }
  const specialKeys = {
    Space: 'Space',
    ArrowUp: 'ArrowUp',
    ArrowDown: 'ArrowDown',
    ArrowLeft: 'ArrowLeft',
    ArrowRight: 'ArrowRight',
    Enter: 'Enter',
    Escape: 'Escape',
  }
  return specialKeys[event.code] || event.key.toUpperCase() // Для других клавиш
}

// Определяем комбинацию клавиш при фокусе на поле
document.getElementById('hotkey').addEventListener('focus', () => {
  // Сброс значения при фокусе
  detectedHotkey = ''
})

document.getElementById('hotkey').addEventListener('keydown', (event) => {
  event.preventDefault()

  // Получаем "чистую" клавишу
  const cleanKey = getCleanKey(event)

  const pressedHotkey = [
    event.ctrlKey ? 'Control' : '',
    event.altKey ? 'Alt' : '',
    event.shiftKey ? 'Shift' : '',
    event.metaKey ? 'Meta' : '',
    cleanKey,
  ].filter(Boolean).join('+')

  detectedHotkey = pressedHotkey

  // Отображаем результат в поле
  document.getElementById('hotkey').value = pressedHotkey
})

document.getElementById('reset').addEventListener('click', () => {
  document.getElementById('tab_reload').checked = true
  document.getElementById('notifications').checked = true
  document.getElementById('hotkey').value = ''
  detectedHotkey = ''
})

// Сохраняем и отправляем новый хоткей
document.getElementById('save').addEventListener('click', () => {
  chrome.storage.sync.set({
    hotkey: detectedHotkey,
    reloadTab: document.getElementById('tab_reload').checked,
    notification: document.getElementById('notifications').checked,
  }).then(() => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'images/logo.png',
      title: 'Extension Auto Reloader',
      message: 'The settings have been updated.',
      silent: true,
    })

    // Отправляем сообщение content.js для обновления хоткея
    chrome.runtime.sendMessage({ action: 'update_hotkey', hotkey: detectedHotkey })
  })
})

document.addEventListener('DOMContentLoaded', () => {
  // Получаем сохраненный хоткей из chrome.storage
  chrome.storage.sync.get().then(async (data) => {
    document.getElementById('tab_reload').checked = data.reloadTab !== undefined ? !!data.reloadTab : true
    document.getElementById('notifications').checked = data.notification !== undefined ? !!data.notification : true

    if (data.reloadTab === undefined) {
      await chrome.storage.sync.set({
        reloadTab: true,
      })
    }
    if (data.notification === undefined) {
      await chrome.storage.sync.set({
        notification: true,
      })
    }

    if (data.hotkey) {
      document.getElementById('hotkey').value = data.hotkey
    }
  })
})
