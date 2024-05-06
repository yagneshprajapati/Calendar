const mainContent = document.getElementById('main-content');
const animatedElement = document.querySelector('.container-fluid');
const pages = document.querySelector('.pages');
const topMenu = document.querySelector('.calender-top');
let audioPlayer = new Audio('./assets/audio/tear-paper.mp3');
let locale = 'de-DE'
let shakeStatus = false;
let sound = true;
let shake = true;
let shakeSpeed = 2;
let dropSpeed = 2;
let date = new Date();
let dayNum = date.getDate();
let month = date.getMonth();
let dayName = date.toLocaleString(locale, {weekday: 'long'});
let monthName = date.toLocaleString(locale, {month: 'long'});
let year = date.getFullYear();
let currentDate;

let lastPosition = 2000
const images = {
	"3-21": [
		{
			"id": "1f4654ee-89c6-4fc4-8540-38e4b1d589d0",
			"text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
			"count": 143,
			"src": "./assets/images/image1.jpg"
		}
	],
	"3-22": [
		{
			"id": "b9f8e61d-6c6e-485f-82dc-9b2b0d1cc9f2",
			"text": "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.",
			"count": 143,
			"src": "./assets/images/image2.jpg"
		}
	],
	"3-23": [
		{
			"id": "8bbff7bc-2c04-4b3c-a8e9-3d6dd3d8c888",
			"text": "Nullam ac urna vel enim mollis interdum.",
			"count": 143,
			"src": "./assets/images/image3.jpg"
		}
	],
	"3-24": [
		{
			"id": "e2155f52-0411-40c7-925e-091c7f4e13ab",
			"text": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae",
			"count": 143,
			"src": "./assets/images/image4.jpg"
		}
	],
	"3-25": [
		{
			"id": "a9d3670f-87d7-41e5-a2f5-07f5c7962e70",
			"text": "Fusce ut ligula id odio ultrices finibus.",
			"count": 200,
			"src": "./assets/images/image5.jpg"
		},
		{
			"id": "4f6d1dc0-67a6-4ef7-b6f7-1bce17b8c5c4",
			"text": "Sed lobortis sollicitudin turpis, nec efficitur nunc lacinia at.",
			"count": 143,
			"src": "./assets/images/image6.jpg"
		}
	]
}
const holidays = [
	{ date: "1-1", fname: "Neujahr" },
	{ date: "1-6", fname: "Heilige Drei Könige" },
	{ date: "4-19", fname: "Karfreitag" },
	{ date: "4-21", fname: "Ostersonntag" },
	{ date: "4-22", fname: "Ostermontag" },
	{ date: "5-1", fname: "Tag der Arbeit" },
	{ date: "5-30", fname: "Christi Himmelfahrt" },
	{ date: "6-9", fname: "Pfingstsonntag" },
	{ date: "6-10", fname: "Pfingstmontag" },
	{ date: "6-20", fname: "Fronleichnam" },
	{ date: "10-3", fname: "Tag der Deutschen Einheit" },
	{ date: "10-31", fname: "Reformationstag" },
	{ date: "11-1", fname: "Allerheiligen" },
	{ date: "11-20", fname: "Buß- und Bettag" },
	{ date: "12-24", fname: "Heiligabend" },
	{ date: "12-25", fname: "Erster Weihnachtstag" },
	{ date: "12-26", fname: "Zweiter Weihnachtstag" },
	{ date: "12-31", fname: "Silvester" },
	// Türkische Feiertage
	{ date: "4-23", fname: "Nationaler Souveränitäts- und Kindertag" },
	{ date: "5-19", fname: "Gedenktag Atatürks, Jugend- und Sportfest" },
	{ date: "7-15", fname: "Gedenktag der Demokratie und Nationalen Einheit" },
	{ date: "8-30", fname: "Tag des Sieges" },
	{ date: "10-29", fname: "Tag der Republik" }
];
const settings = {locale:"de-DE",audioFile:null,shake:true,sound:true,shakeSpeed:3,dropSpeed:2}

locale = settings.locale;
sound = settings.sound;
shake = settings.shake;
shakeSpeed = settings.shakeSpeed
dropSpeed = settings.dropSpeed

function daysInMonth(month, year) {
	return new Date(year, month + 1, 0).getDate();
}

function getNewDate() {
	if (dayNum < daysInMonth(month, year)) {
		dayNum++;
	} else {
		dayNum = 1;
	}
	if (dayNum === 1 && month < 11) {
		month++;
	} else if (dayNum === 1 && month === 11) {
		month = 0;
	}
	if (dayNum === 1 && month === 0) {
		year++;
	}
	const newDate = new Date(year, month, dayNum);
	dayName = newDate.toLocaleString(locale, {weekday: 'long'});
	monthName = newDate.toLocaleString(locale, {month: 'long'});
}

