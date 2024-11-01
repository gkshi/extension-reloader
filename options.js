let detectedHotkey = ""; // Хранение текущей комбинации

// Загрузка текущей комбинации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("hotkey", (data) => {
    if (data.hotkey) {
      detectedHotkey = data.hotkey;
      document.getElementById("hotkey").value = detectedHotkey;
    }
  });
});

// Определяем комбинацию клавиш при фокусе на поле
document.getElementById("hotkey").addEventListener("focus", () => {
  detectedHotkey = ""; // Сброс значения при фокусе
});

document.getElementById("hotkey").addEventListener("keydown", (event) => {
  event.preventDefault();

  // Формируем строку с комбинацией клавиш
  detectedHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    event.key.length === 1 ? event.key.toUpperCase() : event.key // Верхний регистр для буквенных клавиш
  ].filter(Boolean).join("+");

  document.getElementById("hotkey").value = detectedHotkey;
});

// Сохраняем и отправляем новый хоткей
document.getElementById("save").addEventListener("click", () => {
  chrome.storage.sync.set({ hotkey: detectedHotkey }, () => {
    alert("Hotkey saved!");

    // Отправляем сообщение content.js для обновления хоткея
    chrome.runtime.sendMessage({ action: "update_hotkey", hotkey: detectedHotkey });
  });
});
