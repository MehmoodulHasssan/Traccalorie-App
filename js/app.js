class CalorieTracker {
    constructor (){
        this._caloriesLimit  = Storage.getCaloriesLimit(),
        this._totalCalories = Storage.getTotalCalories(),
        this._meals = Storage.getMeals(),
        this._workouts = Storage.getWorkouts()

        this.loadItems()
        this._displayCaloriesLimit()
        this._displayTotalCalories()
        this._displayCaloriesRemaining()
        this._displayCaloriesConsumed()
        this._displayCaloriesburned()
        
        document.querySelector('#limit').value = this._caloriesLimit
    }

    //Public Method APIs
    addMeal(meal){
        this._meals.push(meal);
        this._totalCalories += meal.calories;
        Storage.setTotalCalories(this._totalCalories)
        Storage.setMeals(meal)
        this._displayNewMeal(meal)
        this._render()
    }
    removeMeal(id){
        const index = this._meals.findIndex((meal)=> meal.id === id)
        if(index !== -1){
            this._totalCalories -= this._meals[index].calories;
            this._meals.splice(index, 1)
        }
        this._render()
    }
    removeWorkout(id){
        const index = this._workouts.findIndex((workout)=> workout.id === id)
        if(index !== -1){
            this._totalCalories += this._workouts[index].calories;
            this._workouts.splice(index, 1)
        }
        this._render()
    }
    
    addWorkout(workout){
        this._workouts.push(workout);
        this._totalCalories -= workout.calories;
        Storage.setTotalCalories(this._totalCalories)
        Storage.setWorkouts(workout)
        this._displayNewWorkout(workout)
        this._render()
    }
    removeAll(){
        this._totalCalories = 0,
        this._meals = [],
        this._workouts = []
        Storage.clearAll()
        this._render()
    }
    setCaloriesLimit(limit){
        Storage.setCaloriesLimit(limit)
        this._caloriesLimit = +limit
        this._displayCaloriesLimit()
        this._render()
    }
    loadItems(){
        this._meals.forEach((meal)=>{
            this._displayNewMeal(meal)
        })
        this._workouts.forEach((workout)=>{
            this._displayNewWorkout(workout)
        })
        this._render()
    }

    //Private Method APIs
    _displayCaloriesLimit(){
        // this._caloriesLimit = +value
        const limitEl = document.querySelector('#calories-limit')
        limitEl.innerHTML = this._caloriesLimit
    }
    _displayTotalCalories(){
        const totalCaloriesEl = document.querySelector('#calories-total')
        totalCaloriesEl.innerHTML = this._totalCalories
        
    }
    _displayCaloriesRemaining(){
        const progressBarEl = document.querySelector('#calorie-progress')
        const caloriesRemainingEl = document.querySelector('#calories-remaining')
        const remaining = this._caloriesLimit - this._totalCalories;
        caloriesRemainingEl.innerHTML = remaining

        if(remaining<=0){
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-light')
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-danger')
            progressBarEl.classList.remove('bg-success')
            progressBarEl.classList.add('bg-danger')
        }else{
            caloriesRemainingEl.parentElement.parentElement.classList.add('bg-light')
            caloriesRemainingEl.parentElement.parentElement.classList.remove('bg-danger')
            progressBarEl.classList.add('bg-success')
            progressBarEl.classList.remove('bg-danger')
        }
        
    }
    _displayCaloriesConsumed(){
        const caloriesConsumedEl = document.querySelector('#calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories,0);
        caloriesConsumedEl.innerHTML = consumed;
        
    }
    _displayCaloriesburned(){
        const caloriesBurnedEl = document.querySelector('#calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories,0);
        caloriesBurnedEl.innerHTML = burned;
        
    }
    _displayCaloriesProgress(){
        const progressBarEl = document.querySelector('#calorie-progress')
        progressBarEl.style.width = `${this._totalCalories / (this._caloriesLimit) * 100}%`
    }
    _displayNewMeal(e){
        const mealItems = document.querySelector('#meal-items')
        const div = document.createElement('div')
        div.classList.add('card', 'my-2')
        div.setAttribute('data-id', e.id)
        div.innerHTML = `
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${e.name}</h4>
        <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
          ${e.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
        </div>
        </div>
        `
        mealItems.appendChild(div)
    }
    _displayNewWorkout(e){
        const workoutItems = document.querySelector('#workout-items')
        const div = document.createElement('div')
        div.classList.add('card', 'my-2')
        div.setAttribute('data-id', e.id)
        div.innerHTML = `
        <div class="card-body">
        <div class="d-flex align-items-center justify-content-between">
        <h4 class="mx-1">${e.name}</h4>
        <div class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5">
          ${e.calories}
        </div>
        <button class="delete btn btn-danger btn-sm mx-2">
          <i class="fa-solid fa-xmark"></i>
        </button>
        </div>
        </div>
        `
        workoutItems.appendChild(div)
    }
    _render(){
        this._displayTotalCalories();
        this._displayCaloriesRemaining();
        this._displayCaloriesConsumed();
        this._displayCaloriesburned();
        this._displayCaloriesProgress()
    }

}

class Meal {
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2),
        this.name = name,
        this.calories = calories;
    }
}
class Workout {
    constructor(name, calories){
        this.id = Math.random().toString(16).slice(2),
        this.name = name,
        this.calories = calories;
    }
}

