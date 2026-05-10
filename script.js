// ========== ДАНІ КОЛОНІЇ (ЗМІННІ/МАСИВИ) ==========
let resources = {
    water: 380,
    oxygen: 64,
    energy: 100,
    food: 280
};

let systems = {
    lifeSupport: 78,
    energyGrid: 85,
    agriculture: 65
};

let missionProgressValue = 12;
let solCounterValue = 147;
let gameActive = true;

const crewMembers = [
    { name: "Д-р. Олена Скайлер", role: "Інженерія", active: true, specialty: "Ремонт систем" },
    { name: "Мігель Рохас", role: "Біосфера", active: true, specialty: "Гідропоніка" },
    { name: "Хікарі Танака", role: "Енергетик", active: true, specialty: "Сонячна енергія" },
    { name: "Лейла Хан", role: "Зв'язок", active: true, specialty: "Комунікації" }
];

let eventLogs = [
    "🔹 Система активована. Ласкаво просимо, командере!",
    "🛰️ Синхронізація з орбітальним модулем..."
];

const actions = [
    { id: "extract_water", label: "💧 Добути воду", effect: { water: 25, energy: -8, missionInc: 3 }, log: "Добуто підземну воду з покладів льоду." },
    { id: "produce_oxygen", label: "🌬️ Активувати MOXIE", effect: { oxygen: 12, energy: -12, missionInc: 4 }, log: "Генератор MOXIE виробив кисень." },
    { id: "solar_boost", label: "☀️ Сонячні батареї", effect: { energy: 20, water: -2, missionInc: 2 }, log: "Сонячні панелі підвищили енергію." },
    { id: "hydroponics", label: "🌱 Зібрати урожай", effect: { food: 30, water: -10, oxygen: -2, missionInc: 3 }, log: "Гідропоніка дала свіжі овочі." },
    { id: "repair_life", label: "🛠️ Ремонт LifeSupport", effect: { lifeSupport: 12, energy: -10, missionInc: 2 }, log: "Систему життєзабезпечення відремонтовано" },
    { id: "emergency_protocol", label: "🚨 Аварійний протокол", effect: { lifeSupport: 8, energy: -15, water: -5, missionInc: 1 }, log: "Аварійні системи активовано!" },
    { id: "drone_scan", label: "🛸 Розвідка дроном", effect: { missionInc: 5, energy: -5 }, log: "Дрон знайшов нові ресурси на поверхні." },
    { id: "crew_rest", label: "😴 Відпочинок команди", effect: { oxygen: 3, energy: 5, missionInc: 1 }, log: "Команда відновила сили." }
];

// ========== HELPER ФУНКЦІЇ ==========
function clampResources() {
    resources.water = Math.min(600, Math.max(0, resources.water));
    resources.oxygen = Math.min(100, Math.max(0, resources.oxygen));
    resources.energy = Math.min(100, Math.max(0, resources.energy));
    resources.food = Math.min(550, Math.max(0, resources.food));
    systems.lifeSupport = Math.min(100, Math.max(0, systems.lifeSupport));
    systems.energyGrid = Math.min(100, Math.max(0, systems.energyGrid));
    systems.agriculture = Math.min(100, Math.max(0, systems.agriculture));
    missionProgressValue = Math.min(100, Math.max(0, missionProgressValue));
}

function addEvent(message) {
    eventLogs.unshift(`🕒 SOL ${solCounterValue} • ${message}`);
    if (eventLogs.length > 12) eventLogs.pop();
    renderEvents();
}

function renderEvents() {
    const logDiv = document.getElementById("eventsLog");
    if (!logDiv) return;
    logDiv.innerHTML = eventLogs.map(ev => `<div class="event-entry">${ev}</div>`).join('');
}

