let detectedHotkey = "";
let hotkeyToShow = "";

// Определяем комбинацию клавиш при фокусе на поле
document.getElementById("hotkey").addEventListener("focus", () => {
  // Сброс значения при фокусе
  detectedHotkey = "";
});

document.getElementById("hotkey").addEventListener("keydown", (event) => {
  event.preventDefault();

  // Если это буквенная клавиша (например, KeyE)
  const key = event.code.startsWith("Key")
    ? event.code.replace("Key", "") // Убираем "Key", оставляя только букву
    : event.key; // Для остальных клавиш, например, ArrowUp, Enter

  // Формируем строку с комбинацией клавиш
  const cleanHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    key
  ].filter(Boolean); // Убираем пустые значения

  // Обновляем значения
  detectedHotkey = cleanHotkey.join("+");
  hotkeyToShow = detectedHotkey;

  // Отображаем результат в поле
  document.getElementById("hotkey").value = hotkeyToShow;
});

document.getElementById("reset").addEventListener('click', () => {
  document.getElementById("tab_reload").checked = true
  document.getElementById("notifications").checked = true
  document.getElementById("hotkey").value = "";
  detectedHotkey = ''
  hotkeyToShow = ''
})

// Сохраняем и отправляем новый хоткей
document.getElementById("save").addEventListener("click", () => {
  chrome.storage.sync.set({
    hotkey: detectedHotkey,
    reloadTab: document.getElementById("tab_reload").checked,
    notification: document.getElementById("notifications").checked,
  }).then(() => {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "images/logo.png",
      title: "Extension Auto Reloader",
      message: "The settings have been updated.",
      silent: true
    });

    // Отправляем сообщение content.js для обновления хоткея
    chrome.runtime.sendMessage({ action: "update_hotkey", hotkey: detectedHotkey });
  })
});

document.addEventListener("DOMContentLoaded", () => {
  // Получаем сохраненный хоткей из chrome.storage
  chrome.storage.sync.get().then(async (data) => {
    document.getElementById("tab_reload").checked = data.reloadTab !== undefined ? !!data.reloadTab : true
    document.getElementById("notifications").checked = data.notification !== undefined ? !!data.notification : true

    if (data.reloadTab === undefined) {
      await chrome.storage.sync.set({
        reloadTab: true
      })
    }
    if (data.notification === undefined) {
      await chrome.storage.sync.set({
        notification: true
      })
    }

    console.log('##data.hotkey', data.hotkey)
    if (data.hotkey) {
      // detectedHotkey = data.hotkey;
      // hotkeyToShow = data.hotkey.split('+').map(replaceSpecialCharacters).join("+");
      document.getElementById("hotkey").value = data.hotkey;
    }
  })
});
