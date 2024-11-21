// Значение по умолчанию
const DEFAULT_HOTKEY = 'Alt+Shift+R'
let customHotkey = DEFAULT_HOTKEY;

// Функция для получения "чистого" названия клавиши
function getCleanKey(event) {
  if (event.code.startsWith("Key")) {
    return event.code.replace("Key", ""); // Для букв возвращаем, например, "R"
  }
  const specialKeys = {
    Space: "Space",
    ArrowUp: "ArrowUp",
    ArrowDown: "ArrowDown",
    ArrowLeft: "ArrowLeft",
    ArrowRight: "ArrowRight",
    Enter: "Enter",
    Escape: "Escape",
  };
  return specialKeys[event.code] || event.key.toUpperCase(); // Для других клавиш
}

// Загрузка сохраненного хоткея при инициализации
chrome.storage.sync.get((data) => {
  customHotkey = data.hotkey || DEFAULT_HOTKEY;
});

// Слушаем сообщение об изменении хоткея и обновляем переменную
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "update_hotkey") {
    customHotkey = message.hotkey || DEFAULT_HOTKEY;
  }
});

// Проверяем комбинацию нажатия клавиш
document.addEventListener("keydown", (event) => {
  const cleanKey = getCleanKey(event); // Получаем "чистую" клавишу

  // Формируем комбинацию модификаторов и основной клавиши
  const pressedHotkey = [
    event.ctrlKey ? "Control" : "",
    event.altKey ? "Alt" : "",
    event.shiftKey ? "Shift" : "",
    event.metaKey ? "Meta" : "",
    cleanKey,
  ].filter(Boolean).join("+");

  // console.log('##pressedHotkey.toUpperCase()', pressedHotkey.toUpperCase())
  // console.log('##customHotkey.toUpperCase()', customHotkey.toUpperCase())

  // Сравниваем с сохранённым хоткеем
  if (pressedHotkey.toUpperCase() === customHotkey.toUpperCase()) {
    event.preventDefault();

    // Отправляем сообщение на перезагрузку расширений
    chrome.runtime.sendMessage({ action: "reload_extensions" });
  }
});
