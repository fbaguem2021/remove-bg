class Modal extends HTMLElement {
  constructor() {
    super()
    const template = document.createElement('')
  }
  connectedCallback() {

  }
  getTemplate() {
    return /* html */ `
  <div id="modal-remover">
    <form id="myform" name="myform" onsubmit="return removebg(event)">
      <div>
        <label for="file">File: </label>
        <input type="file" name="file" id="fileInput" onchange="updateImage(event)" required>
      </div>
      <input type="submit" value="Eliminar fondo">
    </form>
    <div>
      <img id="selectedImage" width="250px" alt="selected image">
      <img id="returnedImage" width="250px" alt="returned image">
      <div>
        <button id="downloadbtn" class="hidden">Descargar</button>
      </div>
    </div>
  </div>
  `
  }
}

function updateImage(event) {
  setImage('selected', event.target.files[0])
}
let fd = FormData
function removebg(event, intent = 0) {
  event.preventDefault();
  // const key = 'MhGo4KGWj2ZKqJzUvaJzGz6s' // key fbaguem2021
  // const key = 'htmEDHT5syLgYxcUcsbPQQqE' // key pruevas

  const keys = ['htmEDHT5syLgYxcUcsbPQQqE', 'MhGo4KGWj2ZKqJzUvaJzGz6s']
  const key = (function (intent) {
    if (intent < keys.length) return keys[intent]
    else return -1
  })(intent)
  if (key === -1) return false

  const fileInput = document.forms['myform']['file']
  let headers = { axios: Object, fetch: Object }
  let formData = new FormData()
  let fileselected = fileInput.files[0]
  formData.append('image_file', fileInput.files[0])
  formData.append('size', 'auto')
  fd = formData
  headers.fetch = getFetchHeaders(formData, key)

  fetch('https://api.remove.bg/v1.0/removebg', headers.fetch)
    .then(response => response.blob())
    .then(blob => {
      console.log(1);
      const fileData = {
        extension: ((file) => { const arr = file.split('.'); return arr[arr.length - 1] })(fileselected.name),
        curdate: new Date().toLocaleString().replace(', ', '-'),
        name: `no-background-image-${this.curdate}.${this.extension}`,
      }
      const file = new File([blob], fileData.name, { type: blob.type })
      setImage('returned', file)

      const downloadbtn = document.querySelector('#downloadbtn')
      downloadbtn.classList.remove('hidden')
      downloadbtn.addEventListener('click', (event) => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(file)
        link.download = file.name
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
      console.log("The background of the image has been removed successfully");
    })
    .catch(error => {
      intent++
      console.error('Error: ', error)
      removebg(event, intent)
    })

  return false
}
function setImage(type, image) {
  const reader = new FileReader();
  reader.addEventListener('load', (event) => {
    if (type == 'selected') {
      selectedImage.src = event.target.result
    } else if (type == 'returned') {
      returnedImage.src = event.target.result
    }
  });
  reader.readAsDataURL(image);
}
function getAxiosHeaders(formData, key) {
  return {
    method: 'post',
    url: 'https://api.remove.bg/v1.0/removebg',
    data: formData,
    responseType: 'arraybuffer',
    headers: {
      ...formData.getHeaders(),
      'X-Api-Key': key
    }
  }
}
function getFetchHeaders(formData, key) {
  return {
    method: 'POST',
    headers: { 'X-Api-Key': key },
    body: formData
  }
}