//general settings
let usrLevel
let maxInCurrentLevel
let valueInCurrentLevel
const reminderPoint = 20
const dailyPoint = 30
const weeklyPoint = 70
const reminderList = "ReminderList"
const dailyList = "DailyList"
const weeklyList = "WeeklyList"
const dailyList_cpy = "DailyList_cpy"
const weeklyList_cpy = "WeeklyList_cpy"
loadLevelAndExp()

//page-load settings
const pages = {
    home: {html: 'home.html', css: 'css/home.css'},
    graph: {html: 'graph.html', css: 'css/graph.css'},
    archive: {html: 'archive.html', css: 'css/archive.css'},
    settings: {html: 'settings.html', css: 'css/settings.css'},

    reminder: {html: 'listReminder.html', css: 'css/manageTasks.css'},
    dailyTasks: {html: 'listDailyTasks.html', css: 'css/manageTasks.css'},
    weeklyTasks: {html: 'listWeeklyTasks.html', css: 'css/manageTasks.css'},
    
    makeNewReminder: {html: 'makeNewReminder.html', css: 'css/makeNew.css'},
    makeNewDailyTask: {html: 'makeNewDailyTask.html', css: 'css/makeNew.css'},
    makeNewWeeklyTask: {html: 'makeNewWeeklyTask.html', css: 'css/makeNew.css'},

    editReminder: {html: 'editReminder.html', css: 'css/editTask.css'},
    editDailyTask: {html: 'editDailyTask.html', css: 'css/editTask.css'},
    editWeeklyTask: {html: 'editWeeklyTask.html', css: 'css/editTask.css'}
}

const cssLink = document.querySelector('#dynamicCss')

function loadPage(pageKey){
    let page = pages[pageKey]

    fetch(page.html)
        .then(response => response.text())
        .then(html => {
            document.querySelector('main').innerHTML = html
            cssLink.href = page.css

            if(pageKey === 'home'){
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#reminder').addEventListener('click', () => loadPage('reminder'))
                document.querySelector('#dailyTasks').addEventListener('click', () => loadPage('dailyTasks'))
                document.querySelector('#weeklyTasks').addEventListener('click', () => loadPage('weeklyTasks'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))

                countRemainingTasks()
            }

            if(pageKey === 'reminder'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewReminder'))
                document.querySelector('#taskclear').addEventListener('click', () => archiveTask(reminderList))
                
                showTasks(reminderList)
                loadFontSize()
            }

            if(pageKey === 'dailyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewDailyTask'))
                document.querySelector('#taskclear').addEventListener('click', () => archiveTask(dailyList))

                showTasks(dailyList)
                loadDailyList_cpy()
                loadFontSize()
            }

            if(pageKey === 'weeklyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewWeeklyTask'))
                document.querySelector('#taskclear').addEventListener('click', () => archiveTask(weeklyList))

                showTasks(weeklyList)
                loadWeeklyList_cpy()
                loadFontSize()
            }

            if(pageKey === 'makeNewReminder'){
                document.querySelector('#okButton').addEventListener('click', () => addTask(reminderList))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('reminder'))
            }

            if(pageKey === 'makeNewDailyTask'){
                document.querySelector('#okButton').addEventListener('click', () => addTask(dailyList))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('dailyTasks'))
            }

            if(pageKey === 'makeNewWeeklyTask'){
                document.querySelector('#okButton').addEventListener('click', () => addTask(weeklyList))
                document.querySelector('#cancelButton').addEventListener('click', () => loadPage('weeklyTasks'))
            }

            if(pageKey === 'archive'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))
                showArchive()
                loadFontSize()
            }

            if(pageKey === 'graph'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                countArchivedTasks()
                showExpGraph()
            }

            if(pageKey === 'settings'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#fontSizeSet').value = localStorage.getItem('fontSize')
            }
        })
        .catch(error => console.error('ページ読み込みエラー', error))
}

loadPage('home')

