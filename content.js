let customHotkey = "Alt+Shift+R"; // Значение по умолчанию

// Загрузка сохраненного хоткея при инициализации
chrome.storage.sync.get("hotkey", (data) => {
  if (data.hotkey) {
    customHotkey = data.hotkey;
  }
});

// Слушаем сообщение об изменении хоткея и обновляем переменную
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "update_hotkey") {
    customHotkey = message.hotkey; // Обновляем значение без повторного объявления
    console.log("Hotkey updated to:", customHotkey); // Для отладки
  }
});

// Проверяем комбинацию нажатия клавиш
document.addEventListener("keydown", (event) => {
  const pressedHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    event.key.length === 1 ? event.key.toUpperCase() : event.key
  ].filter(Boolean).join("+");

  if (pressedHotkey.toUpperCase() === customHotkey.toUpperCase()) {
    event.preventDefault();
    chrome.runtime.sendMessage({ action: "reload_extensions" });
  }
});