function renderResources() {
    const container = document.getElementById("resourcesList");
    if (!container) return;
    container.innerHTML = `
        <div class="resource-item"><span class="resource-name">💧 ВОДА</span><span class="resource-value">${Math.floor(resources.water)} л</span></div>
        <div class="resource-item"><span class="resource-name">🌬️ КИСЕНЬ</span><span class="resource-value">${Math.floor(resources.oxygen)}%</span></div>
        <div class="resource-item"><span class="resource-name">⚡ ЕНЕРГІЯ</span><span class="resource-value">${Math.floor(resources.energy)}%</span></div>
        <div class="resource-item"><span class="resource-name">🍅 ЇЖА</span><span class="resource-value">${Math.floor(resources.food)} од.</span></div>
    `;
    const warningDiv = document.getElementById("warningMsg");
    let warnings = [];
    if (resources.water < 50) warnings.push("⚠️ Дефіцит води!");
    if (resources.oxygen < 25) warnings.push("⚠️ Кисень на межі!");
    if (resources.energy < 15) warnings.push("⚠️ Енергокриза!");
    if (resources.food < 40) warnings.push("⚠️ Голод загрожує!");
    warningDiv.innerHTML = warnings.join(" ") || "✅ Всі системи в межах норми";
}

function renderSystems() {
    const sysContainer = document.getElementById("systemsStatus");
    if (!sysContainer) return;
    sysContainer.innerHTML = `
        <div class="system-row"><div class="system-name"><span>🫁 Життєзабезпечення</span><span>${Math.floor(systems.lifeSupport)}%</span></div><div class="progress-bg"><div class="progress-fill" style="width: ${systems.lifeSupport}%;"></div></div></div>
        <div class="system-row"><div class="system-name"><span>⚡ Енергомережа</span><span>${Math.floor(systems.energyGrid)}%</span></div><div class="progress-bg"><div class="progress-fill" style="width: ${systems.energyGrid}%;"></div></div></div>
        <div class="system-row"><div class="system-name"><span>🌿 Агрокомплекс</span><span>${Math.floor(systems.agriculture)}%</span></div><div class="progress-bg"><div class="progress-fill" style="width: ${systems.agriculture}%;"></div></div></div>
    `;
}

function renderCrew() {
    const crewUl = document.getElementById("crewList");
    if (!crewUl) return;
    crewUl.innerHTML = crewMembers.map(m => `<li>👨‍🔧 <strong>${m.name}</strong> — ${m.role}<br><small style="color:#ffa25b;">🔧 ${m.specialty}</small></li>`).join('');
}

function renderMission() {
    const progressBar = document.getElementById("missionProgress");
    const missionStatusSpan = document.getElementById("missionStatus");
    if (progressBar) progressBar.style.width = `${missionProgressValue}%`;
    if (missionStatusSpan) {
        if (missionProgressValue >= 100) missionStatusSpan.innerHTML = "🏆 МІСІЮ ВИКОНАНО! КОЛОНІЯ ПЕРЕМОГЛА!";
        else missionStatusSpan.innerHTML = `Поточний прогрес: ${Math.floor(missionProgressValue)}% до завершення глобальної місії.`;
    }
    const medalDiv = document.getElementById("medalArea");
    if (medalDiv) {
        if (missionProgressValue >= 100) medalDiv.innerHTML = "🏅✨ ВИ ГЕРОЙ МАРСУ — КОЛОНІЯ РОЗКВІТАЄ ✨🏅";
        else if (missionProgressValue > 50) medalDiv.innerHTML = "🔥 Прогрес вражає! Залишилося трохи.";
        else medalDiv.innerHTML = "⭐ Виконуйте завдання для розвитку бази.";
    }
}

function incrementSol() {
    solCounterValue++;
    document.getElementById("solCounter").innerText = solCounterValue;
}

// ========== ФУНКЦІЇ ВИПАДКОВИХ ПОДІЙ ==========

