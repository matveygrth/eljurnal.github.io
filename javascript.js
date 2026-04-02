// Ждем полной загрузки документа
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ИНИЦИАЛИЗАЦИЯ ДАННЫХ (БАЗА ДАННЫХ)
    let users = JSON.parse(localStorage.getItem('pj_users')) || {};
    let journal = JSON.parse(localStorage.getItem('pj_data')) || [];
    const activeUser = sessionStorage.getItem('activeUser');

    // --- ЛОГИКА СТРАНИЦЫ ВХОДА И РЕГИСТРАЦИИ (auth.html) ---
    
    // Функция регистрации
    window.handleRegister = function() {
        const u = document.getElementById('regUser')?.value.trim();
        const p = document.getElementById('regPass')?.value.trim();
        const v = document.getElementById('regVerify')?.checked;

        if (!u || !p) return alert("Заполни логин и пароль!");
        if (users[u]) return alert("Этот логин уже занят!");

        // Сохраняем в "БД"
        users[u] = { pass: p, verified: v };
        localStorage.setItem('pj_users', JSON.stringify(users));
        
        // Автоматический вход после регистрации
        sessionStorage.setItem('activeUser', u);
        window.location.href = 'index.html';
    };

    // Функция входа
    window.handleAuth = function() {
        const u = document.getElementById('logUser')?.value.trim();
        const p = document.getElementById('logPass')?.value.trim();

        if (users[u] && users[u].pass === p) {
            sessionStorage.setItem('activeUser', u);
            window.location.href = 'index.html';
        } else {
            alert("Неверный логин или пароль!");
        }
    };

    // --- ЛОГИКА ЖУРНАЛА (index.html) ---

    function updateUI() {
        const tableBody = document.getElementById('tableBody');
        const displayUser = document.getElementById('displayUser');
        const badgeSlot = document.getElementById('badgeSlot');
        const totalRecords = document.getElementById('totalRecords');

        if (!activeUser) return;

        // Имя и галочка
        if (displayUser) displayUser.innerText = activeUser;
        if (badgeSlot && users[activeUser]?.verified) {
            badgeSlot.innerHTML = '<span style="color:#0ea5e9; text-shadow: 0 0 10px #0ea5e9">✔</span>';
            const vBtn = document.getElementById('getVerifyBtn');
            if (vBtn) vBtn.style.display = 'none';
        }

        // Таблица (Добавление людей)
        if (tableBody) {
            tableBody.innerHTML = journal.map((item, i) => `
                <tr>
                    <td>${item.name}</td>
                    <td>${item.sub}</td>
                    <td><b style="color:#0ea5e9">${item.grade}</b></td>
                    <td><button onclick="deleteRow(${i})" style="color:red; background:none; border:none; cursor:pointer">✕</button></td>
                </tr>
            `).join('');
        }

        if (totalRecords) totalRecords.innerText = journal.length;
    }

    // Обработка формы добавления
    const gradeForm = document.getElementById('gradeForm');
    if (gradeForm) {
        gradeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newEntry = {
                name: document.getElementById('student').value,
                sub: document.getElementById('subject').value,
                grade: document.getElementById('grade').value
            };

            journal.push(newEntry);
            localStorage.setItem('pj_data', JSON.stringify(journal));
            
            e.target.reset();
            updateUI();
        });
    }

    // Глобальные функции (чтобы кнопки в HTML их видели)
    window.deleteRow = (i) => {
        journal.splice(i, 1);
        localStorage.setItem('pj_data', JSON.stringify(journal));
        updateUI();
    };

    window.logout = () => {
        sessionStorage.clear();
        window.location.href = 'auth.html';
    };

    window.getVerified = () => {
        if (users[activeUser]) {
            users[activeUser].verified = true;
            localStorage.setItem('pj_users', JSON.stringify(users));
            updateUI();
        }
    };

    window.toggleAuth = (isReg) => {
        document.getElementById('loginBox').style.display = isReg ? 'none' : 'block';
        document.getElementById('regBox').style.display = isReg ? 'block' : 'none';
    };

    // Запуск отрисовки если мы в журнале
    if (activeUser) updateUI();
});
document.addEventListener('DOMContentLoaded', () => {
    const user = sessionStorage.getItem('user');
    if(!user) window.location.href = 'auth.html';

    const dbUsers = JSON.parse(localStorage.getItem('users')) || {};
    let journal = JSON.parse(localStorage.getItem('journal')) || [];

    function update() {
        // Обновляем инфо об аккаунте вверху
        uName.innerText = user;
        if(dbUsers[user]?.verified) {
            uBadge.innerHTML = '<span style="color:#2f81f7; font-size:12px; text-shadow:0 0 10px #2f81f7">✔ Верифицирован</span>';
        }

        // Обновляем таблицу
        tableBody.innerHTML = journal.map((item, i) => `
            <tr>
                <td>${item.n}</td><td>${item.s}</td>
                <td><b style="color:#2f81f7">${item.g}</b></td>
                <td><button onclick="remove(${i})" style="color:red; background:none; border:none; cursor:pointer">✕</button></td>
            </tr>
        `).join('');
        count.innerText = journal.length;
        localStorage.setItem('journal', JSON.stringify(journal));
    }

    gradeForm.onsubmit = (e) => {
        e.preventDefault();
        journal.push({ n: s.value, s: sub.value, g: g.value });
        e.target.reset();
        update();
    };

    window.remove = (i) => { journal.splice(i, 1); update(); };
    update();
});

