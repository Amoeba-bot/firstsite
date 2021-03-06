//Проверяем локальное хранилище и создаём массивы папок и заметок
let allFolders = {};
var allNotes = [];
if (localStorage.getItem("folders")) {
    allFolders = JSON.parse(localStorage.getItem("folders"));
}
if (localStorage.getItem("notes")) {
    allNotes = JSON.parse(localStorage.getItem("notes"));
}

//Переменные кнопок в нижнем меню
let buttonCreateFolder = document.querySelector('.button-create-folder');
let buttonCreateNote = document.querySelector('.button-create-note');
let buttonSave = document.querySelector('.button-save');
let buttonDel = document.querySelector('.button-delete');
let buttonCreate = document.querySelector('.button-create');

// Остальные переменные
let foldersList = document.querySelector('.folders-list'); // Место для создания папок
let popup = document.querySelector('.modal') // Окно для создания заметок
let closePopupButton = popup.querySelector('.button-close');

let noteReaderModal = document.querySelector('.noteReader'); // окно для чтения заметок
let closeNoteReaderButton = document.querySelector('.noteReader');

// Функция создания папки
let createFolder = function () {
    let folderName = prompt('Создать папку с названием:');
    if (folderName) {
        let element = document.createElement('div');
        element.classList.add('folder');
        element.classList.add('folder-closed');
        element.id = Date.now();
        // Исправить порядок текста и картинки --------------------------------------------------------------------------------------------------------
        let folderTitle = document.createElement('p');
        folderTitle.classList.add('.folder-name');
        folderTitle.textContent = folderName;
        element.appendChild(folderTitle);
        let folderImage = document.createElement('img');
        folderImage.src = 'img/folder-closed.svg';
        folderImage.style.width = '48px';
        folderImage.style.height = '48px';
        folderTitle.appendChild(folderImage);

        foldersList.appendChild(element);
        folderTitle.addEventListener('click', folderToggle);
        // запись папки в объект
        allFolders[element.id] = folderName;

    }
    else {
        alert('Создание папки отменено!');
    }
}

// Функция открывания папки ------------ исправить ошибку с кликом по картинке----------------------
// Ошибка с кликом по картинке
// При создании папки в функции createFolder создается <div> с id, его ребенком <p>, его ребенком <img>. 
// При клике ищется id родителя. 
// А у <img> родитель <p>, у которого нет id.
let folderToggle = function (evt) {
    let folderId = evt.target.parentNode.id;
    if (folderId) {
        let folderDiv = document.getElementById(folderId); // Заплатка, которая исправляет ошибку с кликом по картинке
        let iconSrc = folderDiv.querySelector('img');
        if (folderDiv.classList.contains('folder-closed')) {
            evt.target.parentNode.classList.toggle('folder-opened');
            evt.target.parentNode.classList.toggle('folder-closed');
            console.log(folderId);
            iconSrc.src = 'img/folder-opened.svg';

        }
        else if (folderDiv.classList.contains('folder-opened')) {
            evt.target.parentNode.classList.toggle('folder-opened');
            evt.target.parentNode.classList.toggle('folder-closed');
            console.log(folderId);
            iconSrc.src = 'img/folder-closed.svg';

        }
    }
}

// Функции обновления селектора папки

let folderSelectorUpdate = function (folderList) {
    let x = document.getElementById("folderSelector"); // чистим селектор
    while (x.firstChild) {
        x.firstChild.remove();
    }
    for (let key in folderList) { // записываем в селектор все папки
        let folderSelector = document.getElementById('folderSelector');
        let option = document.createElement('option');
        option.textContent = folderList[key];
        folderSelector.appendChild(option);
    }
}


