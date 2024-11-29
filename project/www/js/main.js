//page-load settings
const pages = {
    home: {html: 'home.html', css: 'css/home.css'},
    graph: {html: '', css: ''},
    archive: {html: 'archive.html', css: 'css/archive.css'},
    settings: {html: 'settings.html', css: 'css/settings.css'},

    reminder: {html: 'listReminder.html', css: 'css/manageTasks.css'},
    dailyTasks: {html: 'listDailyTasks.html', css: 'css/manageTasks.css'},
    weeklyTasks: {html: 'listWeeklyTasks.html', css: 'css/manageTasks.css'},
    monthlyTasks: {html: 'listMonthlyTasks.html', css: 'css/manageTasks.css'},
    
    makeNewReminder: {html: 'makeNewReminder.html', css: 'css/makeNew.css'},
    makeNewDailyTask: {html: 'makeNewDailyTask.html', css: 'css/makeNew.css'},
    makeNewWeeklyTask: {html: 'makeNewWeeklyTask.html', css: 'css/makeNew.css'},
    makeNewMonthlyTask: {html: 'makeNewMonthlyTask.html', css: 'css/makeNew.css'},
}

const cssLink = document.querySelector('#dynamicCss')

function loadPage(pageKey){
    const page = pages[pageKey]
    
    if(!page){
        return;
    }

    fetch(page.html)
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html
            cssLink.href = page.css

            if(pageKey === 'home'){
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#reminder').addEventListener('click', () => loadPage('reminder'))
                document.querySelector('#dailyTasks').addEventListener('click', () => loadPage('dailyTasks'))
                document.querySelector('#weeklyTasks').addEventListener('click', () => loadPage('weeklyTasks'))
                document.querySelector('#monthlyTasks').addEventListener('click', () => loadPage('monthlyTasks'))
            }

            if(pageKey === 'reminder'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewReminder'))
                
                showReminder()
            }

            if(pageKey === 'dailyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewDailyTask'))
            }

            if(pageKey === 'weeklyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewWeeklyTask'))
            }

            if(pageKey === 'monthlyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewMonthlyTask'))
            }

            if(pageKey === 'makeNewReminder'){
                document.querySelector('#okButton').addEventListener('click', () => addReminder())
                document.querySelector('#okButton').addEventListener('click', () => loadPage('reminder'))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('reminder'))
            }

            if(pageKey === 'makeNewDailyTask'){
                document.querySelector('#okButton').addEventListener('click', () => loadPage('dailyTasks'))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('dailyTasks'))
            }

            if(pageKey === 'makeNewWeeklyTask'){
                document.querySelector('#okButton').addEventListener('click', () => loadPage('weeklyTasks'))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('weeklyTasks'))
            }

            if(pageKey === 'makeNewMonthlyTask'){
                document.querySelector('#okButton').addEventListener('click', () => loadPage('monthlyTasks'))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('monthlyTasks'))
            }

            if(pageKey === 'archive'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))
            }

            if(pageKey === 'settings'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
            }
        })
        .catch(error => console.error('ページ読み込みエラー', error))
}

loadPage('home')

//general settings
let exp = document.querySelector('#levelNum')
let reminderCnt = document.querySelector('#reminderNum')

//reminder settings
function showReminder(){
    let list = getReminderStorage()
    let contents = document.querySelector("#contents")
    contents.innerHTML = ""

    list.forEach(reminder => {
        let contentBox = document.createElement("div")
        contentBox.classList.add("contentsBox")
        contentBox.innerHTML = `
            <input type="checkbox" name="#">
            <button class="content">
                <p class="taskTitle">${reminder.title}</p>
                <p class="taskDesc">${reminder.description}</p>
                <input class="taskDate" type="date" value="${reminder.date}" readonly>
                <input class="taskTime" type="time" value="${reminder.time}" readonly>
            </button>
        `

        contents.appendChild(contentBox)
    });
}

function addReminder(){
    let taskTitle = document.querySelector('#taskTitle').value
    let taskDesc = document.querySelector('#taskDesc').value
    let taskDate = document.querySelector('#taskDate').value
    let taskTime = document.querySelector('#taskTime').value

    if(taskTitle === ""){
        alert("タイトルを入力してください")
        return
    } else {
        addReminderStorage(taskTitle, taskDesc, taskDate, taskTime);
    }
}

function getReminderStorage(){
    let list = localStorage.getItem("ReminderList")
    if(list == null){
        return []
    } else {
        return JSON.parse(list)
    }
}

function addReminderStorage(taskTitle, taskDesc, taskDate, taskTime){
    let list = getReminderStorage()
    list.push({
        title: taskTitle,
        description: taskDesc,
        date: taskDate,
        time: taskTime
    })
    setReminderStorage(list)
}

function setReminderStorage(list){
    localStorage.setItem("ReminderList", JSON.stringify(list))
}