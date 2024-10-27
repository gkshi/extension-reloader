let detectedHotkey = ""; // Хранение текущей комбинации

// Загрузка текущего хоткея при открытии popup
document.addEventListener("DOMContentLoaded", () => {
  // Получаем сохраненный хоткей из chrome.storage
  chrome.storage.sync.get("hotkey", (data) => {
    if (data.hotkey) {
      detectedHotkey = data.hotkey;
      document.getElementById("hotkey").value = detectedHotkey; // Устанавливаем в поле ввода
    } else {
      document.getElementById("hotkey").value = "Alt+Shift+R"; // Значение по умолчанию
    }
  });
});

// Определяем комбинацию клавиш при фокусе на поле
document.getElementById("hotkey").addEventListener("focus", () => {
  detectedHotkey = ""; // Сброс значения при фокусе
});

document.getElementById("hotkey").addEventListener("keydown", (event) => {
  event.preventDefault();

  // Определяем символ для отображения, учитывая модификаторы и буквенные клавиши
  const key = event.key.length === 1 && /[a-zA-Z]/.test(event.key)
    ? event.code.replace("Key", "") // Убираем "Key" из `KeyR`, чтобы получить "R"
    : event.key;

  // Формируем строку с комбинацией клавиш
  detectedHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    key
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