let deleteStatus = false;

function handleClick(e) {
	if (!e.classList.contains('page') || deleteStatus)
		return
	deleteStatus = true
	animatedElement.style.animation = `shake-tear ${shakeSpeed}s ease-in-out infinite`;
	shakeStatus = true;
	setTimeout(function () {
		getNewDate();
		updateCalendar(e);
		if (!sound)
			return;
		if (audioPlayer && !audioPlayer.paused) {
			audioPlayer.pause();
			audioPlayer.currentTime = 0;
			audioPlayer.play();
		} else {
			audioPlayer.play();
		}
		setTimeout(function () {
			shakeStatus = false;
			animatedElement.style.animation = "none"
		}, shakeSpeed * 450)
	}, shakeSpeed * 500);
}

function updateCalendar(target) {
	if (target && target.classList.contains('page')) {
		target.classList.add('tear');
		target.style.animation = `tear-animation ${dropSpeed}s ease-in-out infinite`;
		setTimeout(() => {
			pages.removeChild(target);
			target.style.animation = "none"
			deleteStatus = false;
		}, dropSpeed * 800);
	} else {
		return;
	}
	renderPage();
}

function renderPage() {
	currentDate = `${month + 1}-${dayNum}`;

	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const firstDay = new Date(year, month, 0).getDay();

	let calenderContainer = document.createElement("div");
	calenderContainer.className = "d-flex flex-column calender-container px-5 pt-3 page";

	calenderContainer.addEventListener('mousedown', (event) => {
		lastPosition = event.clientY;
	});

	calenderContainer.addEventListener('mouseup', (event) => {
		let mouseUp = event.clientY;
		if (mouseUp > lastPosition + 150) {
			handleClick(calenderContainer)
		}
	});

	calenderContainer.addEventListener('touchstart', function (event) {
		let touches = event.touches;
		let firstTouch = touches[0];
		let rect = calenderContainer.getBoundingClientRect();

		lastPosition = firstTouch.clientY - rect.top;
	});

	calenderContainer.addEventListener('touchend', function (event) {
		let touches = event.changedTouches;
		let firstTouch = touches[0];

		let rect = calenderContainer.getBoundingClientRect();

		let touchEnd = firstTouch.clientY - rect.top;

		if (touchEnd > lastPosition + 150) {
			handleClick(calenderContainer)
		}
	});


	let flexColumnGap4 = document.createElement("div");
	flexColumnGap4.className = "d-flex flex-column gap-4 default-cursor";
	calenderContainer.appendChild(flexColumnGap4);

	let imageDiv = document.createElement("div");
	imageDiv.className = "image-div";
	flexColumnGap4.appendChild(imageDiv);

	let imageArea = document.createElement("div");
	imageArea.className = "d-flex align-items-center justify-content-center gap-1";
	imageArea.id = "image-area";

	let imageData = [];
	// Convert the date to the desired format
	currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

	// Check if there is an image array for the current date
	if (images.hasOwnProperty(currentDate)) {
		imageData = images[currentDate];
	} else {
		// Find the image with the lowest display count
		let smallestCount = Infinity;
		for (const key in images) {
			for (const image of images[key]) {
				if (image.count < smallestCount) {
					smallestCount = image.count;
					imageData = images[key];
				}
			}
		}
		// Increase the display count for selected images
		imageData.forEach(image => image.count++);
	}

	// Convert the images back into a string to save or process further
	const updatedData = JSON.stringify(images, null, 2);

	imageData.forEach(el => {
		let element = document.createElement("div");
		let img = document.createElement("img");
		element.classList.add("img-container")
		img.classList.add("img-fluid")
		img.src = el.src
		img.alt = el.text
		img.id = el.id
		img.draggable = false;
		element.appendChild(img);
		imageArea.appendChild(element);
		imageDiv.appendChild(imageArea);

		img.addEventListener('click', function (event) {
			let rect = img.getBoundingClientRect();

			let x = event.clientX - rect.left;
			let y = event.clientY - rect.top;
			// console.log(`Click [ID:${el.id} - Positions: X:${x} - Y:${y} - Text: ${el.text}]`)
			sendImageInfo("click", el.id, el.text, x, y)
		});

		img.addEventListener('touchstart', function (event) {
			let touches = event.touches;
			let firstTouch = touches[0];

			let rect = img.getBoundingClientRect();

			let x = firstTouch.clientX - rect.left;
			let y = firstTouch.clientY - rect.top;
			// console.log(`Touch Start [ID:${el.id} - Positions: X:${x} - Y:${y} - Text: ${el.text}]`)
			sendImageInfo("touchstart", el.id, el.text, x, y)
		});

		img.addEventListener('touchend', function (event) {
			let touches = event.changedTouches;
			let firstTouch = touches[0];

			let rect = img.getBoundingClientRect();

			let x = firstTouch.clientX - rect.left;
			let y = firstTouch.clientY - rect.top;
			// console.log(`Touch End [ID:${el.id} - Positions: X:${x} - Y:${y} - Text: ${el.text}]`)
			sendImageInfo("touchend", el.id, el.text, x, y)
		});
	})

	let bottomContainer = document.createElement("div");
	bottomContainer.className = "d-flex bottom-container justify-content-between";
	flexColumnGap4.appendChild(bottomContainer);

	let dFlexJustifyContent = document.createElement("div");
	dFlexJustifyContent.className = "d-flex justify-content-between w-100";
	bottomContainer.appendChild(dFlexJustifyContent);

	let flexColumnAlignContent = document.createElement("div");
	flexColumnAlignContent.className = "d-flex flex-column align-content-center justify-content-center mt-5";
	dFlexJustifyContent.appendChild(flexColumnAlignContent);

	let dateContentGap2 = document.createElement("div");
	dateContentGap2.className = "d-flex justify-content-center date-content gap-2";
	flexColumnAlignContent.appendChild(dateContentGap2);

	let h1DayNum = document.createElement("h1");
	h1DayNum.className = "text-black-50 align-self-baseline";
	h1DayNum.id = "day-num";
	h1DayNum.innerText = `${dayNum}.`
	dateContentGap2.appendChild(h1DayNum);

	let h4MonthText = document.createElement("h4");
	h4MonthText.className = "text-black-50 align-self-baseline";
	h4MonthText.id = "month-text";
	h4MonthText.innerText = `${monthName}`
	dateContentGap2.appendChild(h4MonthText);

	let dFlexPositionRelative = document.createElement("div");
	dFlexPositionRelative.className = "d-flex position-relative";
	flexColumnAlignContent.appendChild(dFlexPositionRelative);

	let lineContent = document.createElement("div");
	lineContent.className = "line-content";
	dFlexPositionRelative.appendChild(lineContent);

	let dateContentMt2 = document.createElement("div");
	dateContentMt2.className = "d-flex justify-content-center date-content mt-2";
	flexColumnAlignContent.appendChild(dateContentMt2);

	let h3DayText = document.createElement("h3");
	h3DayText.className = "text-black-50 align-self-baseline";
	h3DayText.id = "day-text";
	h3DayText.innerText = `${dayName}`
	dateContentMt2.appendChild(h3DayText);

	let dateContentPy2 = document.createElement("div");
	dateContentPy2.className = "d-flex justify-content-end date-content py-2";
	flexColumnAlignContent.appendChild(dateContentPy2);

	let holidayName = document.createElement("div");
	holidayName.className = "text-black-50 align-self-baseline holiday-name";
	holidayName.id = "holiday-name";
	dateContentPy2.appendChild(holidayName);

	let flexColumnCalendar = document.createElement("div");
	flexColumnCalendar.className = "d-flex flex-column calendar-area mt-5";
	dFlexJustifyContent.appendChild(flexColumnCalendar);

	let rowCols7 = document.createElement("div");
	rowCols7.className = "row row-cols-7";
	flexColumnCalendar.appendChild(rowCols7);

	let daysOfWeek = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
	daysOfWeek.forEach(function (day) {
		var col = document.createElement("div");
		col.className = "col text-center";
		col.textContent = day;
		rowCols7.appendChild(col);
	});

	let rowCols7Days = document.createElement("div");
	rowCols7Days.className = "row row-cols-7";
	rowCols7Days.id = "days";

	for (let i = 0; i < firstDay; i++) {
		const emptyDay = document.createElement("div");
		emptyDay.classList.add("col", "text-center")
		rowCols7Days.appendChild(emptyDay);
	}


	for (let day = 1; day <= daysInMonth; day++) {
		const dayElement = document.createElement("div");
		dayElement.textContent = day;
		if (day === dayNum) {
			dayElement.classList.add("text-danger")
		}
		dayElement.classList.add("col", "text-center")
		rowCols7Days.appendChild(dayElement);
	}

	flexColumnCalendar.appendChild(rowCols7Days);

	let holidaysContainer = document.createElement("div");
	holidaysContainer.className = "d-flex holidays-container ms-3 py-2";
	holidaysContainer.id = "holiday-list";
	bottomContainer.appendChild(holidaysContainer);

	let holidayMonth = `${month + 1}-`

	let holidayList = holidays.filter(holiday => holiday.date.includes(holidayMonth))
	let i = 0;
	if (holidayList.length > 0) {
		for (let el of holidayList) {
			if (parseInt(el.date.split('-')[1]) === dayNum) {
				holidayName.innerText = el.fname;
			}
			if (parseInt(el.date.split('-')[1]) >= dayNum) {
				let element = document.createElement("div");
				element.textContent = `${el.date.split('-')[1]}. ${el.fname}`;
				element.classList.add("vertical", "holiday-name", "text-black-50", "align-self-end")
				holidaysContainer.appendChild(element);
				i++;
			}
			if (i === 2)
				break;
		}
	}
	pages.appendChild(calenderContainer);
	if (typeof TheApp !== "undefined") {
		TheApp.saveJsonFile("images.json", updatedData)
	}
}

