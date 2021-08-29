
async function getStatistic () {
  const idUser = localStorage.getItem('id');
  const data = (await (await fetch('http://localhost:4000/users')).json()).find(user => user.id == idUser).total;

  const {correct, incorrect, time} = data;
  console.log(correct, incorrect, time);
  
  document.getElementById('main__study-time__value').innerHTML  = time;
  document.getElementById('main__ans-total__value').innerHTML  = correct + incorrect;
  document.getElementById('main__ans-correct__value').innerHTML  = correct;
  document.getElementById('main__ans-incorrect__value').innerHTML  = incorrect;
}


window.addEventListener('DOMContentLoaded', e => {
  document.getElementById('activity').style.color = '#2CB67D';
  getStatistic();
});