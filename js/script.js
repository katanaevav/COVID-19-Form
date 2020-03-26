'use strict';

//setup form

var FIRST_QUESTION = 1;
var QUESTIONS_COUNT = 9;
var QUERY_TIMEOUT = 10000;

var StatusCode = {
  OK: 200
};

var rightAnswers = [0, 1, 1, 0, 1, 1, 1, 1, 1];

var questions = document.querySelectorAll('.question');

var form = document.querySelector('.covid-19-test-form');

var buttonPrev = document.querySelector('.navigation-group__button--prev');
var buttonNext = document.querySelector('.navigation-group__button--next');
var buttonSubmit = document.querySelector('.navigation-group__button--submit');

var currentItem = 0;

var hideAllQuestions = function () {
  questions.forEach(function (item) {
    item.classList.add('hide-element');
  })
};

var setButtonsVisible = function () {
  switch(currentItem) {
    case 0:
      buttonPrev.style.display = 'none';
      buttonNext.style.display = 'block';
      buttonSubmit.style.display = 'none';
      break;
  
    case questions.length-1:
      buttonPrev.style.display = 'none';
      buttonNext.style.display = 'none';
      buttonSubmit.style.display = 'none';
      break;
  
    case questions.length-2:
      buttonPrev.style.display = 'block';
      buttonNext.style.display = 'none';
      buttonSubmit.style.display = 'block';
      break;

    default:
      buttonPrev.style.display = 'block';
      buttonNext.style.display = 'block';
      buttonSubmit.style.display = 'none';
  }
}

var setVisileQuestion = function (questionNumber) {
  hideAllQuestions();
  currentItem = questionNumber;
  currentItem = (currentItem < 0) ? 0 : currentItem;
  currentItem = (currentItem > questions.length - 1) ? questions.length - 1 : currentItem;
  questions[currentItem].classList.remove('hide-element');
  setButtonsVisible();
}

var checkResult = function() {
  var results = document.querySelector('.test-result');
  var resultScore = 0;
  for (var i = FIRST_QUESTION; i <= QUESTIONS_COUNT; i++) {
    var answers = questions[i].querySelectorAll('.answer__radio');
    answers.forEach(function (item) {
      if ((item.checked) && (parseInt(item.value) === rightAnswers[i - 1])) {
        resultScore++;
      }
    })
  }
  results.value = Math.round(resultScore * 100 / QUESTIONS_COUNT);

  var textResult = document.querySelector('.question__result');
  textResult.innerHTML = '<strong>Результат теста:</strong> ' + results.value + '% (';
  textResult.innerHTML += (results.value >= 80) ? 'есть подозрения на заражение' : 'подозрений на заражение нет';
  textResult.innerHTML += ')'

  var textRecommendations = document.querySelector('.question__text--recommendations');
  textRecommendations.innerHTML = 'Рекомендуем следить за своим состоянием';
  textRecommendations.innerHTML += (results.value >= 80) ? ' в ближайшие часы и при усугублении' : '. При появлении';
  textRecommendations.innerHTML += ' симптомов позвоните в медучреждение.'

  return textResult;
}

questions[questions.length - 1].style = '';
setVisileQuestion(0);

var onPrevButtonClick = function (evt) {
  setVisileQuestion(currentItem - 1);
};

var onNextButtonClick = function (evt) {
  setVisileQuestion(currentItem + 1);
};

buttonPrev.addEventListener('click', onPrevButtonClick);
buttonNext.addEventListener('click', onNextButtonClick);

var setup = function (onLoad, onError) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'text';

  xhr.addEventListener('load', function () {
    if (xhr.status === StatusCode.OK) {
      onLoad(xhr.response);

      console.log(xhr.response.message);
    } else {
      onError('Cервер ответил: ' + xhr.status + ' ' + xhr.statusText);
    }
  });

  xhr.addEventListener('error', function () {
    onError('Ошибка соединения c сервером');
  });
  xhr.addEventListener('timeout', function () {
    onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
  });

  xhr.timeout = QUERY_TIMEOUT;

  return xhr;
};

var save = function (data, onLoad, onError) {
  var xhr = setup(onLoad, onError);
  xhr.open('POST', 'sendMail.php');
  xhr.send(data);
};

var onSuccessSave = function () {
  setVisileQuestion(questions.length);
}

var onErrorSave = function () {
  setVisileQuestion(questions.length);
}

form.addEventListener('submit', function (evt) {
  evt.preventDefault();
  checkResult();
  save(new FormData(form), onSuccessSave, onErrorSave);
});
