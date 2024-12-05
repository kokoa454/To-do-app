//general settings
let exp = document.querySelector('#levelNum')
let reminderCnt = document.querySelector('#reminderNum')
const reminderList = "ReminderList"
const dailyList = "DailyList"
const weeklyList = "WeeklyList"
const monthlyList = "MonthlyList"

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

    editReminder: {html: 'editReminder.html', css: 'css/editTask.css'},
    editDailyTask: {html: 'editDailyTask.html', css: 'css/editTask.css'},
    editWeeklyTask: {html: 'editWeeklyTask.html', css: 'css/editTask.css'},
    editMonthlyTask: {html: 'editMonthlyTask.html', css: 'css/editTask.css'}
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
                
                showTasks(reminderList)
            }

            if(pageKey === 'dailyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewDailyTask'))

                showTasks(dailyList)
            }

            if(pageKey === 'weeklyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewWeeklyTask'))

                showTasks(weeklyList)
            }

            if(pageKey === 'monthlyTasks'){
                document.querySelector('#home').addEventListener('click', () => loadPage('home'))
                document.querySelector('#graph').addEventListener('click', () => loadPage('graph'))
                document.querySelector('#archive').addEventListener('click', () => loadPage('archive'))
                document.querySelector('#settings').addEventListener('click', () => loadPage('settings'))

                document.querySelector('#plusButton').addEventListener('click', () => loadPage('makeNewMonthlyTask'))

                showTasks(monthlyList)
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

            if(pageKey === 'makeNewMonthlyTask'){
                document.querySelector('#okButton').addEventListener('click', () => addTask(monthlyList))
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

//tasks management settings
function showTasks(listName){
    let taskList = getStorage(listName)
    let contents = document.querySelector("#contents")
    contents.innerHTML = ""

    if(listName === reminderList){
        taskList.forEach((reminder, index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${reminder.title}</p>
                    <p class="taskDesc">${reminder.description}</p>
                    <input class="taskDate" type="date" value="${reminder.date}" readonly>
                    <input class="taskTime" type="time" value="${reminder.time}" readonly>
                </button>
            `
            contentBox.querySelector('.content').addEventListener('click', () => editTask(listName, index));
    
            contents.appendChild(contentBox)
        });
    } else if(listName === dailyList){
        taskList.forEach((dailyTask, index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${dailyTask.title}</p>
                    <p class="taskDesc">${dailyTask.description}</p>
                    <input class="taskTime" type="time" value="${dailyTask.time}" readonly>
                </button>
            `
            contentBox.querySelector('.content').addEventListener('click', () => editTask(listName, index));

            contents.appendChild(contentBox)
        });
    } else if(listName === weeklyList){
        taskList.forEach((weeklyTask, index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${weeklyTask.title}</p>
                    <p class="taskDesc">${weeklyTask.description}</p>
                    <div class="taskDow"><p>${weeklyTask.DOW}</p></div>
                    <input class="taskTime" type="time" value="${weeklyTask.time}" readonly>
                </button>
            `
            contentBox.querySelector('.content').addEventListener('click', () => editTask(listName, index));

            contents.appendChild(contentBox)
        });
    } else if(listName === monthlyList){
        taskList.forEach((monthlyTask,index) => {
            let contentBox = document.createElement("div")
            contentBox.classList.add("contentsBox")
            contentBox.innerHTML = `
                <input type="checkbox" name="#">
                <button class="content" data-index="${index}">
                    <p class="taskTitle">${monthlyTask.title}</p>
                    <p class="taskDesc">${monthlyTask.description}</p>
                    <input class="taskDate" type="date" value="${monthlyTask.date}" readonly>
                    <input class="taskTime" type="time" value="${monthlyTask.time}" readonly>
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
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime);
            loadPage('reminder')
        }
    } else if(listName === dailyList){
        let taskTitle = document.querySelector('#taskTitle').value
        let taskDesc = document.querySelector('#taskDesc').value
        let taskDate = null
        let taskDOW = null
        let taskTime = document.querySelector('#taskTime').value

        if(taskTitle === ""){
            alert("タイトルを入力してください")
            return
        } else {
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime);
            loadPage('dailyTasks')
        }
    } else if(listName === weeklyList){
        let taskTitle = document.querySelector('#taskTitle').value
        let taskDesc = document.querySelector('#taskDesc').value
        let taskDate = null
        let taskDOW
        switch(document.querySelector('#taskDOW').value){
            case 'monday':
                taskDOW = '月'
                break
            case 'tuesday':
                taskDOW = '火'
                break
            case 'wednesday':
                taskDOW = '水'
                break
            case 'thursday':
                taskDOW = '木'
                break
            case 'friday':
                taskDOW = '金'
                break
            case 'saturday':
                taskDOW = '土'
                break
            case 'sunday':
                taskDOW = '日'
                break
        }
        let taskTime = document.querySelector('#taskTime').value

        if(taskTitle === ""){
            alert("タイトルを入力してください")
            return
        } else {
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime);
            loadPage('weeklyTasks')
        }
    } else if(listName === monthlyList){
        let taskTitle = document.querySelector('#taskTitle').value
        let taskDesc = document.querySelector('#taskDesc').value
        let taskDate = document.querySelector('#taskDate').value
        let taskDOW = null
        let taskTime = document.querySelector('#taskTime').value

        if(taskTitle === ""){
            alert("タイトルを入力してください")
            return
        } else {
            addStorage(listName, taskTitle, taskDesc, taskDate, taskDOW, taskTime);
            loadPage('monthlyTasks')
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
                    loadPage('dailyTasks')
                }
            })

            document.querySelector('#deleteButton').addEventListener('click', () => {
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
                    loadPage('weeklyTasks')
                }
            })

            document.querySelector('#deleteButton').addEventListener('click', () => {
                taskList.splice(index, 1)
                setStorage(listName, taskList)
                loadPage('weeklyTasks')
            })
        }, 50)
    } else if(listName === monthlyList){
        loadPage('editMonthlyTask')

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
                    loadPage('monthlyTasks')
                }
            })

            document.querySelector('#deleteButton').addEventListener('click', () => {
                taskList.splice(index, 1)
                setStorage(listName, taskList)
                loadPage('monthlyTasks')
            })
        }, 50)
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