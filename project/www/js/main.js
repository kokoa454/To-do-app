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