function sendImageInfo(type, guid, text, x, y) {
	if (typeof TheApp === "undefined")
		return

	if (type === "touchstart") {
		TheApp.Calendar_TouchDown(guid, text, x, y)
	} else if (type === "touchstend") {
		TheApp.Calendar_TouchUp(guid, text, x, y)
	} else if (type === "click") {
		TheApp.Calendar_OnClick(guid, text, x, y)
	}
}

function generateFakeDiv() {
	for (let i = 0; i < 5; i++) {
		let fakeDiv = document.createElement("div");
		fakeDiv.classList.add("fake-div", "neu-shadow")
		mainContent.appendChild(fakeDiv);
	}
}

generateFakeDiv()

function startShake() {
	if (shakeStatus)
		return

	animatedElement.style.animation = `shake-tear ${shakeSpeed}s ease-in-out infinite`;
	shakeStatus = true;
	setTimeout(function () {
		shakeStatus = false;
		animatedElement.style.animation = 'none';
	}, shakeSpeed * 1000);
}

const shakeArea = document.querySelector('.calender-container');
shakeArea.addEventListener('click', function (event) {
	if (!shake)
		return;

	let clickX = event.offsetX;
	let clickY = event.offsetY;

	let centerX = 260;
	let centerY = 0;
	if (clickX >= centerX && clickX <= centerX + 100 && clickY >= centerY && clickY <= centerY + 135) {
		startShake();
	}
});

