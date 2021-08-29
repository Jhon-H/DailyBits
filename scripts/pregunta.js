/*
- Corregir:
  - otros tipos de pregunta
  - Que optionButton se active cuando se presione dentro de el, no solo si es el
  - cambiar diseño al presionar y al error
  - temporizador (Hora de fin - Hora de inicio)

- Despues:
  - version para computador y tablet (css)
  - empaquetar en webpack con babel
  - mirar que todo funciones, buscar tricks
  - readme profesional
  - organizazion y comentarios
  - corregir lo que falte

*/

class UI {
  constructor(){
    this.putUserData;
  }

  async showQuestion (tipo) {
    /*TOOO: Use la funcion adecuadar para mostrar, no solo msgTypeSelection */
    const idUser = localStorage.getItem('id');
    const rama = localStorage.getItem('rama');
    const currQuestion = parseInt(localStorage.getItem('currQuestion') || 1);
    localStorage.setItem('currQuestion', currQuestion);


    const data = (await (await fetch(`http://localhost:4001/${tipo}`)).json() ).filter(question => question.rama == rama)[currQuestion-1];
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);
    const infoDiv = this.msgTypeSelection(data, dataUser.data.vidas);

    document.getElementById('header').innerHTML = infoDiv[0];
    document.getElementById('main').innerHTML = infoDiv[1];
    this.updateHeader(0);
  }

  updateHeader (value=4.1) {
    const progressGreen = document.getElementById('progress__complete__green');
    const globalProgress = parseFloat(localStorage.getItem('globalProgress') || 0);
    localStorage.setItem('globalProgress', globalProgress + value);
    progressGreen.style.width = `${globalProgress + value}rem`;
  }

  optionPress (button) {
    const optionBtns = document.querySelectorAll('.options__radiobutton__btn');
    for(let btn of optionBtns) btn.parentElement.style.borderColor = '#ffffff';
    button.parentElement.style.borderColor = '#2CB67D';

    localStorage.setItem('selectOption', 'true');
    document.getElementById('check__button').style.backgroundColor = '#6B47DC';
    document.getElementById('check__button').style.boxShadow = '0rem .1rem 0rem .1rem #361a8a';
  }

  checkAnswerController (tipo) {
    const select = localStorage.getItem('selectOption');
    if(select)this.checkAnswer(tipo, parseInt(localStorage.getItem('currQuestion')));
  }

  async checkAnswer (tipo, idQuestion) {
    const selectioned = document.querySelector('.options__radiobutton__btn:checked').value;
    const rama = localStorage.getItem('rama');
    const idUser = localStorage.getItem('id');
    const dataQuestion = ( await (await fetch(`http://localhost:4001/${tipo}`)).json() ).find(data => data.rama == rama && data.id == idQuestion);
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);

    if(selectioned == dataQuestion.correct){
      dataUser.data.totalResuelto[rama]++;
      dataUser.total.correct++;
      this.submitMessage('¡Buen trabajo!', 1);

    }else{
      dataUser.data.vidas--;
      dataUser.total.incorrect++;
      this.submitMessage('La respueta correcta es:', 0, dataQuestion.correct);
    }

    this.putUserData = () => [idUser, dataUser];

    if(!dataUser.data.vidas) {

      dataUser.globalTotal = {
        "html": 0,
        "css": 0
      };
      dataUser.data = {
        "vidas": 4,
        "totalResuelto": {
          "html": 0,
          "css": 0
        }
      };

      await fetch(`http://localhost:4000/users/${idUser}`,
        {
          method: 'PUT',
          body: JSON.stringify(dataUser),
          headers: { "Content-Type": "application/json; charset=UTF-8" }
        }
      );

      localStorage.setItem('finished', "yes");
      window.open('secciones.html', '_self');
    }
  }

  async putData(idUser, dataUser){
    await fetch(`http://localhost:4000/users/${idUser}`,
      {
        method: 'PUT',
        body: JSON.stringify(dataUser),
        headers: { "Content-Type": "application/json; charset=UTF-8" }
      }
    );
  }

  async updateGlobalTotal () {
    const idUser = localStorage.getItem('id');
    const rama = localStorage.getItem('rama');
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);
    dataUser.globalTotal[rama]++;
    this.putData(idUser, dataUser);
  }

  nextQuestion (tipo) {
    const putUserData = this.putUserData();
    const currQuestionRandom = Math.floor(Math.random() * 14) + 1;
    const index = parseInt(localStorage.getItem('indexQuestion'));
    
    if(index == 5) this.updateGlobalTotal();  
    localStorage.setItem('currQuestion', currQuestionRandom);
    localStorage.setItem('indexQuestion', index+1);
    this.updateHeader();
    this.putData(putUserData[0], putUserData[1]);
  }

  submitMessage(message, state = 1, answer = "") {
    const footer = document.getElementById('footer');
    const divFooter = document.createElement('div');
    answer = answer.replace('<', '&lt;').replace('>', '&gt;');

    /* div atributes*/
    divFooter.id = 'footer__div';
    divFooter.style.backgroundColor = ['#F9CFD7', '#ACFFCF'][state];
    divFooter.innerHTML = `
      <p id="footer__div__title"> ${message} </p>
      <p id="footer__div__answer"> ${answer} </p>`;

    divFooter.innerHTML += `
    <section id="continue">
      <input type="button" value="Continuar" id="continue__button" />
    </section>`;

    footer.append(divFooter);

    if(state){
      document.getElementById('footer__div').style.color = '#16161A';
      document.getElementById('continue__button').style.backgroundColor = '#2CB67D';
      document.getElementById('continue__button').style.boxShadow = '0rem .1rem 0rem .1rem #0F915B';
    }
    else{
      document.getElementById('footer__div').style.color = '#B81E3B';
      document.getElementById('footer__div__title').style.marginBottom = '1rem';
      document.getElementById('footer__div__answer').style.marginBottom = '2rem';
      document.getElementById('continue__button').style.backgroundColor = '#EF4565';
      document.getElementById('continue__button').style.boxShadow = '0rem .1rem 0rem .1rem #B81E3B';
    }
    
    /* TODO: opcional: Deshabilitar opciones */
  }

  msgTypeSelection(data, lives=-1) {
    
    /* Usar un FOR para generar preguntas */
    /*PONER HEADER EN HTMLLLLLLLLLLLLLLLLL  TODO:*/
    return [
      `
      <div id="progress">
        <div id="progress__close"><a href="../html/secciones.html" id="progress__close__link"> x </a></div>
        <div id="progress__complete">
          <div id="progress__complete__green"></div> 
        </div>
        <div id="progress__lives">
          <img src="../img/heart.svg" alt="heart" />
          <p> ${lives} </p>
        </div>
      </div>
      `,

      `
      <section id="statement">
        <img src="${data.img}" alt="" id="statement__img"/> 
        <p id="statement__text"> ${data.text}</p>
      </section>

      <section id="options">
        <div class="options__radiobutton">
          <input type="radio" name="questionOption" class="options__radiobutton__btn" value="${data.options[0]}"/>
          <label for="radioBtn" class="options__radiobutton__label" >${data.options[0]}</label>  
        </div>

        <div class="options__radiobutton">
          <input type="radio" name="questionOption" class="options__radiobutton__btn" value="${data.options[1]}" />
          <label for="radioBtn" class="options__radiobutton__label" >${data.options[1]}</label>  
        </div>

        <div class="options__radiobutton">
          <input type="radio" name="questionOption" class="options__radiobutton__btn" value="${data.options[2]}"/>
          <label for="radioBtn" class="options__radiobutton__label">${data.options[2]}</label>  
        </div>
      </section>

      <section id="check">
        <input type="button" value="Comprobar" id="check__button" />
      </section>
      `
    ];
  }
}

const userInterface = new UI();

window.addEventListener('DOMContentLoaded', e =>{
  
  const index = parseInt(localStorage.getItem('indexQuestion'));
  const randomSelection = JSON.parse(localStorage.getItem('randomSelection'));

  if(index == 6) {
    Swal.fire({
      icon: 'success',
      title: 'Siiiii',
      text: 'Haz terminado esta sección !!',
    });
    setTimeout(() => { window.open('secciones.html', '_self') }, 3000);
  }else{
    userInterface.showQuestion(randomSelection[index]);
    localStorage.removeItem('selectOption');
  }
});


document.getElementById('main').addEventListener('click', e => {
  if(e.target.classList.contains('options__radiobutton')){
    userInterface.optionPress(e.target.firstElementChild);
  }

  if(e.target.id == 'check__button'){
    userInterface.checkAnswerController('seleccion');
  }
});

document.getElementById('footer').addEventListener('click', e => {
  if(e.target.id == 'continue__button'){
    userInterface.nextQuestion();
  }
});