class UI {

  constructor () {
    this.colorsMessage = [['green', '#00ff95'], ['white', '#ff3a5b']];
  }

  async validateExistence () {
    const users = await fetch('http://localhost:4000/users')
      .then(Response => Response.json())
        .then(Response => Response);

    this.validate(users);
  }

  validate (users) {
    const email = document.getElementById('main__container__email-login__input').value;
    const user = users.filter(user => user.email == email);

    if(user.length) this.signIn(user[0]);
    else this.message('Email inexistente', 1);
  }

  message (message, state) {
    const div = document.getElementById('header__message');

    div.textContent = "";
    div.style.backgroundColor = this.colorsMessage[state][1];
    div.style.color = this.colorsMessage[state][0];
    div.innerHTML = `<p style="margin:2.5rem"> ${message} </p>`;

    setTimeout( () => {div.textContent = ""}, 2000 );
  }

  signIn (user) {
    /* Configure id de usuario*/
    localStorage.setItem('id', user.id);
    this.message('Bienvenido !!!', 0);
    window.open('secciones.html', '_self');  /* TODO: porque no carga en el tiempo qe es ???*/
  }
}


/* --------------------------------- Eventos --------------------------------- */

document.getElementById('main__container__email-login__input').addEventListener('keydown', e => {
  if(e.key == 'Enter'){
    const userInterface = new UI();
    userInterface.validateExistence();
  }
});