function changeSettings(key, value) {
	switch (key) {
		case 'locale':
			if (typeof value !== "string" || value === "")
				break

			settings.locale = value;
			break
		case 'calendarTitle':
			if (typeof value === "string" && value !== "") {
				document.getElementById('calendarTitle').innerText = value;
			}
			break;
		case 'setDate':
		  if (typeof value === 'string') {
			const parts = value.split("-");
			if(parts.length === 3) {
			  year = parseInt(parts[0], 10);
			  month = parseInt(parts[1], 10) - 1; // Da JavaScript Monate von 0 bis 11 zählt
			  dayNum = parseInt(parts[2], 10);
			  const newDate = new Date(year, month, dayNum);
			  dayName = newDate.toLocaleString(locale, {weekday: 'long'});
			  monthName = newDate.toLocaleString(locale, {month: 'long'});
			  updateCalendar(); // Falls vorhanden
			  renderPage();
			} else {
			  console.log("Invalid date format");
			}
		  }
		  else
		  {
			 console.log("Format for date: " + typeof value);
		  }
		  break;
		case 'sound':
			if (value === false || value === "false" || value === 0)
				settings.sound = false;
			else if (value === true || value === "true" || value === 1)
				settings.sound = true;
			else
				settings.sound = !sound;
			break
		case 'shake':
			if (value === false || value === "false" || value === 0)
				settings.shake = false;
			else if (value === true || value === "true" || value === 1)
				settings.shake = true;
			else
				settings.shake = !shake;
			break
		case 'shakeSpeed':
			if (value === "")
				break
			settings.shakeSpeed = value;
			break
		case 'dropSpeed':
			if (value === "")
				break
			settings.dropSpeed = value;
			break
		case 'audioFile':
			if (typeof value !== "string" || value === "")
				break

			settings.audioFile = value;
			break
		default:
			break
	}

	if (typeof TheApp !== "undefined") {
		TheApp.saveJsonFile("settings.json", JSON.stringify(settings))
	}

	audioPlayer = new Audio(`./assets/audio/${settings.audioFile}`);
	locale = settings.locale;
	sound = settings.sound;
	shake = settings.shake
	shakeSpeed = settings.shakeSpeed
	dropSpeed = settings.dropSpeed
}

// pages.addEventListener('click', handleClick);

topMenu.addEventListener('click', () => {
	const page = document.querySelector('.page');
	page.click();
})

document.addEventListener('DOMContentLoaded', function() {
    renderPage();
});
