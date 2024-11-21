// Значение по умолчанию
let customHotkey = "Alt+Shift+‰"; // Option+Shift+R

// Загрузка сохраненного хоткея при инициализации
chrome.storage.sync.get((data) => {
  if (data.hotkey) {
    customHotkey = data.hotkey;
  }
});

// Слушаем сообщение об изменении хоткея и обновляем переменную
chrome.runtime.onMessage.addListener((message) => {
  // TODO: этот слушатель не срабатывает
  if (message.action === "update_hotkey") {
    customHotkey = message.hotkey;
  }
});

// Проверяем комбинацию нажатия клавиш
document.addEventListener("keydown", (event) => {
  const originalHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    event.key.length === 1 ? event.key.toUpperCase() : event.key
  ].filter(Boolean);
  const pressedHotkey = originalHotkey.join("+");

  if (pressedHotkey.toUpperCase() === customHotkey.toUpperCase()) {
    event.preventDefault();
    chrome.runtime.sendMessage({ action: "reload_extensions" });
  }
});
