async function progressBar (barType, rama) {
  // Reference: https://github.com/ui-code/CircularProgressBar/blob/master/index.html
  const idUser = localStorage.getItem('id');
  const progressUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser).globalTotal[rama];
  setProgress(100 - progressUser*25, barType);
}

function setProgress(percent, barType) {
  const radius = barType.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  barType.style.strokeDasharray = circumference;
  barType.style.strokeDashoffset = circumference - (percent / 100) * circumference;
}


async function complete (){
  const idUser = localStorage.getItem('id');
  const rama = localStorage.getItem('rama');
  const progressUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser).globalTotal[rama];
  return progressUser == 4;
}

async function resetRama () {
  const idUser = localStorage.getItem('id');
  const dataUser = (await (await fetch(`http://localhost:4000/users`)).json()).find(user => user.id = idUser);

  dataUser.globalTotal = {
    "html": 0,
    "css": 0
  };

  await fetch(`http://localhost:4000/users/${idUser}`,
    {
      method: 'PUT',
      body: JSON.stringify(dataUser),
      headers: { "Content-Type": "application/json; charset=UTF-8" }
    }
  );

  window.open('pregunta.html', '_self');
}

async function playAgain () {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "Para jugar de nuevo debes reiniciar la rama",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#2CB67D',
    cancelButtonColor: '#EF4565',
    confirmButtonText: 'Si, reinicialo !',
    cancelButtonText: 'Gracias, pero NO !'
  }).then((result) => {
    if (result.isConfirmed)  resetRama();
  });
}


/* --------------------------- Eventos  ---------------------------*/
window.addEventListener('DOMContentLoaded', e => {
  document.getElementById('main').style.height = `${parseFloat(screen.height/10) - 13.9}rem`;
  document.getElementById('home').style.color = '#2CB67D';
  localStorage.removeItem('currQuestion');
  localStorage.removeItem('globalProgress');
  localStorage.setItem('indexQuestion', '0');

  const finished = localStorage.getItem('finished') || -1;
  if(finished != -1){
    Swal.fire({
      icon: 'error',
      title: 'Oohh',
      text: 'Se te acabaron las vidas !!',
    });
    localStorage.removeItem('finished');
  }

  progressBar(document.getElementById("progress-html"), 'html');
  progressBar(document.getElementById("progress-css"), 'css');
});

document.getElementById('main').addEventListener('click', e => {  
  if(e.target.classList.contains('categorie-available')){
    const ramas = ['seleccion', 'seleccion', 'seleccion', 'seleccion', 'seleccion', 'seleccion']; 
    //TODO: generar de manera aleatoria PERO 2 de cada tipo
    localStorage.setItem('indexQuestion', '0');
    localStorage.setItem('randomSelection', JSON.stringify(ramas));
    localStorage.setItem('rama', e.target.parentElement.parentElement.parentElement.id);

    const completeRama = complete().then(e => console.log(e));
    if(!completeRama) window.open('pregunta.html', '_self');
    else playAgain();
  }
});


/*
- Si ya esta completo, prrguntar si quiere volver a jugar (en cuyo caso, reiniciar valroes), quitar enlaces de .html
*/

