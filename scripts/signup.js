class UI {
  constructor () {
    this.colorsMessage = [['green', '#00ff95'], ['white', '#ff3a5be8']];
  }

  async newUser(){
    const data = await fetch('http://localhost:4000/users');
    const users = await data.json();
    const nombre_ = document.getElementById('name').value;
    const email_ = document.getElementById('email').value;
    const password_ = document.getElementById('password').value;

    if(!this.validar(users, email_)){
      await fetch('http://localhost:4000/users', 
        {
          method: 'POST',
          body: JSON.stringify({
            name: nombre_,
            email: email_,
            psw: password_,
            data: {
              vidas: 4,
              totalResuelto: {
                html: 0,
                css: 0
              }
            },
            total:{
              correct: 0,
              incorrect: 0,
              time: 0
            }
          }),
          headers:{
            'Content-Type': 'application/json; charset=UTF-8'
          }
        }
      )
      document.getElementById('form').reset();

    }else{
      this.message('Este correo está en uso', 1);
    }
  }

  validar (users, email) {
    return users.some(user => user.email == email);
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
}

/* ------------------------- Eventos -------------------------*/

document.getElementById('form').addEventListener('submit', e =>{
  e.preventDefault();

  const userInterface = new UI();
  userInterface.newUser();
});