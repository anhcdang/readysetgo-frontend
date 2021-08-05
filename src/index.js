const workoutForm = document.querySelector('form.create-workout-form')
const workoutNameInput = document.querySelector('form.create-workout-form input#workout-name')
const blockExerciseSetForm = document.querySelector('form.create-block-set-form')
const addExerciseSetButton = document.querySelector('button#add-set')
const exerciseSetFormBlock = document.querySelector('div.set-form-block')
const exerciseSetFormContainer = document.querySelector('div.set-form-container')
const blockWorkoutSelectInput = document.querySelector('select.block-exercise-select')

function fetchWorkouts() {
    return fetch('http://127.0.0.1:3000/workouts')
    .then(resp => resp.json())
}

function getWorkoutPlaceholder() {
    fetchWorkouts().then(function(workoutsArray) {
        workoutNameInput.placeholder = `Workout ${workoutsArray.length + 1}`
    })
}
getWorkoutPlaceholder()

function autoWorkoutNameValue(input) {
    // fetchWorkouts().then(function(workoutsArray) {
    //     input.value = `Workout ${workoutsArray.length + 1}`
    // })
    input.value = input.placeholder
}

workoutForm.addEventListener('submit', function(event) {
    event.preventDefault()

    const workoutName = event.target[0]

    if (workoutName.value == "") {
        autoWorkoutNameValue(workoutName)
    }
    
    // update placeholder
    const origPlaceholderNum = Number(workoutName.placeholder.match(/\d+/)[0])
    workoutName.placeholder = `Workout ${origPlaceholderNum + 1}`

    fetch('http://127.0.0.1:3000/workouts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            "Accept": "application/json"
        },
        body: JSON.stringify({
            name: workoutName.value
        })
    })
    .then(response => response.json())
    .then(data => {
        createWorkoutOption(data)
    })
    
    
    // add newest workout to workout options in Block form select input
    fetchWorkouts().then(function(workoutsArray) {
        const newestWorkoutObj = workoutsArray[workoutsArray.length - 1]
        createWorkoutOption(newestWorkoutObj)
    })

    event.target.reset()
})

// show Block/Set form if at least 1 workout exists
fetchWorkouts().then(function(workoutsArray) {
    if (workoutsArray.length > 0) {
        console.log("Hello!")
    }
})

// add new exercise sets in the Block/ExerciseSet form
addExerciseSetButton.addEventListener('click', function() {
    const newSetFormBlock = exerciseSetFormBlock.cloneNode(true)
    
    const lineBreak = document.createElement('hr')

    exerciseSetFormContainer.appendChild(lineBreak)
    exerciseSetFormContainer.appendChild(newSetFormBlock)
})

function createWorkoutOption(workoutObject) {
    // create option
    const newOption = document.createElement('option')
    // assign name & id to option
    newOption.value = workoutObject.id
    newOption.textContent = workoutObject.name
    // append to select input
    blockWorkoutSelectInput.appendChild(newOption)
}

// on page load
function renderWorkoutOptions() {
    // add workout options to select input in Block form
    fetchWorkouts().then(function(workoutsArray) {
        workoutsArray.forEach(function(workoutObj) {
            createWorkoutOption(workoutObj)
        })
    })
}
renderWorkoutOptions()