class Storage {
    static getCaloriesLimit(defaultlimit = 2000){
        let caloriesLimit;
        if(localStorage.getItem('caloriesLimit') === null){
            caloriesLimit = defaultlimit;
        }else {
            caloriesLimit = +localStorage.getItem('caloriesLimit')
        }
        return caloriesLimit;
    }
    static setCaloriesLimit(caloriesLimit){
        localStorage.setItem('caloriesLimit', caloriesLimit)
    }

    static getTotalCalories(defaultTotal = 0){
        let totalCalories;
        if(localStorage.getItem('totalCalories')===null){
            totalCalories = defaultTotal
        }else{
            totalCalories = +localStorage.getItem('totalCalories')
        }
        return totalCalories;
    }
    static setTotalCalories(value){
        localStorage.setItem('totalCalories', value )
    }
    static getMeals(){
        let meals;
        if(localStorage.getItem('meals')===null){
            meals = []            
        }else{
            meals = JSON.parse(localStorage.getItem('meals'))
        }
        return meals;
    }
    static setMeals(meal){
        const meals = Storage.getMeals()
        meals.push(meal)
        localStorage.setItem('meals', JSON.stringify(meals))
    }
    static getWorkouts(){
        let workouts;
        if(localStorage.getItem('workouts')===null){
            workouts = []            
        }else{
            workouts = JSON.parse(localStorage.getItem('workouts'))
        }
        return workouts;
    }
    static setWorkouts(workout){
        const workouts = Storage.getWorkouts()
        workouts.push(workout)
        localStorage.setItem('workouts', JSON.stringify(workouts))
    }
    static removeMeal(id){
        const meals = Storage.getMeals()
        meals.forEach(meal => {
            if(meal.id === id){
                meals.splice(meals.indexOf(meal), 1)
            }
        });
        localStorage.setItem('meals', JSON.stringify(meals))
    }
    static removeWorkout(id){
        const workouts = Storage.getWorkouts()
        workouts.forEach(workout => {
            if(workout.id === id){
                workouts.splice(workouts.indexOf(workout), 1)
            }
        });
        localStorage.setItem('workouts', JSON.stringify(workouts))
    }
    static clearAll(){
        localStorage.removeItem('meals')
        localStorage.removeItem('totalCalories')
        localStorage.removeItem('workouts')
    }
}

class App {
    constructor(){
        this._tracker = new CalorieTracker;
        document.querySelector('#meal-form').addEventListener('submit', this._newItem.bind(this, 'meal'))
        document.querySelector('#workout-form').addEventListener('submit', this._newItem.bind(this, 'workout'))
        document.querySelector('#meal-items').addEventListener('click', this._removeItem.bind(this, 'meal'))
        document.querySelector('#workout-items').addEventListener('click', this._removeItem.bind(this, 'workout'))
        document.querySelector('#filter-meals').addEventListener('input',this. _filterItems.bind(this, 'meal'))
        document.querySelector('#filter-workouts').addEventListener('input',this. _filterItems.bind(this, 'workout'))
        document.querySelector('#reset').addEventListener('click', this._resetEverything.bind(this))
        document.querySelector('#limit-form').addEventListener('submit', this._setLimit.bind(this))
        // this._tracker.loadItems()
    }

    _newItem(type, e){
        e.preventDefault();
        const item = document.querySelector(`#${type}-name`)
        const calories = document.querySelector(`#${type}-calories`)
        
        if(item.value ==='' || calories.value === ''){
            alert('Please fill the required credentials')
            return;
        }
        if (type ==='meal'){
            const tracker = new Meal(item.value, +calories.value)
            this._tracker.addMeal(tracker)
            
        }else{
            const tracker = new Workout(item.value, +calories.value)
            this._tracker.addWorkout(tracker)
        }
        
        item.value = '';
        calories.value = ''
        const collapseItem = document.querySelector(`#collapse-${type}`)
        const bsCollapse = new bootstrap.Collapse(collapseItem, {
            toggle: true
        }) 
        
    }
    _removeItem(type, e){
        const targetDiv = e.target.closest('.card')
        const id = targetDiv.getAttribute('data-id') 
        if(confirm('Are you sure bro?')){
            if(type === 'meal'){
                this._tracker.removeMeal(id)
                targetDiv.remove();
                Storage.removeMeal(id)
            } else{
                this._tracker.removeWorkout(id)
                targetDiv.remove();
                Storage.removeWorkout(id)
            }

        }

    }
    _filterItems(type,e){
        // const mealsEl = document.querySelector('#meal-items')
        const items = document.querySelectorAll(`#${type}-items .card`)
        items.forEach((item) => {
            
        const text = item.firstElementChild.firstElementChild.querySelector('h4').innerText
        if(text.indexOf(e.target.value.toLowerCase()) !== -1){
                item.style.display ='flex'
        }else {
            item.style.display = 'none';
        }
    });    
    }
    _resetEverything (e){
        if(confirm('Do you want to reset everything?')){
            document.querySelector('#meal-items').innerHTML = ''
            document.querySelector('#workout-items').innerHTML = ''
            document.querySelector('#filter-workouts').value = ''
            document.querySelector('#filter-meals').value = ''
            this._tracker.removeAll()

        }

    }
    _setLimit(e){
        e.preventDefault();
        const value = document.querySelector('#limit').value;
        this._tracker.setCaloriesLimit(value)
        this._tracker._displayCaloriesLimit(value)
        document.querySelector('#limit').value = ''
        const modalEl = document.querySelector('#limit-modal')
        const modal = bootstrap.Modal.getInstance(modalEl)
        modal.hide();
    }

}

const app = new App(this._tracker)


 


