// function setAction() {
//     // const form = document.forms['myform']
//     // console.log('form',form)
//     // location.href = `./result.html?name=${form['name'].value}&age=${form['age'].value}`
//     return false
// }
// document.getElementById('myform').onsubmit = 'event.preventDefault(); return setActio;n'
// import FormData from 'https://cdn.jsdelivr.net/npm/form-data@4.0.0/+esm'
document.querySelector('#fileInput').addEventListener('change', (event) => {
    setImage('selected', event.target.files[0])
})
let fileselected = File
let fd = FormData
function removebg(event) {
    event.preventDefault();
    // const key = 'MhGo4KGWj2ZKqJzUvaJzGz6s';
    const key = 'htmEDHT5syLgYxcUcsbPQQqE'
    const fileInput = document.forms['myform']['file']
    const headers = { axios: Object, fetch: Object }
    const formData = new FormData()
    // console.log(fileInput.files[0]);
    fileselected = fileInput.files[0]
    formData.append('image_file', fileInput.files[0])
    formData.append('size','auto')
    fd = formData
    // headers.axios = getAxiosHeaders(formData, key)
    headers.fetch = getFetchHeaders(formData, key)

    fetch('https://api.remove.bg/v1.0/removebg', headers.fetch)
    .then(response => response.blob())
    .then(blob => {
        const fileData = {
            extension: ((file) => { const arr=file.split('.');return arr[arr.length-1] })(fileselected.name),
            curdate: new Date().toLocaleString().replace(', ','-'),
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
        console.error('Error: ',error)
    })

    return false
}
function setImage(type, image) {
    const reader = new FileReader();
    // let selectedImage = document.querySelector('#selectedImage')
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
        headers: {
            'X-Api-Key': key
        },
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
// document.querySelector('#myform').addEventListener('submit',removebg)