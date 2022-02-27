// Get csrf token from Flask backend
const csrfToken = document.getElementById('csrf').firstChild.value

// Get planId and recordId
const projectId = document.getElementById('projectId').innerHTML

// Instantiate working variables
let fileUrlArray = []

// Listen for change in file input HTML
const fileInput = document.getElementById('fileInput')

fileInput.addEventListener('change', e => {
    fileUrlArray = []  // Reset file url array
    document.getElementById('fileResult').innerHTML = ''  // Reset result DOM

    let fileId = 0

    // Append formData with information for all files
    const formData = new FormData()

    for (let i=0; i < fileInput.files.length; i++) {
        formData.append(`file`, fileInput.files[i])
    }

    // Convert form data to array
    const fileList = formData.getAll('file')

    console.log('Selected files:', fileList)

    // Append file info to DOM
    fileList.forEach((i, index) => {
        const childNode = document.createElement('div')
        
        childNode.setAttribute('id', `file${fileId+1}`)
        childNode.setAttribute('class', 'file-repo-item')
        document.getElementById('fileRepo').appendChild(childNode)
        document.getElementById(`file${fileId+1}`).innerHTML = `<span class="text-gray">${fileList[index]['name']}</span>`

        fileId += 1
    })

    // Update upload status to DOM
    document.getElementById('uploadStatus').innerHTML = 'アップロード'

    // Post all file at once
    fetch('/project/' + projectId + '/file-post', {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrfToken
        },
        body: formData,
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);

        result.forEach(i => {
            if (i.uploadStatus == true) {
                const childNode = document.createElement('div')
        
                childNode.setAttribute('id', `i${i.uploadedFileId}`)
                childNode.setAttribute('class', 'uploader-wrapper')
                document.getElementById('fileResult').appendChild(childNode)
                document.getElementById(`i${i.uploadedFileId}`).innerHTML = `
                    <div class="uploader-tool">
                        <div class="uploader-tool-vertical-center">
                            <button class="uploader" onclick="moveUp(${i.uploadedFileId})"><div class="arrow-up"></div></button><br>
                            <span class="arrow-text">交換</span><br>
                            <button class="uploader" onclick="moveDown(${i.uploadedFileId})"><div class="arrow-down"></div></button>
                        </div>
                    </div>
                    <div class="uploader-content">
                        <img id="ci${i.uploadedFileId}" src="${i.fileUrl}" alt="${i.uploadedOriginalName}">
                        <p id="cp${i.uploadedFileId}">${i.uploadedOriginalName}</p>
                    </div>
                `

                // Construct an file url array
                fileUrlArray.push(i.fileUrl)
            }
        })

        if (fileUrlArray.length > 0) {
            document.getElementById('uploadStatus').innerHTML = 'アップロードが完了しました。'
        } else {
            document.getElementById('uploadStatus').innerHTML = 'アップロード可能なファイルがありません。使用可能な形式のファイルを選択してください。'
        }

        console.log('file URL array:', fileUrlArray);
    })
    .catch(error => {
        document.getElementById('uploadStatus').innerHTML = '申し訳ありませんが、アップロードできませんでした。もう一度お試しください。'
        console.error('Error:', error);
    });
})

function moveUp(item) {
    // Store each type of current content as array
    let ciSrcOriginal = []
    let ciAltOriginal = []
    let cpOriginal = []

    for (let i=1; i <= fileUrlArray.length; i++) {
        ciSrcOriginal.push(document.getElementById(`ci${i}`).getAttribute('src'))
        ciAltOriginal.push(document.getElementById(`ci${i}`).getAttribute('alt'))
        cpOriginal.push(document.getElementById(`cp${i}`).innerHTML)
    }

    if (item == 1) {
        console.log('Already at the top')
    } else {
        // Replace target item with current item
        document.getElementById(`ci${item-1}`).setAttribute('src', ciSrcOriginal[item-1])
        document.getElementById(`ci${item-1}`).setAttribute('alt', ciAltOriginal[item-1])
        document.getElementById(`cp${item-1}`).innerHTML = cpOriginal[item-1]

        // Replace current item with target item
        document.getElementById(`ci${item}`).setAttribute('src', ciSrcOriginal[item-2])
        document.getElementById(`ci${item}`).setAttribute('alt', ciAltOriginal[item-2])
        document.getElementById(`cp${item}`).innerHTML = cpOriginal[item-2]

        // Reconstruct an updated fileUrlArray
        fileUrlArrayOriginal = [...fileUrlArray]
        fileUrlArray = []

        for (let i=1; i <= fileUrlArrayOriginal.length; i++) {
            fileUrlArray.push(document.getElementById(`ci${i}`).getAttribute('src'))
        }

        console.log('New fileUrlArray:', fileUrlArray)
    }
}

function moveDown(item) {
    // Store each type of current content as array
    let ciSrcOriginal = []
    let ciAltOriginal = []
    let cpOriginal = []

    for (let i=1; i <= fileUrlArray.length; i++) {
        ciSrcOriginal.push(document.getElementById(`ci${i}`).getAttribute('src'))
        ciAltOriginal.push(document.getElementById(`ci${i}`).getAttribute('alt'))
        cpOriginal.push(document.getElementById(`cp${i}`).innerHTML)
    }

    if (item == fileUrlArray.length) {
        console.log('Already at the bottom')
    } else {
        // Replace target item with current item
        document.getElementById(`ci${item+1}`).setAttribute('src', ciSrcOriginal[item-1])
        document.getElementById(`ci${item+1}`).setAttribute('alt', ciAltOriginal[item-1])
        document.getElementById(`cp${item+1}`).innerHTML = cpOriginal[item-1]

        // Replace current item with target item
        document.getElementById(`ci${item}`).setAttribute('src', ciSrcOriginal[item])
        document.getElementById(`ci${item}`).setAttribute('alt', ciAltOriginal[item])
        document.getElementById(`cp${item}`).innerHTML = cpOriginal[item]

        // Reconstruct an updated fileUrlArray
        fileUrlArrayOriginal = [...fileUrlArray]
        fileUrlArray = []

        for (let i=1; i <= fileUrlArrayOriginal.length; i++) {
            fileUrlArray.push(document.getElementById(`ci${i}`).getAttribute('src'))
        }

        console.log('New fileUrlArray:', fileUrlArray)
    }
}

// Save function
function fileUrlsSubmit() {
    fetch('/project/' + projectId + '/file-save', {
        method: 'post', 
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(fileUrlArray)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Saved file URL list:', data)
        window.location.replace('/project/' + projectId)  // REDIRECT TARGET HERE
    })
    .catch((error) => {
        console.error('Error: ', error);
    })
}