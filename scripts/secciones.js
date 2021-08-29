/* --------------------------- Eventos  ---------------------------*/

window.addEventListener('DOMContentLoaded', e => {
  document.getElementById('main').style.height = `${parseFloat(screen.height/10) - 13.9}rem`;
  document.getElementById('home').style.color = '#2CB67D';
  localStorage.removeItem('currQuestion');
  localStorage.removeItem('globalProgress');
  localStorage.setItem('indexQuestion', '0');

  const finished = localStorage.getItem('finished') || -1;
  if(finished != -1){
    alert("Ohh, se te acabaron las vidas !!");  //mensje bonito
    localStorage.removeItem('finished');
  }
});

document.getElementById('main').addEventListener('click', e => {  
  if(e.target.classList.contains('categorie-available')){
    const ramas = ['seleccion', 'seleccion', 'seleccion']; //generar de manera aleatoria
    localStorage.setItem('indexQuestion', '0');
    localStorage.setItem('randomSelection', JSON.stringify(ramas));
    localStorage.setItem('rama', e.target.parentElement.parentElement.parentElement.id);
  }
});



// https://cybmeta.com/formas-basicas-con-css-triangulos-circulos-trapecios-rectangulos-cuadrados

