// логика приложения проста:
// закидываем json файл, через пока только проводник
// автоматически срабатывает парсинг json
// имитурется загрузка с помощью setTimeout(... ,3000)
// показывается общее время
// время по блокам
// полный список времени по блокам
// список можно свернуть-развернуть
// список можно скопировать по кнопке

const WRAPPER = document.querySelector('.container');
const OUTPUTBLOCK = document.querySelector('.output');
const OUTPUTROWFULL = document.querySelector('.output-row');
const OUTPUTROW = document.querySelector('.output-row');
const OUTPULIST = document.querySelector('.output-list');
const ALLDATA = document.querySelector('.all-data-time');
const FORM = document.querySelector('.form');
const INPUT = document.querySelector('.input');
const BTNHIDDEN = document.querySelector('.btn-hidden');
const COPIE = document.querySelector('.copie');
const GIF = document.querySelector('.gif');
const IMG = document.querySelector('.gif-img');

// для отображение гифка имитурющей загрузку
function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

const hiddenGif = () => {
	GIF.classList.remove('view');
	WRAPPER.classList.remove('hiden');
}

const wievGif = () => {
	GIF.classList.add('view');
	WRAPPER.classList.add('hiden');

	const num = getRandomInt(5);

	IMG.src = `./assets/${num}.gif`;
	setTimeout(hiddenGif, 2000);
}
// ==================

const openBlock = () => {

}

// создание элементов для отображения инфы с временем

const creatBlock = (title, subtitle, par) => {
	const div = document.createElement('div');
	const h3 = document.createElement('h3');
	const h4 = document.createElement('h4');
	const ul = document.createElement('ul');

	div.className = 'list-wrapper';
	h3.className = 'list-title';
	h4.className = 'list-subtitle';
	ul.className = 'output-list hiden';

	(title === '') ? h3.innerText = `title not defined` : h3.innerText = `${title}`;
	h4.innerText = `${subtitle}`

	par.append(div);
	div.append(h3);
	div.append(h4);
	div.append(ul);

	h3.addEventListener('click', () => {
		ul.classList.toggle('hiden')
	});
}

const createElemLi = (item, par, itemname) => {
	let li = document.createElement('li');
	par.forEach(el => {
		li.innerText = item;
		li.className = itemname;
		el.append(li);
	})
}

// ==================

// функция которая парсит json файл и запускает все остальные функции, 
// срабатывает после того как в инпут закинули файл
const changeInput = (e) => {

	const upload = e.target.files[0];

	const reader = new FileReader();
	reader.addEventListener('load', (function (file) {
		if (file.type !== 'application/json') return;
		return function (e) {
			let json = JSON.parse(e.target.result);

			outputDataFull(json);
			outputDataSumm(json, OUTPUTBLOCK);
		}
	})(upload));
	reader.readAsText(upload);
}

// убираем форму и показываем кнопки развернуть и копировать
const setBtn = () => {
	FORM.remove();
	COPIE.classList.add('active');
	BTNHIDDEN.classList.add('active');
}

// округляем значения времени до целых чисеk и передаем время в формате hh:mm::ss
const round = (el) => {
	const tempArr = el.split(':');

	const arrRound = tempArr.map(elem => {
		return Math.floor(elem);
	})

	const [h, m, s] = arrRound;

	const sec = (h * 3600) + (m * 60) + s;

	const hours = Math.floor(sec / 3600).toString().padStart(2, '0');
	const minutes = Math.floor((sec / 60) - (hours * 60)).toString().padStart(2, '0');
	const seconds = Math.floor(sec % 60).toString().padStart(2, '0');

	const result = `${hours}:${minutes}:${seconds}`;

	return result;
}

// считаем общую сумму времени
const getSummGeneral = (obj) => {

	let generalSumm = 0;

	for (let key in obj) {
		const value = obj[key];

		value.forEach(el => {
			const tempArr = el.split(':');

			const arrRound = tempArr.map(elem => {
				return Math.round(elem);
			})

			const [h, m, s] = arrRound;
			const sec = (h * 3600) + (m * 60) + s;

			generalSumm += sec;
		})
	}

	const hours = Math.floor(generalSumm / 3600).toString().padStart(2, '0');
	const minutes = Math.floor((generalSumm / 60) - (hours * 60)).toString().padStart(2, '0');
	const seconds = Math.floor(generalSumm % 60).toString().padStart(2, '0');

	const summArr = `${hours}:${minutes}:${seconds}`;

	return summArr;
}

// считаем сумму времени по блокам
const getSummBlock = (obj) => {
	const newObj = {};
	for (let key in obj) {
		let summ = 0;
		const value = obj[key];

		value.forEach(el => {

			const tempArr = el.split(':');

			const arrRound = tempArr.map(elem => {
				return Math.round(elem);
			})

			const [h, m, s] = arrRound;
			let sec = (h * 3600) + (m * 60) + s;
			summ += sec;

			const hours = Math.floor(summ / 3600).toString().padStart(2, '0');
			const minutes = Math.floor((summ / 60) - (hours * 60)).toString().padStart(2, '0');
			const seconds = Math.floor(summ % 60).toString().padStart(2, '0');

			const convert = `${hours}:${minutes}:${seconds}`;
			newObj[key] = convert;
		})
	}

	return newObj;
}

// выводим распарсенный json
const outputDataFull = (json) => {
	setBtn();
	const summBlock = getSummBlock(json);

	for (let key in json) {
		creatBlock(key, summBlock[key], ALLDATA);
		const value = json[key];

		value.forEach(el => {
			const LIST = document.querySelectorAll('.output-list');
			if (LIST) {
				const time = round(el);
				createElemLi(time, LIST, 'li-item');
			}
		})
	}

}

// выводим общую сумму времени
const outputDataSumm = (json, par) => {
	const generalSumm = getSummGeneral(json);

	let h2 = document.createElement('h2');
	let br = document.createElement('br');
	let span = document.createElement('span');

	h2.innerText = `Понимание по общему времени пож-та`;
	span.innerText = `${generalSumm}`;

	par.prepend(h2);
	h2.append(br);
	h2.append(span);
}

// функция для копирования распрасенного списка
const getCopie = () => {
	const ITEM = document.querySelectorAll('.li-item');
	let str = ''
	if (ITEM) {
		ITEM.forEach(el => {
			str += `${el.innerText}\n`
			navigator.clipboard.writeText(str);
			COPIE.innerHTML = 'Спасибо';
			COPIE.classList.add('copied');
		})
	}
}

// функция для открытия списка
const openList = () => {
	ALLDATA.classList.toggle('hiden');
}


INPUT.addEventListener('change', changeInput);
INPUT.addEventListener('change', wievGif);
BTNHIDDEN.addEventListener('click', openList);
COPIE.addEventListener('click', getCopie);


