const COL_PROJECT = 0;
const COL_TYPE = 1;
const COL_DURATION = 3;
const COL_RATE = 4;
const COL_BONUS = 5;
const COL_TOT_RATE = 6;
const COL_TOT_AMOUNT = 7;
const COL_DEADLINE = 8;

const REFRESH_RATE = 5000;
const NEXT_PAGE_DELAY = 1000;

let jobGrabTimer;
let pageNum = 1;
let checkNum = 0;
let jobs = [];

function jobGrabRefresh() {
    let url = document.location.href;
    if (pageNum > 1) url = url + '?job_page=' + pageNum;

    console.log('Refreshing market container: %s', url);
    $('#market-container').load(url + ' #market-container', checkJobs);
}

function checkJobs() {
    // grab the market table element
    let mktTbl = $('#market_table tbody tr');

    // mark all jobs in array as missed
    markAllMissed();

    // parse the market table rows into easier to read job objects
    for (let x = 0; x < mktTbl.length; x++) {
        let proj = mktTbl[x].children[COL_PROJECT].innerText.trim();
        let projName = proj.split('\n')[0];
        let projId = proj.split('\n')[1].split(' | ')[0];
        let projFile = proj.split('\n')[1].split(' | ')[1];
        let type = mktTbl[x].children[COL_TYPE].innerText.trim().split(' \n');
        let jobType = type[0];
        let jobSubType = type[1];

        if (pageNum == 1) checkNum++;

        let job = {
            id: projId.trim(),
            name: projName.trim(),
            file: projFile.trim(),
            type: jobType.trim(),
            subType: jobSubType.trim(),
            duration: mktTbl[x].children[COL_DURATION].innerText.trim(),
            rate: mktTbl[x].children[COL_TOT_RATE].innerText.trim(),
            bonus: mktTbl[x].children[COL_BONUS].innerText.trim(),
            amount: mktTbl[x].children[COL_TOT_AMOUNT].innerText.trim(),
            deadline: mktTbl[x].children[COL_DEADLINE].innerText.trim(),
            ignored: false,
            missed: false,
            checkNum: checkNum,
            returnCount: 0,
            firstAppeared: Date()
                .toString()
                .replace(' GMT-0400 (Eastern Daylight Time)', ''),
            lastSeen: Date()
                .toString()
                .replace(' GMT-0400 (Eastern Daylight Time)', '')
        };

        // console.log(JSON.stringify(job));
        trackJob(job);
    }

    checkNextPage();
}

// marks all jobs missed - jobs that are still available will be updated
function markAllMissed() {
    // console.log('Marking all jobs as missed.');
    for (var x = 0; x < jobs.length; x++) {
        jobs[x].missed = true;
    }
}

function trackJob(job) {
    //    console.log('Tracking job: %s (%s)', job.name, job.id);
    for (var x = 0; x < jobs.length; x++) {
        if (jobs[x].id == job.id) {
            if (jobs[x].checkNum < checkNum - 1) jobs.returnCount++;
            jobs[x].missed = false;
            jobs[x].lastSeen = Date()
                .toString()
                .replace('(Eastern Daylight Time)', '');
            return;
        }
    }

    console.log('NEW JOB: %s (%s)', job.name, job.id);

    chrome.runtime.sendMessage({
        action: 'playSound',
        value: 'NEW_JOB'
    });

    jobs.push(job);
}

function checkNextPage() {
    let nextPageKey = 'job_page=' + (pageNum + 1);
    if ($('a[href$="' + nextPageKey + '"]').length > 0) {
        pageNum++;
        console.log('Checking page #' + pageNum);
        clearInterval(jobGrabTimer);
        setTimeout(jobGrabRefresh, NEXT_PAGE_DELAY);
    } else {
        if (pageNum > 1) {
            console.log('Returning to Page #1');
            pageNum = 1;
            jobGrabTimer = setInterval(jobGrabRefresh, REFRESH_RATE);
        }
    }
}

function dumpJobs() {
    let sJobs = '';
    for (let x = 0; x < jobs.length; x++) {
        let sJob = 'JOB ' + (x + 1) + ' OF ' + jobs.length + ':\n\r';
        sJob += '\tName:\t\t\t' + jobs[x].name + '\r\n';
        sJob += '\tID:\t\t\t\t' + jobs[x].id + '\r\n';
        sJob += '\tFile:\t\t\t' + jobs[x].file + '\r\n';
        sJob += '\tRate:\t\t\t' + jobs[x].rate + '\r\n';
        if (jobs[x].bonus != '') {
            let bonusPct = Math.round((parseFloat(jobs[x].bonus.replace('$', '')) / parseFloat(jobs[x].rate.replace('$', ''))) * 100);
            sJob += '\tBonus:\t\t\t' + jobs[x].bonus + ' (' + bonusPct + '%)\r\n';
        }
        sJob += '\tAmount:\t\t\t' + jobs[x].amount + '\r\n';
        sJob += '\tType:\t\t\t' + jobs[x].type + ' (' + jobs[x].subType + ')\n\r';
        sJob += '\tDuration:\t\t' + jobs[x].duration + '\r\n';
        sJob += '\tDeadline:\t\t' + jobs[x].deadline + '\r\n';
        sJob += '\tFirst Seen:\t\t' + jobs[x].firstAppeared + '\r\n';
        sJob += '\tLast Seen:\t\t' + jobs[x].lastSeen + '\r\n';
        sJob += '\tTimes Returned:\t' + jobs[x].returnCount + '\r\n';
        sJobs += sJob + '\r\n';
    }

    console.log(sJobs);
}

jobGrabTimer = setInterval(jobGrabRefresh, REFRESH_RATE);
