const selected = document.querySelector('#selectedImage')
const returned = document.querySelector('#returnedImage')
const footer   = document.querySelector('.card-footer')
function updateImage(event) {
    selected.classList.remove('hidden')
    returned.classList.add('hidden')
    footer.classList.add('hidden')
    setImage('selected', event.target.files[0])
}
// document.querySelector('#fileInput').addEventListener('change', (event) => {
//     setImage('selected', event.target.files[0])
// })
let fd = FormData
function removebg(event, intent=0) {
    event.preventDefault();
    // const key = 'MhGo4KGWj2ZKqJzUvaJzGz6s' // key fbaguem2021
    // const key = 'htmEDHT5syLgYxcUcsbPQQqE' // key pruevas

    const keys = [ 'htmEDHT5syLgYxcUcsbPQQqE', 'MhGo4KGWj2ZKqJzUvaJzGz6s' ]
    const key = (function(intent) {
        if (intent < keys.length) return keys[intent]
        else return -1
    })(intent)
    if (key === -1) return false

    const fileInput = document.forms['myform']['file']
    let headers = { axios: Object, fetch: Object }
    let formData = new FormData()
    let fileselected = fileInput.files[0]
    formData.append('image_file', fileInput.files[0])
    formData.append('size','auto')
    fd = formData
    headers.fetch = getFetchHeaders(formData, key)

    fetch('https://api.remove.bg/v1.0/removebg', headers.fetch)
    .then(response => response.blob())
    .then(blob => {
        console.log(1);
        const fileData = {
            extension: ((file) => { const arr=file.split('.');return arr[arr.length-1] })(fileselected.name),
            curdate:   new Date().toLocaleString().replace(', ','-'),
            name:      `no-background-image-${this.curdate}.${this.extension}`,
        }
        const file = new File([blob], fileData.name, { type: blob.type })
        setImage('returned', file)
        
        const downloadbtn = document.querySelector('#downloadbtn')
        downloadbtn.classList.remove('hidden')
        const handler = function(file) {
            const link    = document.createElement('a')
            link.href     = URL.createObjectURL(file)
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        } 
        handler(file)
        downloadbtn.addEventListener('click', (event) => { handler(file) })
        console.log("The background of the image has been removed successfully");
    })
    .catch(error => {
        intent++
        console.error('Error: ',error)
        removebg(event, intent)
    })

    return false
}
function setImage(type, image) {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        if (type == 'selected') {
            selected.src = event.target.result
        } else if (type == 'returned') {
            window.localStorage.removedImage = image
            returned.src = event.target.result
            returned.classList.remove('hidden')
            footer.classList.remove('hidden')
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
function windowLoad(event) {
    const fileInput = document.forms['myform']['file']
    if (fileInput.files.length != 0) {
        setImage('selected', fileInput.files[0])
    }
}
window.addEventListener('load',windowLoad)