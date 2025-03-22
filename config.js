window.addEventListener('keydown', (e) => { // Отключение скролла страницы пробелом во время игры
    if (e.keyCode === 32 && e.target === document.body) {  
       e.preventDefault();  
      }  
 });
const dialog = document.querySelector('.rules');
window.addEventListener("DOMContentLoaded", () => {
    dialog.showModal();
})
document.querySelector('.rules').addEventListener('click', () => {
    dialog.close()
});