const api = axios.create({
  baseURL: 'https://api.thecatapi.com/v1'
});

api.defaults.headers.common['X-API-KEY'] = 'live_xY281V8h7sjSdMzYUHi0IspdYiRX6p05H6LYResKiKtI283OSBiporUy8o8ZMRCu';

const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=4';
const API_URL_FAVORITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_FAVORITES_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}?api_key=live_xY281V8h7sjSdMzYUHi0IspdYiRX6p05H6LYResKiKtI283OSBiporUy8o8ZMRCu`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';


const spanError = document.getElementById('error');

async function loadRandomMichis() {
  const res = await fetch(API_URL_RANDOM);
  const data = await res.json();
  console.log('Random')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "There was an error" + res.status;
  } else {
    const img1 = document.getElementById('img1');
    const img2 = document.getElementById('img2');
    const img3 = document.getElementById('img3');
    const img4 = document.getElementById('img4');
    const btn1 = document.getElementById('btn1');
    const btn2 = document.getElementById('btn2');
    const btn3 = document.getElementById('btn3');
    const btn4 = document.getElementById('btn4');
    
    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;
    img4.src = data[3].url;

    btn1.onclick = () => saveFavouriteMichi(data[0].id);
    btn2.onclick = () => saveFavouriteMichi(data[1].id);
    btn3.onclick = () => saveFavouriteMichi(data[2].id);
    btn4.onclick = () => saveFavouriteMichi(data[3].id);
  }
}

async function loadFavouriteMichis() {
  const res = await fetch(API_URL_FAVORITES, {
    method: 'GET',
    headers: {
      'X-API-KEY': 'live_xY281V8h7sjSdMzYUHi0IspdYiRX6p05H6LYResKiKtI283OSBiporUy8o8ZMRCu',
    },
  });
  const data = await res.json();
  console.log('Favorites')
  console.log(data)

  if (res.status !== 200) {
    spanError.innerHTML = "There is an error" + res.status + data.message;
  } else {//sacamos la URL para ponerla a los favoritos
    const section = document.getElementById('favoriteMichis')
    section.innerHTML = "";


    data.forEach(michi => {//recorrermos el array: por cada cat

      const article = document.createElement('article');
      const div = document.createElement('div');
      const img = document.createElement('img');
      const btn = document.createElement('button');
      const btnText = document.createTextNode('Delete from favorites');//funcion que crea texto para los nodos de HTML
      
      btn.classList.add('btn-delete');
      img.classList.add('image1');
      img.src= michi.image.url
      btn.appendChild(btnText);
      btn.onclick = () => deleteFavouriteMichi(michi.id);
      article.appendChild(div);
      div.appendChild(img);
      article.appendChild(btn);
      section.appendChild(article);
  })
  }
}

async function saveFavouriteMichi(id) {
  const { data, status} = await api.post('/favourites', {//le decimos solamente el .metodo, endpoint y el body
    image_id: id //axious pone por nosotros el content type y stringify
  })
  //const res = await fetch(API_URL_FAVORITES, {
    //method: 'POST',
    //headers:{ 
      //'Content-Type': 'application/json',
      //'X-API-KEY': 'live_xY281V8h7sjSdMzYUHi0IspdYiRX6p05H6LYResKiKtI283OSBiporUy8o8ZMRCu'
    //},
    //body: JSON.stringify({ 
      //image_id: id
    //}), 
  //});
  //const data = await res.json();

  console.log('Save')

  if (status !== 200) {
    spanError.innerHTML = "There was an error" + status + data.message;
  } else {
    console.log('Cat saved in favorites')
    loadFavouriteMichis();
  }
}

async function deleteFavouriteMichi(id) {
  const res = await fetch(API_URL_FAVORITES_DELETE(id), {
    method: 'DELETE',
    headers: {
      'X-API-KEY': 'live_xY281V8h7sjSdMzYUHi0IspdYiRX6p05H6LYResKiKtI283OSBiporUy8o8ZMRCu',
    }
  });
  const data = await res.json();

  if (res.status !== 200) {
    spanError.innerHTML = "There was an error: " + res.status + data.message;
  } else {
    console.log('Deleted from favorites')
    loadFavouriteMichis();
  }
}

async function uploadMichiPhoto() {
  const form = document.getElementById('uploadingForm')
  const formData = new FormData(form);//le ponemos el formulario como aregumento para que agarre todos los formularios de input y los agrega a FormData

  console.log(formData.get('file'))

  const res = await fetch(API_URL_UPLOAD,{
    method: 'POST',
    headers: {
      //'Content-Type': 'multipart/form-data', no hay que poner content-type pues fetch sabe que si le enviamos
      //una instancia de FormData automaticamente pone el content-type y el boundary
      'X-API-KEY': 'live_xY281V8h7sjSdMzYUHi0IspdYiRX6p05H6LYResKiKtI283OSBiporUy8o8ZMRCu',
    },//no necesitamos JSON.stringify pues estamos usando FormData que agarra todo lo que viene del formulario
    body: formData,
  })
}

loadRandomMichis();
loadFavouriteMichis();