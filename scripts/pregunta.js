/*
- que aumente la barra y disminuya vidas
- que guarde los valores del usuario
- radio buttons
- funcionaliad
- stadistica
- css de singUp: corregir
- añadir mas preguntas
- configure que al presionar html entre a las preguntas y 

- configure que ponga la rama en localStorage
- testee que aparezca segu rama
- configure que le guarde al usuario el progreso
- termine la primera
- añada las preguntas
- juegue

- hacer lo mismo con los otros dos tipos
- añadir randomizacion de preguntas
*/

class UI {  
  constructor(){
    this.putUserData;
  }

  async showQuestion (tipo) { 
    /* Use la funcion adecuadar para mostrar, no solo msgTypeSelection */
    const idUser = localStorage.getItem('id');
    const currQuestion = parseInt(localStorage.getItem('currQuestion') || 1);
    localStorage.setItem('currQuestion', currQuestion);
    const data = (await (await fetch(`http://localhost:4001/${tipo}`)).json() ).filter(question => question.rama == 'html')[currQuestion-1];
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);
    const infoDiv = this.msgTypeSelection(data, dataUser.data.vidas);

    document.getElementById('header').innerHTML = infoDiv[0];
    document.getElementById('main').innerHTML = infoDiv[1];
    this.updateHeader(0);
  }

  updateHeader(value=4.3){
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
    if(select) this.checkAnswer(tipo, parseInt(localStorage.getItem('currQuestion')));
  }

  async checkAnswer (tipo, idQuestion) {
    const selectioned = document.querySelector('.options__radiobutton__btn:checked').value;
    const rama = localStorage.getItem('rama') || 'html'; //TODO: TEST
    const idUser = localStorage.getItem('id');

    console.log(tipo);
    console.log(idQuestion);

    const dataQuestion = ( await (await fetch(`http://localhost:4001/${tipo}`)).json() ).find(question => question.id == idQuestion);
    let dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);

    if(selectioned == dataQuestion.correct){
      dataUser.data.totalResuelto[rama]++;
      this.submitMessage('¡Buen trabajo!', 1);
    }else{
      dataUser.data.vidas--;
      this.submitMessage('La respueta correcta es:', 0, dataQuestion.correct);
    }

    this.putUserData = () => [idUser, dataUser];

    //TODO:
    // si las vidas llegan a 0, decir que perdió yse reinicia todo lo de esa categoria
    // - actualizar valores (array user) ESTO ES DE CLASE, NO DE USER
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

  nextQuestion () {
    const putUserData = this.putUserData();
    const currQuestion = parseInt(localStorage.getItem('currQuestion')) + 1;
    localStorage.setItem('currQuestion', currQuestion);
    this.updateHeader();
    this.putData(putUserData[0], putUserData[1]);
    this.showQuestion();
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

  // async test(){
  //   const idUser = localStorage.getItem('id');
  //   let dataUser =  (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);;
  //   console.log(dataUser.data.vidas);
  //   console.log(dataUser.data.totalResuelto.html);
  // }
}

const userInterface = new UI();

window.addEventListener('DOMContentLoaded', e =>{
  userInterface.showQuestion('seleccion');
  localStorage.removeItem('selectOption');
  // userInterface.test();
});


document.getElementById('main').addEventListener('click', e => {
  if(e.target.classList.contains('options__radiobutton__btn')){
    userInterface.optionPress(e.target);
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

/*
  - CUAL PREGUNTA ESTA EN EL MOMENTO ? 
  - vidas, resuelto

*/

