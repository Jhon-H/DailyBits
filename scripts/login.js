class UI {

  constructor () {
    this.colorsMessage = [['green', '#00ff95'], ['white', '#ff3a5be8']];
  }

  async validateExistence () {
    const users = await fetch('http://localhost:4000/users')
      .then(Response => Response.json())
        .then(Response => Response);

    this.validate(users);
  }

  validate (users) {
    const email = document.getElementById('email').value;
    const tmp = users.some(user => user.email == email);

    if(tmp) this.signIn();
    else this.message('Email inexistente', 1);
  }

  message (message, state) {
    const div = document.getElementById('message');

    div.textContent = "";
    div.style.backgroundColor = this.colorsMessage[state][1];
    div.style.color = this.colorsMessage[state][0];
    div.innerHTML = `
    <p style="margin:2.5rem"> ${message} </p>
    `;

    setTimeout( () => {div.textContent = ""}, 2000 );
  }

  signIn () {
    /* Proximamente: validar password */
    this.message('Bienvenido !!!', 0);
    window.open('secciones.html', '_self');  /* TODO: porque no carga en el tiempo qe es ???*/
  }
}


/* --------------------------------- Eventos --------------------------------- */

document.getElementById('email').addEventListener('keydown', e => {
  if(e.key == 'Enter'){
    const userInterface = new UI();
    userInterface.validateExistence();
  }
});