// Перевірка на критичні ресурси
function checkCriticalResources() {
    let critical = false;
    if (resources.water <= 10) {
        addEvent("💀 КРИТИЧНИЙ РІВЕНЬ ВОДИ! Негайно добудьте воду!");
        critical = true;
    }
    if (resources.oxygen <= 10) {
        addEvent("💀 КИСЕНЬ НА МЕЖІ ВИЖИВАННЯ!");
        critical = true;
    }
    if (resources.food <= 10) {
        addEvent("💀 ГОЛОД! Запасів їжі майже немає!");
        critical = true;
    }
    return critical;
}

// Випадкова подія (ВИПРАВЛЕНО)
function randomEvent() {
    if (!gameActive || missionProgressValue >= 100) return;
    
    const events = [
        { message: "🌪️ Пилова буря пошкодила сонячні панелі!", effects: { energy: -15 }, severe: false },
        { message: "✨ Вдале відкриття! Знайдено підземне джерело води!", effects: { water: 40 }, severe: false },
        { message: "🔧 Механічна поломка в системі життєзабезпечення", effects: { lifeSupport: -10 }, severe: true },
        { message: "📡 Отримано допомогу із Землі!", effects: { missionInc: 3, energy: 10 }, severe: false },
        { message: "🧬 Мутація рослин! Врожайність знизилась", effects: { food: -25, agriculture: -5 }, severe: true },
        { message: "🔋 Енергетичний сплеск! Системи перевантажено", effects: { energy: -20, energyGrid: -8 }, severe: true },
        { message: "💎 Знайдено цінні мінерали! Обмін з орбітою", effects: { missionInc: 5, energy: 5 }, severe: false },
        { message: "🌡️ Різке падіння температури! Витрати енергії зросли", effects: { energy: -12, lifeSupport: -5 }, severe: true }
    ];
    
    const randomEventObj = events[Math.floor(Math.random() * events.length)];
    
    // Застосування ефектів події
    if (randomEventObj.effects.water) resources.water += randomEventObj.effects.water;
    if (randomEventObj.effects.oxygen) resources.oxygen += randomEventObj.effects.oxygen;
    if (randomEventObj.effects.energy) resources.energy += randomEventObj.effects.energy;
    if (randomEventObj.effects.food) resources.food += randomEventObj.effects.food;
    if (randomEventObj.effects.lifeSupport) systems.lifeSupport += randomEventObj.effects.lifeSupport;
    if (randomEventObj.effects.energyGrid) systems.energyGrid += randomEventObj.effects.energyGrid;
    if (randomEventObj.effects.agriculture) systems.agriculture += randomEventObj.effects.agriculture;
    if (randomEventObj.effects.missionInc) missionProgressValue += randomEventObj.effects.missionInc;
    
    clampResources();
    addEvent(`🎲 ВИПАДКОВА ПОДІЯ: ${randomEventObj.message}`);
    renderResources();
    renderSystems();
    renderMission();
    
    // Додаткове повідомлення для серйозних подій
    if (randomEventObj.severe) {
        addEvent(`⚠️ СЕРЙОЗНА ПОДІЯ: ${randomEventObj.message}`);
    }
}

// Покращення колонії
function upgradeModule(module) {
    if (!gameActive || missionProgressValue >= 100) return;
    
    const upgrades = {
        greenhouse: { cost: 30, resource: "food", effect: 50, name: "Теплиця", system: "agriculture", systemBonus: 15 },
        waterRecycler: { cost: 25, resource: "water", effect: 40, name: "Рекуператор води", system: null, systemBonus: 0 },
        oxygenGenerator: { cost: 35, resource: "oxygen", effect: 20, name: "Генератор кисню", system: "lifeSupport", systemBonus: 12 }
    };
    
    const upgrade = upgrades[module];
    if (!upgrade) return;
    
    if (resources.energy >= upgrade.cost) {
        resources.energy -= upgrade.cost;
        if (upgrade.resource === "water") resources.water += upgrade.effect;
        else if (upgrade.resource === "oxygen") {
            resources.oxygen = Math.min(100, resources.oxygen + upgrade.effect);
        }
        else if (upgrade.resource === "food") resources.food += upgrade.effect;
        
        if (upgrade.system && upgrade.systemBonus) {
            systems[upgrade.system] = Math.min(100, systems[upgrade.system] + upgrade.systemBonus);
        }
        
        missionProgressValue += 5;
        clampResources();
        addEvent(`🏗️ ПОКРАЩЕННЯ: Збудовано ${upgrade.name}! +${upgrade.effect} до ${upgrade.resource}`);
        renderResources();
        renderSystems();
        renderMission();
    } else {
        addEvent(`❌ Недостатньо енергії для будівництва ${upgrade.name}! Потрібно ${upgrade.cost} енергії.`);
    }
}

