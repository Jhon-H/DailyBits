/*
Implementar las siguientes caracteristicas:

  - Pregunta tipo mover
  - responsive design
  - temporizador (Hora de fin - Hora de inicio)
*/

class UI {
  constructor(){
    this.putUserData;
  }

  async showQuestion (tipo) {
    const idUser = localStorage.getItem('id');
    const rama = localStorage.getItem('rama');
    const currQuestion = parseInt(localStorage.getItem('currQuestion') || 1);
    localStorage.setItem('currQuestion', currQuestion);

    const data = (await (await fetch(`http://localhost:4001/${tipo}`)).json() ).filter(question => question.rama == rama)[currQuestion-1];
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id == idUser);

    let infoDiv;
    if(tipo == 'seleccion')  infoDiv = this.msgTypeSelection(data, dataUser.data.vidas);
    if(tipo == 'imgOPtions')  infoDiv = this.msgTypeOption(data, dataUser.data.vidas);

    document.getElementById('header').innerHTML = infoDiv[0];
    document.getElementById('main').innerHTML = infoDiv[1];
    this.updateHeader(0);
  }

  updateHeader (value=4) {
    const progressGreen = document.getElementById('progress__complete__green');
    const globalProgress = parseFloat(localStorage.getItem('globalProgress') || 0);
    localStorage.setItem('globalProgress', globalProgress + value);
    progressGreen.style.width = `${globalProgress + value}rem`;
  }

  optionPress (button) {
    const optionBtns = document.querySelectorAll('.options__radiobutton__btn');
    for(let btn of optionBtns) btn.parentElement.style.borderColor = '#ffffff';
    button.parentElement.style.borderColor = '#2CB67D';

    button.checked= true;
    localStorage.setItem('selectOption', 'true');
    document.getElementById('check__button').style.backgroundColor = '#6B47DC';
    document.getElementById('check__button').style.boxShadow = '0rem .1rem 0rem .1rem #361a8a';
  }

  checkAnswerController (tipo, randomRama) {
    const select = localStorage.getItem('selectOption');
    if(select){
      if(randomRama == 'seleccion') 
        this.checkAnswer(randomRama, parseInt(localStorage.getItem('currQuestion')));
      else if(randomRama == 'imgOPtions')
        this.checkAnswerIMG(randomRama, parseInt(localStorage.getItem('currQuestion')));
      
    }
  }

  async checkAnswer (tipo, idQuestion) {
    const selectioned = document.querySelector('.options__radiobutton__btn:checked').value;
    const rama = localStorage.getItem('rama');
    const idUser = localStorage.getItem('id');
    const dataQuestion = ( await (await fetch(`http://localhost:4001/${tipo}`)).json() ).find(data => data.rama == rama && data.id == idQuestion);
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id == idUser);

    // console.log("idUser: " + idUser);
    // const dataUserP = (await (await fetch(`http://localhost:4000/users`)).json()).filter(user => user.id == parseInt(idUser));
    // console.log([idUser, dataUserP]);
    // console.warn("EEYYYYY LINEA 85");

    if(selectioned == dataQuestion.correct){
      dataUser.data.totalResuelto[rama]++;
      dataUser.total.correct++;
      this.submitMessage('??Buen trabajo!', 1);

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
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id == idUser);
    dataUser.globalTotal[rama]++;
    this.putData(idUser, dataUser);
  }

  nextQuestion () {
    const putUserData = this.putUserData();
    const currQuestionRandom = Math.floor(Math.random() * 5) + 1;
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
          <input type="radio" name="questionOption" class="options__radiobutton__btn" value="${data.options[0]}" disabled/>
          <label for="radioBtn" class="options__radiobutton__label" >${data.options[0]}</label>  
        </div>

        <div class="options__radiobutton">
          <input type="radio" name="questionOption" class="options__radiobutton__btn" value="${data.options[1]}" disabled/>
          <label for="radioBtn" class="options__radiobutton__label" >${data.options[1]}</label>  
        </div>

        <div class="options__radiobutton">
          <input type="radio" name="questionOption" class="options__radiobutton__btn" value="${data.options[2]}" disabled/>
          <label for="radioBtn" class="options__radiobutton__label">${data.options[2]}</label>  
        </div>
      </section>

      <section id="check">
        <input type="button" value="Comprobar" id="check__button" />
      </section>
      `
    ];
  }

  msgTypeOption(data, lives=-1) {
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
    <section id="statement" class="img-header-text" >
      <p id="statement__text"> ${data.text}</p>
    </section>

    <section id="options" class="img-div">
      <div class="options__img">
        ${data.options[0]}
      </div>

      <div class="options__img">
        ${data.options[1]}
      </div>

      <div class="options__img">
        ${data.options[2]}
      </div>

      <div class="options__img">
        ${data.options[3]}
      </div>

    <section id="check">
      <input type="button" value="Comprobar" id="check__button" />
    </section>
    `
    ];
  }

  optionPressIMG( img ){ 
    document.querySelectorAll('.options__img').forEach(div => {
      div.style.borderColor = '#ffffff';
    })
    img.parentElement.style.borderColor = '#2CB67D';
    localStorage.setItem('selectOption', 'true');
    localStorage.setItem('IMG-select-value', img.dataset.value);
      
    document.getElementById('check__button').style.backgroundColor = '#6B47DC';
    document.getElementById('check__button').style.boxShadow = '0rem .1rem 0rem .1rem #361a8a';
  }

  async checkAnswerIMG (tipo, idQuestion) {
    // this.checkAnswerIMG(tipo, parseInt(localStorage.getItem('currQuestion')));    
    const selectioned = localStorage.getItem('IMG-select-value');
    const rama = localStorage.getItem('rama');
    const idUser = localStorage.getItem('id');
    const dataQuestion = ( await (await fetch(`http://localhost:4001/${tipo}`)).json() ).find(data => data.rama == rama && data.id == idQuestion);
    const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id == idUser);

    if(selectioned == dataQuestion.correct){
      dataUser.data.totalResuelto[rama]++;
      dataUser.total.correct++;
      this.submitMessage('??Buen trabajo!', 1);

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
}

const userInterface = new UI();

window.addEventListener('DOMContentLoaded', e =>{
  
  const index = parseInt(localStorage.getItem('indexQuestion'));
  const randomSelection = JSON.parse(localStorage.getItem('randomSelection'));

  if(index == 6) {
    Swal.fire({
      icon: 'success',
      title: 'Siiiii',
      text: 'Haz terminado esta secci??n !!',
    });
    setTimeout(() => { window.open('secciones.html', '_self') }, 3000);
  }else{
    userInterface.showQuestion(randomSelection[index]);
    localStorage.removeItem('selectOption');
  }
});


document.getElementById('main').addEventListener('click', e => {
  if(e.target.classList.contains('options__radiobutton') || 
    e.target.classList.contains('options__radiobutton__label') ){
      if(e.target.classList.contains('options__radiobutton__label')){
        userInterface.optionPress(e.target.parentElement.firstElementChild);
      }else{
        userInterface.optionPress(e.target.firstElementChild);
      }
  }

  if(e.target.classList.contains('option-img')){
    userInterface.optionPressIMG(e.target);
  }

  if(e.target.id == 'check__button'){
    const rama = localStorage.getItem('rama');
    const index = parseInt(localStorage.getItem('indexQuestion'));
    const randomSelection = JSON.parse(localStorage.getItem('randomSelection'));
    userInterface.checkAnswerController(rama, randomSelection[index]);
  }
});

document.getElementById('footer').addEventListener('click', e => {
  if(e.target.id == 'continue__button'){
    userInterface.nextQuestion();
  }
});
