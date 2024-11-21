let detectedHotkey = "";
let hotkeyToShow = "";

// Функция для замены символов в комбинации клавиш
function replaceSpecialCharacters(key) {
  const replacements = {
    '‰': 'R'
  };

  return replacements[key] || key;
}

// Определяем комбинацию клавиш при фокусе на поле
document.getElementById("hotkey").addEventListener("focus", () => {
  // Сброс значения при фокусе
  detectedHotkey = "";
});

document.getElementById("hotkey").addEventListener("keydown", (event) => {
  event.preventDefault();

  // Определяем символ для отображения, учитывая модификаторы и буквенные клавиши
  const key = event.key.length === 1 && /[a-zA-Z]/.test(event.key)
    ? event.code.replace("Key", "") // Убираем "Key" из `KeyR`, чтобы получить "R"
    : event.key;

  // Формируем строку с комбинацией клавиш
  const cleanHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    key
  ].filter(Boolean);
  detectedHotkey = cleanHotkey.join("+")
  hotkeyToShow = cleanHotkey.map(replaceSpecialCharacters).join("+");

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
      message: "Settings has been updated.",
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

    if (data.hotkey) {
      detectedHotkey = data.hotkey;
      hotkeyToShow = data.hotkey.split('+').map(replaceSpecialCharacters).join("+");
      document.getElementById("hotkey").value = hotkeyToShow; // Устанавливаем в поле ввода
    }
  })
});
