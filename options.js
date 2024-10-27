let detectedHotkey = ""; // Для хранения выбранной комбинации

// Загрузка текущей комбинации при загрузке страницы
document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get("hotkey", (data) => {
    if (data.hotkey) {
      detectedHotkey = data.hotkey; // Устанавливаем значение из хранилища
      document.getElementById("hotkey").value = detectedHotkey; // Отображаем в поле
    }
  });
});

// Слушаем фокус на поле для ввода новой комбинации
document.getElementById("hotkey").addEventListener("focus", () => {
  detectedHotkey = ""; // Сбрасываем значение при фокусировке
});

document.getElementById("hotkey").addEventListener("keydown", (event) => {
  event.preventDefault(); // Предотвращаем стандартное поведение ввода

  console.log('##event.key', event)
  // Формируем строку с комбинацией клавиш
  detectedHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    event.key.length === 1 ? event.key.toUpperCase() : event.key // Верхний регистр для буквенных клавиш
  ].filter(Boolean).join("+");

  // Обновляем поле ввода с новой комбинацией
  document.getElementById("hotkey").value = detectedHotkey;
});

// Сохраняем комбинацию при нажатии кнопки "Save"
document.getElementById("save").addEventListener("click", () => {
  chrome.storage.sync.set({ hotkey: detectedHotkey }, () => {
    alert("Hotkey saved!");
  });
});
