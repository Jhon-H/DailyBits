class UI {

  async currentUser () {
    const users = await (await fetch('http://localhost:4000/users')).json();
    const id = localStorage.getItem('id');
    const currUser = users.find(user => user.id === parseInt(id));
    const div = document.getElementById('main__profile');

    div.textContent = '';
    div.innerHTML = `
    <img src="../img/HTML5_logo.png" alt="" id="main__profile__img"/>
    <p id="main__profile__name"> ${currUser.name} </p>
    <p id="main__profile__email"> ${currUser.email} </p>
    `;
  }

  signOff () {
    localStorage.clear();
    window.open('login.html', '_self');
  }

  async editProfile () {
    const id = localStorage.getItem('id');
    const name_ = document.getElementById('main__sesion__edit-modal__form__name').value;
    const email_ = document.getElementById('main__sesion__edit-modal__form__email').value;
    const data = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id == id);
    data.name = name_;
    data.email = email_;

    await fetch(`http://localhost:4000/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      }
    );

    /*  ------ Mensaje de succes ------ */
  }
}


/*---------------------------------- Events ---------------------------------*/

window.addEventListener('DOMContentLoaded', e => {
  document.getElementById('user').style.color = '#2CB67D';

  const userInterface = new UI();
  userInterface.currentUser();
});

document.getElementById('main__sesion__edit-button__sign-off').addEventListener('click', () => {
  const userInterface = new UI();
  userInterface.signOff();
});

document.getElementById('main__sesion__edit-modal__form').addEventListener('submit', e => {
  e.preventDefault();
  const userInterface = new UI();
  userInterface.editProfile();
});