const COL_PROJECT = 0;
const COL_TYPE = 1;
const COL_DURATION = 3;
const COL_RATE = 4;
const COL_BONUS = 5;
const COL_TOT_RATE = 6;
const COL_TOT_AMOUNT = 7;
const COL_DEADLINE = 8;

const REFRESH_RATE = 5000;

let jobGrabTimer;
let mktTbl;
let jobs = [];

function jobGrabRefresh() {
	if ($("#market_table tbody tr").length > 0) {
		console.log('JOBS FOUND!!');
		checkJobs();
		//clearInterval(jobGrabTimer);
	} else {
		console.log('No jobs, refreshing.');
	}
	$('#market-container').load(document.location.href +  ' #market-container');
}

function checkJobs() {
	let mktTbl = $("#market_table tbody tr");
	
	for (let x = 0; x < mktTbl.length; x++) {

		let job = {
			project: mktTbl[x].children[COL_PROJECT].innerText, 
			type: mktTbl[x].children[COL_TYPE].innerText,
			duration: mktTbl[x].children[COL_DURATION].innerText,
			rate: mktTbl[x].children[COL_TOT_RATE].innerText,
			amount: mktTbl[x].children[COL_TOT_AMOUNT].innerText,		
			deadline: mktTbl[x].children[COL_DEADLINE].innerText,
			disregarded: false
		}
		
		jobs.push(job);
		console.log('JOB: ' + JSON.stringify(job));
	}
}

jobGrabTimer = setInterval(jobGrabRefresh, REFRESH_RATE);
