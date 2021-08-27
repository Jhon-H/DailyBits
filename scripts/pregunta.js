/*
- Muestre la primera de HTML
- Configure estilo
- configure que al presionar html entre a las preguntas
- configure que ponga la rama en localStorage
- testee que aparezca segu rama
- confgure que apareezcan vidas
- configure que le guarde al usuario el progreso
- configure las vidas
- termine la primera
- añada las preguntas
- juegue

- hacer lo mismo con los otros dos tipos
- añadir randomizacion de preguntas
*/


class UI {
  constructor(){
    this.currProgress = 0;
    this.lives = 4;
  }

  async showQuestion (tipo) { 
    /* Use la funcion adecuadar para mostrar, no solo msgTypeSelection */

    let data = (await ( await (await fetch(`http://localhost:4001/${tipo}`)).json() ).filter(question => question.rama == 'html'))[2];

    const infoDiv = this.msgTypeSelection(data);
    document.getElementById('header').innerHTML = infoDiv[0];
    document.getElementById('main').innerHTML = infoDiv[1];
  }

  msgTypeSelection(data) {
    /* Usar un form para generar preguntas */

    return [
      `
      <div id="progress"> 
        <div id="progress__close"> x </div>
        <div id="progress__complete">
        </div>
        <div id="progress__lives">
          <img src="../img/heart.svg" alt="heart" />
          <p> ${this.lives} </p>
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
          <label for="radioBtn"> ${data.options[0]} </label>
          <input type="radio" />
        </div>

        <div class="options__radiobutton">
          <label for="radioBtn"> ${data.options[1]} </label>
          <input type="radio" />
        </div>

        <div class="options__radiobutton">
          <label for="radioBtn"> ${data.options[2]} </label>
          <input type="radio"/>
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
userInterface.showQuestion('seleccion');