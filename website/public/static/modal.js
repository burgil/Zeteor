function openModal(id) {
    document.getElementById(id).classList.add('open');
    document.body.classList.add('jw-modal-open');
}

function closeModal() {
    document.querySelector('.jw-modal.open').classList.remove('open');
    document.body.classList.remove('jw-modal-open');
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = '';
}

function modalBuilder(parentEl, mData) {
    for (const el of mData) {
        const newEl = document.createElement(el.type);
        if (el.class) newEl.className = el.class;
        if (el.src) newEl.src = el.src;
        if (el.id) newEl.id = el.id;
        if (el.click) newEl.addEventListener('click', el.click);
        if (el.txt) newEl.textContent = el.txt;
        if (el.html) newEl.innerHTML = el.html;
        if (el.tabIndex) newEl.setAttribute('tab-index', el.tabIndex);
        if (el.elements) modalBuilder(newEl, el.elements);
        parentEl.append(newEl);
    }
}

window.addEventListener('load', function() {
    document.addEventListener('click', event => {
        if (event.target.classList.contains('jw-modal')) {
            closeModal();
        }
    });
});