class UI {

  async currentUser () {
    const users = await (await fetch('http://localhost:4000/users')).json();
    const id = localStorage.getItem('id');
    const currUser = users.filter(user => user.id === parseInt(id))[0];
    const div = document.getElementById('perfil');

    div.textContent = '';
    div.innerHTML = `
    <img src="../img/HTML5_logo.png" alt="" id="profile-img"/>
    <p> ${currUser.name} </p>
    <p> ${currUser.email} </p>
    `;
  }

  signOff () {
    localStorage.clear();
    window.open('login.html', '_self');
  }

  async editProfile () {
    const id_ = localStorage.getItem('id');
    const name_ = document.getElementById('name').value;
    const email_ = document.getElementById('email').value;

    await fetch(`http://localhost:4000/users/${id_}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          name: name_,
          email: email_
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        }
      }
    );

    /*  ------ Mensaje de succes ------ */
  }
}


/*---------------------------------- Events ---------------------------------*/

document.getElementById('sign-off').addEventListener('click', () => {
  const userInterface = new UI();
  userInterface.signOff();
});

window.addEventListener('DOMContentLoaded', e => {
  const userInterface = new UI();
  userInterface.currentUser();
});

document.getElementById('form').addEventListener('submit', e => {
  e.preventDefault();
  const userInterface = new UI();
  userInterface.editProfile();
});