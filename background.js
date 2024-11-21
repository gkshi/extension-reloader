chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'update_hotkey') {
    // Пересылаем сообщение во все вкладки, где загружен content.js
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, message, () => {
          if (chrome.runtime.lastError) {
            console.warn(`Error sending message to tab ${tab.id}:`, chrome.runtime.lastError.message)
          }
        })
      })
    })
  }

  if (message.action === 'reload_extensions') {
    chrome.management.getAll((extensions) => {
      extensions.forEach((extension) => {
        if (extension.enabled && extension.id !== chrome.runtime.id) { // Исключаем само расширение
          chrome.management.setEnabled(extension.id, false, () => {
            chrome.management.setEnabled(extension.id, true)
          })
        }
      })
    })

    chrome.storage.sync.get().then((data) => {
      if (data.notification) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/logo.png',
          title: 'Extensions Auto Reloader',
          message: 'Extensions have been reloaded.',
          silent: true,
        })
      }

      if (data.reloadTab) {
        // После завершения перезагрузки расширений, обновляем активную вкладку
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id)
          }
        })
      }
    })
  }
})