// Статистика колонії
function showColonyStats() {
    const totalCrew = crewMembers.filter(m => m.active).length;
    const avgSystemHealth = (systems.lifeSupport + systems.energyGrid + systems.agriculture) / 3;
    const selfSufficiency = ((resources.food / 550) * 100).toFixed(1);
    const totalResources = resources.water + resources.oxygen + resources.energy + resources.food;
    
    addEvent(`📊 СТАТИСТИКА: Персонал: ${totalCrew}/4 | Ефективність систем: ${avgSystemHealth.toFixed(1)}% | Самодостатність: ${selfSufficiency}% | Загальні ресурси: ${Math.floor(totalResources)}`);
    return { totalCrew, avgSystemHealth, selfSufficiency, totalResources };
}

// Екстрена перезарядка систем (нова функція)
function emergencyReboot() {
    if (!gameActive || missionProgressValue >= 100) return;
    
    if (resources.energy >= 25) {
        resources.energy -= 25;
        systems.lifeSupport = Math.min(100, systems.lifeSupport + 20);
        systems.energyGrid = Math.min(100, systems.energyGrid + 15);
        systems.agriculture = Math.min(100, systems.agriculture + 10);
        addEvent("🔄 ЕКСТРЕНЕ ПЕРЕЗАВАНТАЖЕННЯ: Системи відновлено ціною 25 енергії!");
        renderSystems();
        renderResources();
    } else {
        addEvent("❌ Недостатньо енергії для екстреного перезавантаження! Потрібно 25 енергії.");
    }
}

// ========== ОСНОВНА ФУНКЦІЯ ЗАСТОСУВАННЯ ДІЙ ==========
function applyAction(action) {
    if (!gameActive || missionProgressValue >= 100) {
        addEvent("🏁 Місія завершена! Перезапустіть гру для нових викликів.");
        return;
    }
    
    // Перевірка чи є достатньо ресурсів для дії
    if (action.effect.energy && (resources.energy + action.effect.energy) < 0) {
        addEvent(`❌ Недостатньо енергії для ${action.label}! Потрібно ${Math.abs(action.effect.energy)} енергії.`);
        return;
    }
    
    if (action.effect.water && (resources.water + action.effect.water) < 0) {
        addEvent(`❌ Недостатньо води для ${action.label}!`);
        return;
    }
    
    if (action.effect.oxygen && (resources.oxygen + action.effect.oxygen) < 0) {
        addEvent(`❌ Недостатньо кисню для ${action.label}!`);
        return;
    }
    
    if (action.effect.food && (resources.food + action.effect.food) < 0) {
        addEvent(`❌ Недостатньо їжі для ${action.label}!`);
        return;
    }
    
    // Застосування ефектів дії
    if (action.effect.water) resources.water += action.effect.water;
    if (action.effect.oxygen) resources.oxygen += action.effect.oxygen;
    if (action.effect.energy) resources.energy += action.effect.energy;
    if (action.effect.food) resources.food += action.effect.food;
    if (action.effect.lifeSupport) systems.lifeSupport += action.effect.lifeSupport;
    if (action.effect.missionInc) missionProgressValue += action.effect.missionInc;
    
    clampResources();
    
    // Пасивна деградація систем
    systems.lifeSupport -= 2;
    systems.energyGrid -= 1.5;
    systems.agriculture -= 1;
    clampResources();
    
    incrementSol();
    addEvent(`${action.log} (Ефект: +${action.effect.missionInc || 0} до місії)`);
    
    // Перевірка на катастрофу
    if (resources.oxygen <= 0 || resources.water <= 0 || resources.energy <= 0 || resources.food <= 0) {
        addEvent("💀 КАТАСТРОФА! Колонія не витримала. Перезавантажте сторінку для нової спроби.");
        gameActive = false;
        disableButtons(true);
        return;
    }
    
    checkCriticalResources();
    
    if (missionProgressValue >= 100) {
        addEvent("🚀 ВІТАЄМО! Марс колонізовано успішно! Місія завершена тріумфально.");
        gameActive = false;
        disableButtons(true);
    }
    
    renderResources();
    renderSystems();
    renderMission();
}