//basic task management settings
function countRemainingTasks(){
    let reminderCnt = 0
    let dailyTaskCnt = 0
    let weeklyTaskCnt = 0

    let remainingReminderList = getStorage(reminderList)
    let remainingDailyList = getStorage(dailyList)
    let remainingWeeklyList = getStorage(weeklyList)

    for(let i = 0; i < remainingReminderList.length; i++){
        reminderCnt++
    }

    for(let i = 0; i < remainingDailyList.length; i++){
        dailyTaskCnt++
    }

    for(let i = 0; i < remainingWeeklyList.length; i++){
        weeklyTaskCnt++
    }

    document.querySelector("#reminderNum").textContent = reminderCnt
    document.querySelector("#dailyNum").textContent = dailyTaskCnt
    document.querySelector("#weeklyNum").textContent = weeklyTaskCnt
}

function showTasks(listName){
    let taskList = getStorage(listName)
    let contents = document.querySelector("#contents")
    contents.innerHTML = ""

    if(listName === reminderList){
        taskList.forEach((reminder, index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#" data-title="${reminder.title}" data-description="${reminder.description}" data-date="${reminder.date}" data-DOW="${reminder.DOW}" data-time="${reminder.time}">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${reminder.title}</p>
                    <p class="taskDesc">${reminder.description}</p>
                    <input class="taskDate" type="date" value="${reminder.date}" readonly>
                    <input class="taskTime" type="time" value="${reminder.time}" readonly>
                </button>
            `
            contentBox.querySelector('.content').addEventListener('click', () => editTask(listName, index))
    
            contents.appendChild(contentBox)
        });
    } else if(listName === dailyList){
        taskList.forEach((dailyTask, index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#" data-title="${dailyTask.title}" data-description="${dailyTask.description}" data-date="${dailyTask.date}" data-DOW="${dailyTask.DOW}" data-time="${dailyTask.time}">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${dailyTask.title}</p>
                    <p class="taskDesc">${dailyTask.description}</p>
                    <input class="taskTime" type="time" value="${dailyTask.time}" readonly>
                </button>
            `
            contentBox.querySelector('.content').addEventListener('click', () => editTask(listName, index))

            contents.appendChild(contentBox)
        });
    } else if(listName === weeklyList){
        taskList.forEach((weeklyTask, index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#" data-title="${weeklyTask.title}" data-description="${weeklyTask.description}" data-date="${weeklyTask.date}" data-DOW="${weeklyTask.DOW}" data-time="${weeklyTask.time}">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${weeklyTask.title}</p>
                    <p class="taskDesc">${weeklyTask.description}</p>
                    <div class="taskDOW"><p>${weeklyTask.DOW}</p></div>
                    <input class="taskTime" type="time" value="${weeklyTask.time}" readonly>
                </button>
            `
            contentBox.querySelector('.content').addEventListener('click', () => editTask(listName, index));

            contents.appendChild(contentBox)
        });
    }
}

function addTask(listName){
    if(listName == reminderList){
        let taskTitle = document.querySelector('#taskTitle').value
        let taskDesc = document.querySelector('#taskDesc').value
        let taskDate = document.querySelector('#taskDate').value
        let taskDOW = null
        let taskTime = document.querySelector('#taskTime').value

        if(taskTitle === ""){
            alert("タイトルを入力してください")
            return
        } else {
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime)
            loadPage('reminder')
        }
    } else if(listName === dailyList){
        let taskTitle = document.querySelector('#taskTitle').value
        let taskDesc = document.querySelector('#taskDesc').value
        let taskDate = null
        let taskDOW = null
        let taskTime = document.querySelector('#taskTime').value
        let savedYearData = new Date().getFullYear()
        let savedMonthData = new Date().getMonth() + 1
        let savedDateData = new Date().getDate()

        if(taskTitle === ""){
            alert("タイトルを入力してください")
            return
        } else {
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime)
            saveDailyList_cpy(taskTitle, taskDesc, taskDate, taskDOW, taskTime, savedYearData, savedMonthData, savedDateData)
            loadPage('dailyTasks')
        }
    } else if(listName === weeklyList){
        let taskTitle = document.querySelector('#taskTitle').value
        let taskDesc = document.querySelector('#taskDesc').value
        let taskDate = null
        let taskDOW
        let savedDOWData
        switch(document.querySelector('#taskDOW').value){
            case 'monday':
                taskDOW = '月'
                savedDOWData = 1
                break
            case 'tuesday':
                taskDOW = '火'
                savedDOWData = 2
                break
            case 'wednesday':
                taskDOW = '水'
                savedDOWData = 3
                break
            case 'thursday':
                taskDOW = '木'
                savedDOWData = 4
                break
            case 'friday':
                taskDOW = '金'
                savedDOWData = 5
                break
            case 'saturday':
                taskDOW = '土'
                savedDOWData = 6
                break
            case 'sunday':
                taskDOW = '日'
                savedDOWData = 0
                break
        }
        let taskTime = document.querySelector('#taskTime').value
        let savedYearData = new Date().getFullYear()
        let savedMonthData = new Date().getMonth() + 1
        let savedDateData = new Date().getDate()

        if(taskTitle === ""){
            alert("タイトルを入力してください")
            return
        } else {
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime)
            saveWeeklyList_cpy(taskTitle, taskDesc, taskDate, taskDOW, taskTime, savedDOWData, savedYearData, savedMonthData, savedDateData)
            loadPage('weeklyTasks')
        }
    }
}

function editTask(listName, index){
    let taskList = getStorage(listName)
    let task = taskList[index]

    if(listName === reminderList){
        loadPage('editReminder')

        setTimeout(() => {
            let taskTitle = document.querySelector('#taskTitle')
            let taskDesc = document.querySelector('#taskDesc')
            let taskDate = document.querySelector('#taskDate')
            let taskTime = document.querySelector('#taskTime')

            taskTitle.value = task.title
            taskDesc.value = task.description
            taskDate.value = task.date
            taskTime.value = task.time

            document.querySelector('#okButton').addEventListener('click', () => {
                if(taskTitle.value === ""){
                    alert("タイトルを入力してください")
                    return
                } else {
                    task.title = taskTitle.value
                    task.description = taskDesc.value
                    task.date = taskDate.value
                    task.DOW = null
                    task.time = taskTime.value

                    setStorage(listName, taskList)
                    loadPage('reminder')
                }
            })

            document.querySelector('#deleteButton').addEventListener('click', () => {
                taskList.splice(index, 1)
                setStorage(listName, taskList)
                loadPage('reminder')
            })
        }, 50)
    } else if(listName === dailyList){
        loadPage('editDailyTask')

        setTimeout(() => {
            let taskTitle = document.querySelector('#taskTitle')
            let taskDesc = document.querySelector('#taskDesc')
            let taskTime = document.querySelector('#taskTime')

            taskTitle.value = task.title
            taskDesc.value = task.description
            taskTime.value = task.time

            document.querySelector('#okButton').addEventListener('click', () => {
                if(taskTitle.value === ""){
                    alert("タイトルを入力してください")
                    return
                } else {
                    task.title = taskTitle.value
                    task.description = taskDesc.value
                    task.date = null
                    task.DOW = null
                    task.time = taskTime.value

                    setStorage(listName, taskList)
                    setStorage(dailyList_cpy, taskList)
                    loadPage('dailyTasks')
                }
            })

            document.querySelector('#deleteButton').addEventListener('click', () => {
                deleteDailyList_cpy(taskList)
                taskList.splice(index, 1)
                setStorage(listName, taskList)
                loadPage('dailyTasks')
            })
        }, 50)
    } else if(listName === weeklyList){
        loadPage('editWeeklyTask')
        setTimeout(() => {
            let taskTitle = document.querySelector('#taskTitle')
            let taskDesc = document.querySelector('#taskDesc')
            let taskDOW = document.querySelector('#taskDOW')
            let taskTime = document.querySelector('#taskTime')

            taskTitle.value = task.title
            taskDesc.value = task.description
            switch(task.DOW){
                case '月':
                    taskDOW.value = 'monday'
                    break
                case '火':
                    taskDOW.value = 'tuesday'
                    break
                case '水':
                    taskDOW.value = 'wednesday'
                    break
                case '木':
                    taskDOW.value = 'thursday'
                    break
                case '金':
                    taskDOW.value = 'friday'
                    break
                case '土':
                    taskDOW.value = 'saturday'
                    break
                case '日':
                    taskDOW.value = 'sunday'
                    break
            }
            taskTime.value = task.time

            document.querySelector('#okButton').addEventListener('click', () => {
                if(taskTitle.value === ""){
                    alert("タイトルを入力してください")
                    return
                } else {
                    task.title = taskTitle.value
                    task.description = taskDesc.value
                    task.date = null
                    switch(taskDOW.value){
                        case 'monday':
                            task.DOW = '月'
                            break
                        case 'tuesday':
                            task.DOW = '火'
                            break
                        case 'wednesday':
                            task.DOW = '水'
                            break
                        case 'thursday':
                            task.DOW = '木'
                            break
                        case 'friday':
                            task.DOW = '金'
                            break
                        case 'saturday':
                            task.DOW = '土'
                            break
                        case 'sunday':
                            task.DOW = '日'
                            break
                    }
                    task.time = taskTime.value

                    setStorage(listName, taskList)
                    setStorage(weeklyList_cpy, taskList)
                    loadPage('weeklyTasks')
                }
            })

            document.querySelector('#deleteButton').addEventListener('click', () => {
                deleteWeeklyList_cpy(taskList)
                taskList.splice(index, 1)
                setStorage(listName, taskList)
                loadPage('weeklyTasks')
            })
        }, 50)
    }
}

//archive settings
function showArchive(){
    deleteArchivedTask()

    let archiveList = getStorage("archive").reverse()
    let contents = document.querySelector("#contents")
    contents.innerHTML = ""

    archiveList.forEach((task) => {
        let contentBox = document.createElement("div")
        contentBox.classList.add("contentsBox")
        contentBox.innerHTML = `
            <button class="content">
                <p class="taskTitle">${task.title}</p>
                <p class="taskDesc">${task.description}</p>
                <input class="taskDate" type="date" value="${task.date}" readonly>
                <div class="taskDOW"><p>${task.DOW}</p></div>
                <input class="taskTime" type="time" value="${task.time}" readonly>
            </button>
        `    
        if(!task.date || task.date === null || task.date === "null"){
            let taskDateElement = contentBox.querySelector(".taskDate")
            taskDateElement.style.display = 'none'
        }

        if(!task.DOW || task.DOW === null || task.DOW === "null"){
            let taskDOWElement = contentBox.querySelector(".taskDOW")
            taskDOWElement.style.display = 'none'
        }

        if(!task.time || task.time === null || task.time === "null"){
            let taskTimeElement = contentBox.querySelector(".taskTime")
            taskTimeElement.style.display = 'none'
        }

        contents.appendChild(contentBox)
    });
}

function archiveTask(listName) {
    let taskList = getStorage(listName)
    let archiveList = getStorage("archive")
    let currentYear = new Date().getFullYear()
    let currentMonth = new Date().getMonth() + 1
    
    document.querySelectorAll(".contentsBox input[type=checkbox]:checked").forEach(task => {
        let taskData = {
            title: task.dataset.title,
            description: task.dataset.description,
            date: task.dataset.date,
            DOW: task.dataset.dow || task.dataset.DOW,
            time: task.dataset.time,
            archivedYear: currentYear,
            archivedMonth: currentMonth
        }
        
        let taskIndex = taskList.findIndex(element =>
            element.title === taskData.title
        )
        
        if (taskIndex !== -1) {
            taskList.splice(taskIndex, 1)
        }
        
        archiveList.push(taskData)
        countLevelAndExp(listName)
        saveExpHistory()
    })

    setStorage(listName, taskList)
    setStorage("archive", archiveList)
    
    if (listName === reminderList) {
        loadPage("reminder")
    } else if (listName === dailyList) {
        loadPage("dailyTasks")
    } else if (listName === weeklyList) {
        loadPage("weeklyTasks")
    }
}

function deleteArchivedTask() {
    let archiveList = getStorage("archive")
    let currentYear = new Date().getFullYear()
    let currentMonth = new Date().getMonth() + 1

    for (let i = archiveList.length - 1; i >= 0; i--) {
        let task = archiveList[i]
        let archivedYear = parseInt(task.archivedYear)
        let archivedMonth = parseInt(task.archivedMonth)

        let archivedDateValue = archivedYear * 12 + archivedMonth
        let currentDateValue = currentYear * 12 + currentMonth

        if (currentDateValue - archivedDateValue >= 11) {
            archiveList.splice(i, 1)
        }
    }

    setStorage("archive", archiveList)
}



//Level and Exp settings
function countLevelAndExp(listName){
    if(listName === reminderList){
        valueInCurrentLevel += reminderPoint
    } else if(listName === dailyList){
        valueInCurrentLevel += dailyPoint
    } else if(listName === weeklyList){
        valueInCurrentLevel += weeklyPoint
    }

    while(valueInCurrentLevel >= maxInCurrentLevel){
        usrLevel++
        maxInCurrentLevel = maxInCurrentLevel * 2
        valueInCurrentLevel -= maxInCurrentLevel / 2
    }

    toTheNextLevel = maxInCurrentLevel - valueInCurrentLevel
    document.querySelector('#levelCnt').textContent = toTheNextLevel
    document.querySelector('#levelProgressbar').value = valueInCurrentLevel
    document.querySelector('#levelProgressbar').max = maxInCurrentLevel
    document.querySelector('#levelNum').textContent = usrLevel

    saveLevelAndExp()
    checkIcon()
}

function saveLevelAndExp(){
    localStorage.setItem('usrLevel', usrLevel)
    localStorage.setItem('valueInCurrentLevel', valueInCurrentLevel)
    localStorage.setItem('maxInCurrentLevel', maxInCurrentLevel)

    saveExpHistory()
}

function loadLevelAndExp(){
    usrLevel = JSON.parse(localStorage.getItem('usrLevel'))
    valueInCurrentLevel = JSON.parse(localStorage.getItem('valueInCurrentLevel'))
    maxInCurrentLevel = JSON.parse(localStorage.getItem('maxInCurrentLevel'))

    if(usrLevel === null || valueInCurrentLevel === null || maxInCurrentLevel === null){
        usrLevel = 1
        maxInCurrentLevel = 10
        valueInCurrentLevel = 0
    }

    toTheNextLevel = maxInCurrentLevel - valueInCurrentLevel
    document.querySelector('#levelCnt').textContent = toTheNextLevel
    document.querySelector('#levelProgressbar').value = valueInCurrentLevel
    document.querySelector('#levelProgressbar').max = maxInCurrentLevel
    document.querySelector('#levelNum').textContent = usrLevel

    checkIcon()
}

function checkIcon(){
    usrLevel = JSON.parse(localStorage.getItem('usrLevel'))

    if(usrLevel >= 30){
        document.querySelector("#characterIcon").src = "./img/characterIcon/Lv30.png"
    } else if(usrLevel >= 20){
        document.querySelector("#characterIcon").src = "./img/characterIcon/Lv20.png"
    } else if(usrLevel >= 10){
        document.querySelector("#characterIcon").src = "./img/characterIcon/Lv10.png"
    } else {
        document.querySelector("#characterIcon").src = "./img/characterIcon/Lv1.png"
    }
}

//local-storage settings
function getStorage(listName){
    let storageList = localStorage.getItem(listName)
    if(storageList == null){
        return []
    } else {
        return JSON.parse(storageList)
    }
}

function addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime){
    let taskList = getStorage(listName)
    taskList.push({
        title: taskTitle,
        description: taskDesc,
        date: taskDate,
        DOW: taskDOW,
        time: taskTime
    })
    setStorage(listName, taskList)
}

function setStorage(listName, taskList){
    localStorage.setItem(listName, JSON.stringify(taskList))
}

function loadDailyList_cpy() {
    const storageList = getStorage("dailyList_cpy")
    if (storageList.length > 0) {
        let currentYear = new Date().getFullYear()
        let currentMonth = new Date().getMonth() + 1
        let currentDate = new Date().getDate()
        let dailyTasks = getStorage("dailyList")

        let updatedTasks = dailyTasks.slice()

        storageList.forEach(storedTask => {
            if ((parseInt(storedTask.savedYear) === currentYear && parseInt(storedTask.savedMonth) === currentMonth && parseInt(storedTask.savedDate) !== currentDate) || (parseInt(storedTask.savedYear) === currentYear && parseInt(storedTask.savedMonth) !== currentMonth && parseInt(storedTask.savedDate) === currentDate) || parseInt(storedTask.savedYear) !== currentYear) {
                let isTaskExisting = updatedTasks.some(
                    dailyTask => dailyTask.title === storedTask.title
                )

                if (!isTaskExisting) {
                    updatedTasks.push({
                        title: storedTask.title,
                        description: storedTask.description,
                        date: storedTask.date,
                        DOW: storedTask.DOW,
                        time: storedTask.time
                    })
                }
            }
        })

        setStorage("dailyList", updatedTasks);
    }
}

function deleteDailyList_cpy(task) {
    let copyList = getStorage(dailyList_cpy)
    if (copyList && copyList.length > 0) {
        copyList = copyList.filter(item => item.title !== task.title)
        setStorage(dailyList_cpy, copyList)
    }
}

function saveDailyList_cpy(taskTitle, taskDesc, taskDate, taskDOW, taskTime, savedYearData, savedMonthData, savedDateData) {
    let taskList = getStorage(dailyList_cpy)
    
    const existingTaskIndex = taskList.findIndex(task => task.title === taskTitle)
    if (existingTaskIndex !== -1) {
        taskList.splice(existingTaskIndex, 1)
    }
    
    taskList.push({
        title: taskTitle,
        description: taskDesc,
        date: taskDate,
        DOW: taskDOW,
        time: taskTime,
        savedYear: savedYearData,
        savedMonth: savedMonthData,
        savedDate: savedDateData
    });
    
    setStorage(dailyList_cpy, taskList)
}

function loadWeeklyList_cpy() {
    const storageList = getStorage("weeklyList_cpy")
    if (storageList.length > 0) {
        let currentYear = new Date().getFullYear()
        let currentMonth = new Date().getMonth() + 1
        let currentDay = new Date().getDate()
        let currentDOW = new Date().getDay()
        let weeklyTasks = getStorage("weeklyList")

        let updatedTasks = weeklyTasks.slice()

        storageList.forEach(storedTask => {
            if ((parseInt(storedTask.savedYear) === currentYear && parseInt(storedTask.savedMonth) === currentMonth && parseInt(storedTask.savedDate) !== currentDay && parseInt(storedTask.savedDOW) === currentDOW) || (parseInt(storedTask.savedYear) === currentYear && parseInt(storedTask.savedMonth) !== currentMonth &&parseInt(storedTask.savedDOW) === currentDOW) || (parseInt(storedTask.savedYear) !== currentYear && parseInt(storedTask.savedMonth) === currentMonth && parseInt(storedTask.savedDOW) === currentDOW)) {
                let isTaskExisting = updatedTasks.some(
                    weeklyTask => weeklyTask.title === storedTask.title
                )

                if (!isTaskExisting) {
                    updatedTasks.push({
                        title: storedTask.title,
                        description: storedTask.description,
                        date: storedTask.date,
                        DOW: storedTask.DOW,
                        time: storedTask.time
                    })
                }
            }
        })

        setStorage("weeklyList", updatedTasks);
    }
}

function deleteWeeklyList_cpy(task) {
    let copyList = getStorage(weeklyList_cpy)
    if (copyList && copyList.length > 0) {
        copyList = copyList.filter(item => item.title !== task.title)
        setStorage(weeklyList_cpy, copyList)
    }
}

function saveWeeklyList_cpy(taskTitle, taskDesc, taskDate, taskDOW, taskTime, savedDOWData, savedYearData, savedMonthData, savedDateData) {
    let taskList = getStorage(weeklyList_cpy)
    
    const existingTaskIndex = taskList.findIndex(task => task.title === taskTitle)
    if (existingTaskIndex !== -1) {
        taskList.splice(existingTaskIndex, 1)
    }
    
    taskList.push({
        title: taskTitle,
        description: taskDesc,
        date: taskDate,
        DOW: taskDOW,
        time: taskTime,
        savedDOW: savedDOWData,
        savedYear: savedYearData,
        savedMonth: savedMonthData,
        savedDate: savedDateData
    });
    
    setStorage(weeklyList_cpy, taskList)
}

//font settings
//フォントを取り込んでローカルに保存する関数
function saveFontSize(){
    let fontSize = document.getElementById('fontSizeSet').value;

    localStorage.setItem('fontSize', fontSize);

    patchFontSize(fontSize);
    resetData()
}

//ページ読み込み時にローカルストレージからフォントサイズを読み込む関数
function loadFontSize(){

    let savedFontSize = localStorage.getItem('fontSize')
    let fontSize = savedFontSize

    if(fontSize == undefined){
        fontSize = '1';
    }

    patchFontSize(fontSize);
}

//フォントサイズを適用する関数
function patchFontSize(fontSizePatch){
    let titlesize;
    let descsize;

    switch(fontSizePatch) {
        case '0' :
            titlesize = '3dvh';
            descsize = '1.5dvh';
            break;
        case '1' :
            titlesize = '3.5dvh';
            descsize = '2dvh';
            break;
        case '2' :
            titlesize = '4dvh';
            descsize = '2.5dvh';
            break;
    }

    const titles = document.querySelectorAll('.taskTitle')
    const descs = document.querySelectorAll('.taskDesc')

    titles.forEach(title => {
        title.style.fontSize = titlesize
    })

    descs.forEach(desc => {
        desc.style.fontSize = descsize
    })
}

//graph settings
function showArchievementGraph(currentMonthData, oneMonthAgoData, twoMonthAgoData, threeMonthAgoData, fourMonthAgoData, fiveMonthAgoData){
    let barCtx = document.getElementById("barChart-achievement").getContext('2d')
    let currentMonth = new Date().getMonth() + 1
    let oneMonthAgo = currentMonth - 1
    let twoMonthAgo = currentMonth - 2
    let threeMonthAgo = currentMonth - 3
    let fourMonthAgo = currentMonth - 4
    let fiveMonthAgo = currentMonth - 5

    if(oneMonthAgo < 1){
        oneMonthAgo += 12
    }

    if(twoMonthAgo < 1){
        twoMonthAgo += 12
    }

    if(threeMonthAgo < 1){
        threeMonthAgo += 12
    }

    if(fourMonthAgo < 1){
        fourMonthAgo += 12
    }

    if(fiveMonthAgo < 1){
        fiveMonthAgo += 12
    }

    let barConfig = {
        type: 'bar',
        data: {
            labels: [`${fiveMonthAgo}月`, `${fourMonthAgo}月`, `${threeMonthAgo}月`, `${twoMonthAgo}月`, `${oneMonthAgo}月`, `${currentMonth}月`],
            datasets: [{
                data: [fiveMonthAgoData, fourMonthAgoData, threeMonthAgoData, twoMonthAgoData, oneMonthAgoData, currentMonthData],
                label: 'label',
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)', 
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 2,
                borderRadius: 8,
                maxBarThickness: 50 
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'end',
                    clamp: true,
                    font: {
                        weight: 'bold',
                        size: 14,
                    },
                    color: 'black',
                    formatter: (value) => value
                },
                tooltip: {
                    enabled: false
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    ticks: {
                        stepSize: 1
                    }
                }
            },
            layout: {
                padding: {
                    top: 30
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
        }
    }
    let barChart = new Chart(barCtx, barConfig)
}

function countArchivedTasks(){
    let archiveList = getStorage("archive") || []
    let currentYear = new Date().getFullYear()
    let currentMonth = new Date().getMonth() + 1
    
    let currentMonthData = 0
    let oneMonthAgoData = 0
    let twoMonthAgoData = 0
    let threeMonthAgoData = 0
    let fourMonthAgoData = 0
    let fiveMonthAgoData = 0

    if(archiveList.length > 0){
        for(let i = 0; i < archiveList.length; i++){
            monthDifference = (currentYear - archiveList[i].archivedYear) * 12 + (currentMonth - archiveList[i].archivedMonth)

            if(monthDifference === 0){
                currentMonthData++
            } else if(monthDifference === 1){
                oneMonthAgoData++
            } else if(monthDifference === 2){
                twoMonthAgoData++
            } else if(monthDifference === 3){
                threeMonthAgoData++
            } else if(monthDifference === 4){
                fourMonthAgoData++
            } else if(monthDifference === 5){
                fiveMonthAgoData++
            }
        }
    }

    showArchievementGraph(currentMonthData, oneMonthAgoData, twoMonthAgoData, threeMonthAgoData, fourMonthAgoData, fiveMonthAgoData)
}

function showExpGraph() {
    let lineCtx = document.getElementById("lineChart-exp").getContext('2d')
    
    let currentYear = new Date().getFullYear()
    let currentMonth = new Date().getMonth() + 1
    
    function calculatePastMonth(monthsAgo) {
        let targetMonth = currentMonth - monthsAgo
        let targetYear = currentYear
        if (targetMonth <= 0) {
            targetMonth += 12;
            targetYear -= 1;
        }
        return { month: targetMonth, year: targetYear }
    }

        function getMonthlyExp(monthsAgo) {
        let { month, year } = calculatePastMonth(monthsAgo)
        let expHistory = getStorage("expHistory") || []
        let entry = expHistory.find(e => e.month === month && e.year === year)
        return entry ? entry.value : 0
    }
    
    let monthlyData = []
    let labels = []
    
    for (let i = 5; i >= 0; i--) {
        let { month } = calculatePastMonth(i)
        monthlyData.push(getMonthlyExp(i))
        labels.push(`${month}月`)
    }
    
    let lineConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: monthlyData,
                label: 'EXP',
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        plugins: [ChartDataLabels],
        options: {
            plugins: {
                legend: {
                    display: false
                },
                datalabels: {
                    display: true,
                    anchor: 'end',
                    align: 'top',
                    offset: 5,
                    font: {
                        weight: 'bold',
                        size: 14,
                    },
                    color: 'black',
                    formatter: (value) => Math.round(value)
                },
                tooltip: {
                    enabled: true,
                    mode: 'index',
                    intersect: false
                }
            },
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: Math.ceil(Math.max(...monthlyData) / 5)
                    }
                }
            },
            layout: {
                padding: {
                    top: 30
                }
            },
            animation: {
                duration: 1500,
                easing: 'easeInOutQuart'
            },
        }
    }
    new Chart(lineCtx, lineConfig)
}

function saveExpHistory() {
    let currentYear = new Date().getFullYear()
    let currentMonth = new Date().getMonth() + 1
    let expHistory = getStorage("expHistory") || []
    
    let currentEntry = expHistory.find(e => 
        e.month === currentMonth && e.year === currentYear
    )
    
    if (currentEntry) {
        currentEntry.value = valueInCurrentLevel
    } else {
        expHistory.push({
            month: currentMonth,
            year: currentYear,
            value: valueInCurrentLevel
        })
    }
    
    expHistory = expHistory.filter(entry => {
        let monthDiff = (currentYear - entry.year) * 12 + (currentMonth - entry.month)
        return monthDiff <= 5
    });
    
    setStorage("expHistory", expHistory)
}

function resetData(){
    if(document.querySelector("#reset").checked === true){
        localStorage.clear()
        location.reload()
    }
}