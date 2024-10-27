chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reload_extensions") {
    chrome.management.getAll((extensions) => {
      extensions.forEach((extension) => {
        if (extension.enabled && extension.id !== chrome.runtime.id) { // Исключаем само расширение
          chrome.management.setEnabled(extension.id, false, () => {
            chrome.management.setEnabled(extension.id, true);
          });
        }
      });
    });

    // После завершения перезагрузки расширений, обновляем активную вкладку
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.reload(tabs[0].id);
      }
    });

    // Отправляем уведомление после завершения перезагрузки расширений
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Extensions Reloaded",
      message: "All enabled extensions have been reloaded."
    });
  }
});