function disableButtons(disabled) {
    const btns = document.querySelectorAll(".action-btn");
    btns.forEach(btn => {
        btn.disabled = disabled;
    });
}

function buildActionButtons() {
    const container = document.getElementById("actionButtons");
    if (!container) return;
    container.innerHTML = "";
    actions.forEach(action => {
        const btn = document.createElement("button");
        btn.innerText = action.label;
        btn.classList.add("action-btn");
        btn.addEventListener("click", () => applyAction(action));
        container.appendChild(btn);
    });
    
    const upgradeBtn = document.createElement("button");
    upgradeBtn.innerText = "🏗️ Покращити теплицю";
    upgradeBtn.classList.add("action-btn");
    upgradeBtn.addEventListener("click", () => upgradeModule("greenhouse"));
    container.appendChild(upgradeBtn);
    
    const statsBtn = document.createElement("button");
    statsBtn.innerText = "📊 Статистика";
    statsBtn.classList.add("action-btn");
    statsBtn.addEventListener("click", () => showColonyStats());
    container.appendChild(statsBtn);
    
    const rebootBtn = document.createElement("button");
    rebootBtn.innerText = "🔄 Екстрене перезавантаження";
    rebootBtn.classList.add("action-btn");
    rebootBtn.addEventListener("click", () => emergencyReboot());
    container.appendChild(rebootBtn);
}

function setupClearLog() {
    const clearBtn = document.getElementById("clearLogBtn");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            eventLogs = ["🧹 Журнал очищено командиром."];
            renderEvents();
            addEvent("Командир відновив лог подій");
        });
    }
}

function initDashboard() {
    buildActionButtons();
    renderResources();
    renderSystems();
    renderCrew();
    renderMission();
    renderEvents();
    setupClearLog();
    
    // Інтервал для автоматичної деградації та випадкових подій
    setInterval(() => {
        if (!gameActive || missionProgressValue >= 100) return;
        
        // Пасивна деградація
        systems.lifeSupport = Math.max(0, systems.lifeSupport - 1);
        systems.energyGrid = Math.max(0, systems.energyGrid - 1);
        systems.agriculture = Math.max(0, systems.agriculture - 1);
        clampResources();
        renderSystems();
        
        // Випадкова подія (30% шанс кожні 20 секунд)
        if (Math.random() < 0.3) {
            randomEvent();
        }
        
        // Попередження про критичні системи
        if (systems.lifeSupport <= 15) addEvent("🔴 Критичний стан життєзабезпечення!");
        if (systems.energyGrid <= 15) addEvent("🔴 Енергосистема на межі відмови!");
        if (systems.agriculture <= 15) addEvent("🔴 Агрокомплекс потребує ремонту!");
        
        renderResources();
    }, 20000);
}

window.addEventListener("DOMContentLoaded", initDashboard);