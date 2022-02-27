// FORM EDIT PART

// Get csrf token from Flask backend
const csrfToken = document.getElementById('csrf').firstChild.value

// Get route id
const projectId = document.getElementById('projectId').innerHTML
const stakeholderId = document.getElementById('stakeholderId').innerHTML
const activityId = document.getElementById('activityId').innerHTML
const dataJson = document.getElementById('data').innerHTML
const data = JSON.parse(dataJson)

// Define blank form data to be used later by fetch function
let formData = {}

// Define form elements by id
const activity = document.getElementById('activity')

// Form submission
function fetchSubmit() {
    // Randomise bg color
    bgAll = ["#ffe5e5", "#fff2e5", "#ffffe5", "#f2ffe5", "#e5ffe5", "#e5fff2", "#e5ffff", "#e6f7ff", "#e5ecff", "#ece5ff", "#f9e5ff", "#ffe5f9", "#ffe5ec"]
    
    // Build final formData
    formData = {
        activity: activity.value, 
        bgcolor: bgAll[Math.floor(Math.random()*bgAll.length)], 
        published: true
    }

    fetch('/project/' + projectId + '/' + stakeholderId + '/' + activityId +'/edit', {
        method: 'post', 
        credentials: 'include',
        cache: "no-cache", 
        headers: {
            'Content-Type': 'application/json', 
            'X-CSRFToken': csrfToken
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        window.location.replace('/project/' + projectId)
    })
    .catch((error) => {
        console.error('Error: ', error);
    })
}