// Выясняем ID папки
let getId = function (object, value) {
    return Object.keys(object).find(key => object[key] === value);
}
//Функция создания заметки
let createNote = function () {
    if (getId(allFolders, document.getElementById("folderSelector").value)) // проверяем выбрана ли папка
    {
        let note = {
            name: document.getElementById("noteName").value,
            text: document.getElementById("noteText").value,
            folderId: getId(allFolders, document.getElementById("folderSelector").value),
            id: Date.now()
        }
        console.log(note);
        popup.classList.remove('modal--show'); // Закрываем окно

        let place = document.getElementById(note.folderId);
        console.log(place);
        let title = document.createElement('p');
        title.textContent = note.name;
        title.classList.add('noteTitle');
        title.id = note.id;
        // клик по заметке 
        title.addEventListener('click', noteClicked);
        place.appendChild(title);
        allNotes.push(note);
        console.log(allNotes);
    }
    else { //если папка не выбрана
        popup.classList.remove('modal--show');
        alert('Нельзя создать заметку без папки!');

    }
}
// Функция просмотра заметки 
let noteClicked = function (evt) {
    // чистим окно просмотра заметки
    let contentPlace = document.querySelector('.noteReader__content');
    while (contentPlace.firstChild) {
        contentPlace.firstChild.remove();
    }
    noteReaderModal.classList.add('modal--show');
    for (let j = 0; j < allNotes.length; j++) {
        console.log(allNotes[j].id);
        if (allNotes[j].id == evt.target.id) {
            let contentPlace = document.querySelector('.noteReader__content');
            let noteName = document.createElement('p');
            noteName.textContent = allNotes[j].name;
            console.log(allNotes[j].name);
            let noteText = document.createElement('p');
            noteText.textContent = allNotes[j].text;
            contentPlace.appendChild(noteName);
            contentPlace.appendChild(noteText);

        }
    }


}

//Эвенты на кнопках Кнопки
buttonCreateFolder.addEventListener('click', function () {
    createFolder();
});
buttonCreateNote.addEventListener('click', function () {
    popup.classList.add('modal--show');
    folderSelectorUpdate(allFolders);
});

closePopupButton.addEventListener('click', function () {
    popup.classList.remove('modal--show');
})

document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
        popup.classList.remove('modal--show');
        noteReaderModal.classList.remove('modal--show');
    }
})
closeNoteReaderButton.addEventListener('click', function () {
    noteReaderModal.classList.remove('modal--show');
})

buttonSave.addEventListener('click', function () {
    console.log(allFolders);
    console.log(allNotes);
    localStorage.setItem("folders", JSON.stringify(allFolders));
    localStorage.setItem("notes", JSON.stringify(allNotes));
})

buttonDel.addEventListener('click', function () {
    localStorage.clear('folders');
    localStorage.clear('notes');
    for (let key in allFolders) {
        let del = document.getElementById(key);
        del.remove();
    }
    allFolders = {};
    allNotes = [];
})

buttonCreate.addEventListener('click', function () {
    createNote();
})


//Создаём папки из массива
let foldersFromMem = 0;
(function (memFolders) {
    if (memFolders !== false) {
        for (let key in memFolders) {
            let element = document.createElement('div');
            element.classList.add('folder');
            element.classList.add('folder-closed');
            element.id = key;
            // Исправить порядок текста и картинки --------------------------------------------------------------------------------------------------------
            let folderTitle = document.createElement('p');
            folderTitle.classList.add('.folder-name');
            folderTitle.textContent = memFolders[key];
            element.appendChild(folderTitle);
            let folderImage = document.createElement('img');
            folderImage.src = 'img/folder-closed.svg';
            folderImage.style.width = '48px';
            folderImage.style.height = '48px';
            folderTitle.appendChild(folderImage);

            foldersList.appendChild(element);
            folderTitle.addEventListener('click', folderToggle);
        }
    }
})(allFolders);

    // Создаём заметки из массива
    (function (notes) {
        if (notes !== false) {
            for (let j = 0; j < notes.length; j++) {
                let note = {
                    name: notes[j].name,
                    text: notes[j].text,
                    folderId: notes[j].folderId,
                    id: notes[j].id
                    
                }
                console.log(note);
                let place = document.getElementById(note.folderId);
                let title = document.createElement('p');
                title.textContent = note.name;
                title.classList.add('noteTitle');
                title.id = note.id;
                // клик по заметке
                title.addEventListener('click', noteClicked);
                place.appendChild(title);
            }
        }
    })(allNotes);