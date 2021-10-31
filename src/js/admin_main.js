"use strict";

//Element Variables 
let listContainer = document.getElementById("admin_list_container");
let eduAddEdit = document.getElementById("eduAddEdit");
let addNewEduBtn = document.getElementById("addNewEduBtn");
let eduSubmitBtn = document.getElementById("eduSubmitBtn");
let eduEditBtn = document.getElementById("eduEditBtn");
let addNewEduDispBtn = document.getElementById("addNewEduDispBtn");

//Element Variable Link
let eduLink = document.getElementById("edu_link");

//Element Variables Form
let eduForm = document.getElementById("eduForm");
let eduFormheader = document.getElementById("eduFormheader");
let eduUniversityFrm = document.getElementById("eduUniversity");
let eduCourseFrm = document.getElementById("eduCourse");
let eduStartDateFrm = document.getElementById("eduStartDate");
let eduEndDateFrm = document.getElementById("eduEndDate");

//Eventlisteners
eduLink.addEventListener("click", getEducations);
eduSubmitBtn.addEventListener('click',createEdu);
eduEditBtn.addEventListener('click',updateEdu);
addNewEduDispBtn.addEventListener('click',addNewEduDispToggle);


//Variable to hold ID's
let idHolder = "";

let restlink = "https://studenter.miun.se/~fegi2000/writeable/projekt_wiii_ws/api.php";

//Get function go get data from education table
function getEducations() {

    //Set classes on the links to show where we are
    eduLink.classList.add("visited");
    pofLink.classList.remove("visited");
    wrkLink.classList.remove("visited");
    //Show or hide Add new buttons.
    addNewEduDispBtn.style.display = "block";
    addNewPofDispBtn.style.display = "none";
    addNewWrkDispBtn.style.display = "none";

    //Toggles Portfolio form if it was in state Block
    if(pofAddEdit.style.display === 'block') {
        addNewPofDispToggle();
    }
    //Toggles Work experience form if it was in state Block
    if(wrkAddEdit.style.display === 'block') {
        addNewWrkDispToggle();
    }
    
    //Empty the listcontainer 
    listContainer.innerHTML = "";
    
    //Addlist header
    listContainer.innerHTML +=
    `<div class="rowWrapper listheader">
        <div class="adm_col1">
            <b>Lärosäte:</b>
        </div>
        <div class="adm_col2">
            <b>Utbildning:</b> 
        </div>
        <div class="adm_col3">
            <b>Startdatum:</b>
        </div>
        <div class="adm_col4">
            <b>Slutdatum:</b>
        </div>
    </div>
    `;

    //Call restapi to get data from education table
    //fetch('http://10.0.1.222/projekt_wiii_ws/api?type=edu')
    fetch(restlink + '?type=edu')
    .then(response => response.json())
    .then(data => {
        data.forEach(edu => {
            //Run substring on start and end date to only show year and month.
            let tmp_startdate = edu.startDate
            tmp_startdate = tmp_startdate.substring(0,7);
            let tmp_enddate = edu.endDate
            tmp_enddate = tmp_enddate.substring(0,7);
            //Add fetched data to listContainer element.
            listContainer.innerHTML +=
            `<div class="rowWrapper">
                <div class="adm_col1">
                <span class="small_listheader">Lärosäte: </span>${edu.university}
                </div>
                <div class="adm_col2">
                <span class="small_listheader">Utbildning: </span>${edu.course}
                </div>
                <div class="adm_col3">
                <span class="small_listheader">Start datum: </span>${tmp_startdate}
                </div>
                <div class="adm_col4">
                <span class="small_listheader">Slut datum: </span>${tmp_enddate}
                </div>
                <div class="adm_col5">
                    <button id="${edu.id}" class="btn_del" onClick="deleteEdu(${edu.id})">Radera</button>
                    <button id="${edu.id}" class="btn_update" onClick="setFormEdu(${edu.id})">Ändra</button>
                </div>
            </div>`;
            
        });
    })

}

//Toggle function to hide, show and change header/button text depending on what triggered this function
function addNewEduDispToggle(value) {
    //If addEdit container is showing, hide it and toggle some buttons and change test to header and change text to add new button.
    if(eduAddEdit.style.display === "block") {
        eduAddEdit.style.display ="none"
        eduSubmitBtn.style.display = 'block';
        eduEditBtn.style.display = 'none';
        addNewEduDispBtn.innerText = "Lägg till ny utbildning";
        eduFormheader.innerHTML = "Lägg till utbildning:";
        eduForm.reset();
    }
    //if addEdit is hiding, show it and change add new button's text to hide, and reset form.
    else {
        eduAddEdit.style.display = "block";
        eduEditBtn.style.display = 'none';
        addNewEduDispBtn.innerText = "Dölj";
        eduForm.reset();
    }
    //If function is called with value edit it does almost the same as the first if-state but
    //it also hides submit new button, view  submit edit and change header of the form.
    if(value === "edit") {
        eduAddEdit.style.display = "block";
        eduSubmitBtn.style.display = 'none';
        eduEditBtn.style.display = 'block';
        eduFormheader.innerHTML = "Ändra utbildning"
        addNewEduDispBtn.innerText = "Dölj";
        eduForm.reset();
    }
}

//function to create an education
function createEdu() {

    //Get data from the form
    let var_eduUniv = eduUniversityFrm.value;
    let var_eduCour = eduCourseFrm.value;
    let var_eduStart = eduStartDateFrm.value;
    let var_eduEnd = eduEndDateFrm.value;

    //validate the input if anyone returns false it jump out of this function
    if(!verifyUniversity(var_eduUniv) || !verifyCourse(var_eduCour) || !verifyStartDate(var_eduStart) || ! verifyEndDate(var_eduEnd)){
        return;
    }

    //concatenate fetched data to a single json variable
    let concatEdu = {'university': var_eduUniv, 'course': var_eduCour, 'startDate': var_eduStart, 'endDate': var_eduEnd};
    
    //call rest-api to post the data to database
    //http://localhost/projekt_wiii/pub/login.php
    console.log(restlink + '?type=edu');
    fetch(restlink + '?type=edu', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(concatEdu),
    })
    .then(response => response.text())
    .then(data => {
        //If everything worked fine the list is reloaded and the form toggled to hide.
        getEducations();
        addNewEduDispToggle();
    })
    .catch(error => {
        console.log('Error: ', error);
    })

}

//function to delete a specific course
function deleteEdu(id) {

    //alert message to check that you want to delete the selected row.
    if (confirm('Är du säker på att du vill ta bort detta?')) {
        
        //call the rest api to delete the selected row
        fetch(restlink + '?type=edu&id=' + id, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(data => {
            //if everything is ok the list is reloaded.
            getEducations();
        })
        .catch(error => {
            console.log('Error: ', error);
        })
    }
}


//function to populate the form when "Ändra" is pushed next to a course
function setFormEdu(id){
    
    //call toggle function to show the edit form
    addNewEduDispToggle("edit");

    //hold the selected education's id.
    idHolder = id;

    //fetch data for the slected row.    
    fetch(restlink + '?type=edu&id=' + id)
    .then(response => response.json())
    .then(data => {
        data.forEach(edu => {
            //fetched data is pushed to the form
            eduUniversityFrm.value = edu.university;
            eduCourseFrm.value = edu.course;
            eduStartDateFrm.value = edu.startDate;
            eduEndDateFrm.value = edu.endDate;                        
        });
    })
}

//function to update a course with new data
function updateEdu(){

    //get data form the form and add it to variables
    let var_eduUniv = eduUniversityFrm.value;
    let var_eduCour = eduCourseFrm.value;
    let var_eduStart = eduStartDateFrm.value;
    let var_eduEnd = eduEndDateFrm.value;

    //validate the input if anyone returns false it jump out of this function
    if(!verifyUniversity(var_eduUniv) || !verifyCourse(var_eduCour) || !verifyStartDate(var_eduStart) || ! verifyEndDate(var_eduEnd)){
        return;
    }
    //concatenate fetched data to a single json variable
    let concatEdu = {'university': var_eduUniv, 'course': var_eduCour, 'startDate': var_eduStart, 'endDate': var_eduEnd};
    
    //call rest-api to push the edited data to database
    fetch(restlink + '?type=edu&id=' + idHolder, {
        method: 'PUT',
        body: JSON.stringify(concatEdu),
    })
    .then(response => response.text())
    .then(data => {
        //if everything is ok the list is reloaded and the form is toggled to hide
        getEducations();
        addNewEduDispToggle();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}

//-- Portfolio --//
//Element variables
let pofSubmitBtn = document.getElementById("pofSubmitBtn");
let pofEditBtn = document.getElementById("pofEditBtn");
let pofAddEdit = document.getElementById("pofAddEdit");
let addNewPofDispBtn = document.getElementById("addNewPofDispBtn");
let pofLink = document.getElementById("pof_link");

//Form Element
let pofForm = document.getElementById("pofForm");
let pofFormheader = document.getElementById("pofFormheader");
let pofTitle = document.getElementById("pofTitle");
let pofURL = document.getElementById("pofURL");
let pofDescription = document.getElementById("pofDescription");

//Element Variable Link
pofLink.addEventListener("click", getPortfolio);

//Eventlisteners
addNewPofDispBtn.addEventListener('click',addNewPofDispToggle);
pofSubmitBtn.addEventListener('click',createPof);
pofEditBtn.addEventListener('click',updatePof);

//Get function go get data from portfolio table
function getPortfolio() {

    //Set classes on the links to show where we are
    pofLink.classList.add("visited");
    eduLink.classList.remove("visited");
    wrkLink.classList.remove("visited");

    //Show or hide Add new buttons.
    addNewPofDispBtn.style.display = "block";
    addNewEduDispBtn.style.display = "none";
    addNewWrkDispBtn.style.display = "none";

    //Toggles Education form if it was in state Block
    if(eduAddEdit.style.display === 'block') {
        addNewEduDispToggle();
    }
     //Toggles Work experience form if it was in state Block
    if(wrkAddEdit.style.display === 'block') {
        addNewWrkDispToggle();
    }
    
    //Empty the listcontainer 
    listContainer.innerHTML = "";
    //Addlist header
    listContainer.innerHTML +=
    `<div class="rowWrapper listheader">
        <div class="adm_col1">
            <b>Titel:</b>
        </div>
        <div class="adm_col2">
            <b>URL:</b> 
        </div>
        <div class="adm_col3">
            <b>Beskrivning:</b>
        </div>
    </div>
    `;

    //Call restapi to get data from education table
    fetch(restlink + '?type=pof')
    .then(response => response.json())
    .then(data => {
        data.forEach(pof => {
            //Add fetched data to listContainer element.
            listContainer.innerHTML +=
            `<div class="rowWrapper">
                <div class="adm_col1">
                <span class="small_listheader">Titel: </span>${pof.title}
                </div>
                <div class="adm_col2">
                <span class="small_listheader">URL: </span><a href="${pof.url}">Länk</a>
                </div>
                <div class="adm_col3">
                <span class="small_listheader">Beskrivning: </span>${pof.description}
                </div>
                <div class="adm_col5">
                    <button id="${pof.id}" class="btn_del" onClick="deletePof(${pof.id})">Radera</button>
                    <button id="${pof.id}" class="btn_update" onClick="setFormPof(${pof.id})">Ändra</button>
                </div>
            </div>`;
            
        });
    })

}

//Toggle function to hide, show and change header/button text depending on what triggered this function
function addNewPofDispToggle(value) {
    //If add/edit education form is in state block
    if(pofAddEdit.style.display === "block") {
        pofAddEdit.style.display ="none"
        pofSubmitBtn.style.display = 'block';
        pofEditBtn.style.display = 'none';
        addNewPofDispBtn.innerText = "Lägg till ny webbplats";
        pofFormheader.innerHTML = "Lägg till webbplats:";
        pofForm.reset();
    } else {
        pofAddEdit.style.display = "block";
        addNewPofDispBtn.innerText = "Dölj";
        pofEditBtn.style.display = 'none';
        pofForm.reset();
    }
    //if function is called with text edit.
    if (value === "edit") {
        pofAddEdit.style.display = "block";
        addNewPofDispBtn.innerText = "Dölj";
        pofSubmitBtn.style.display = 'none';
        pofEditBtn.style.display = 'block';
        pofFormheader.innerHTML = "Ändra webbplats:";
        pofForm.reset();
    }
}

//function to add new sites toportfolio 
function createPof() {

    //Get data from the form
    let var_pofTitle = pofTitle.value;
    let var_pofURL = pofURL.value
    let var_pofDesc = pofDescription.value;

    //validate the input if anyone returns false it jump out of this function
    if(!verifyTitle(var_pofTitle) || !verifyUrl(var_pofURL) || !verifyDescription(var_pofDesc)){
        return;
    }

    //concatenate fetched data to a single json variable
    let concatPof = {'title': var_pofTitle, 'url': var_pofURL, 'description': var_pofDesc};
    
    //call rest-api to post the data to database
    fetch(restlink + '?type=pof', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(concatPof),
    })
    .then(response => response.text())
    .then(data => {
        //If everything worked fine the list is reloaded and the form toggled to hide.
        getPortfolio();
        addNewPofDispToggle();
    })
    .catch(error => {
        console.log('Error: ', error);    
    })

}

//function to delete a specific site from portfolio
function deletePof(id) {
    //alert message to check that you want to delete the selected row.
    if (confirm('Är du säker på att du vill ta bort detta?')) {
        
        //call the rest api to delete the selected row
        fetch(restlink + '?type=pof&id=' + id, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(data => {
            //if everything is ok the list is reloaded.
            getPortfolio();
        })
        .catch(error => {
            console.log('Error: ', error);
        })
    }
}

//function to populate the form when "Ändra" is pushed next to a site in portfolio
function setFormPof(id){

    //call toggle function to show the edit form
    addNewPofDispToggle("edit");
    
    //hold the selected site's id.
    idHolder = id;
    
    //fetch data for the slected row.  
    fetch(restlink + '?type=pof&id=' + id)
    .then(response => response.json())
    .then(data => {
        data.forEach(pof => {
            //fetched data is pushed to the form
            pofTitle.value = pof.title;
            pofURL.value = pof.url;
            pofDescription.value = pof.description;                   
        });
    })
}

//fucntion to update a site with new data
function updatePof(){

    //get data form the form and add it to variables
    let var_pofTitle = pofTitle.value;
    let var_pofURL = pofURL.value
    let var_pofDesc = pofDescription.value;

    //validate the input if anyone returns false it jump out of this function
    if(!verifyTitle(var_pofTitle) || !verifyUrl(var_pofURL) || !verifyDescription(var_pofDesc)){
        return;
    }
    //concatenate fetched data to a single json variable
    let concatPof = {'title': var_pofTitle, 'url': var_pofURL, 'description': var_pofDesc};
    
    //call rest-api to push the edited data to database
    fetch(restlink + '?type=pof&id=' + idHolder, {
        method: 'PUT',
        body: JSON.stringify(concatPof),
    })
    .then(response => response.text())
    .then(data => {
        //if everything is ok the list is reloaded and the form is toggled to hide
        getPortfolio();
        addNewPofDispToggle();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}


//-- workexperience --//

//Element Variables 
let wrkSubmitBtn = document.getElementById("wrkSubmitBtn");
let wrkEditBtn = document.getElementById("wrkEditBtn");
let wrkAddEdit = document.getElementById("wrkAddEdit");
let addNewWrkDispBtn = document.getElementById("addNewWrkDispBtn");

//Element Variable Link
let wrkLink = document.getElementById("wrk_link");

//Form Element
let wrkForm = document.getElementById("wrkForm");
let wrkEmployer = document.getElementById("wrkEmployer");
let wrkTitle = document.getElementById("wrkTitle");
let wrkStartDate = document.getElementById("wrkStartDate");
let wrkEndDate = document.getElementById("wrkEndDate");

//Eventlisteners
wrkLink.addEventListener("click", getWrkexperience);
addNewWrkDispBtn.addEventListener('click',addNewWrkDispToggle);
wrkSubmitBtn.addEventListener('click', createWrk);
wrkEditBtn.addEventListener('click', updateWrk);

//Function to load Work experience and print it to the listContainer
function getWrkexperience() {
    
    //Set classes on the links to show where we are
    wrkLink.classList.add("visited");
    pofLink.classList.remove("visited");
    eduLink.classList.remove("visited");
    //Show or hide Add new buttons.
    addNewWrkDispBtn.style.display = "block";
    addNewPofDispBtn.style.display = "none";
    addNewEduDispBtn.style.display = "none";

    //Toggles Portfolio form if it was in state Block
    if(pofAddEdit.style.display === 'block') {
        addNewPofDispToggle();
    }
    //Toggles Education form if it was in state Block
    if(eduAddEdit.style.display === 'block') {
        addNewEduDispToggle();
    }
    
    //Empty the listcontainer 
    listContainer.innerHTML = "";
    
    //Addlist header
    listContainer.innerHTML +=
    `<div class="rowWrapper listheader">
        <div class="adm_col1">
            <b>Arbete:</b>
        </div>
        <div class="adm_col2">
            <b>Titel:</b> 
        </div>
        <div class="adm_col3">
            <b>Startdatum:</b>
        </div>
        <div class="adm_col4">
            <b>Slutdatum:</b>
        </div>
    </div>
    `;

    //Call restapi to get data from work experience table
    fetch(restlink + '?type=wrk')
    .then(response => response.json())
    .then(data => {
        data.forEach(wrk => {
            //Run substring on start and end date to only show year and month.
            let tmp_startdate = wrk.startDate
            tmp_startdate = tmp_startdate.substring(0,7);
            let tmp_enddate = wrk.endDate
            tmp_enddate = tmp_enddate.substring(0,7);
            //Add fetched data to listContainer element.
            listContainer.innerHTML +=
            `<div class="rowWrapper">
                <div class="adm_col1">
                <span class="small_listheader">Arbete: </span>${wrk.employer}
                </div>
                <div class="adm_col2">
                <span class="small_listheader">Titel: </span>${wrk.title}
                </div>
                <div class="adm_col3">
                <span class="small_listheader">Start datum: </span>${tmp_startdate}
                </div>
                <div class="adm_col4">
                <span class="small_listheader">Slut datum: </span>${tmp_enddate}
                </div>
                <div class="adm_col5">
                    <button id="${wrk.id}" class="btn_del" onClick="deleteWrk(${wrk.id})">Radera</button>
                    <button id="${wrk.id}" class="btn_update" onClick="setFormWrk(${wrk.id})">Ändra</button>
                </div>
            </div>`; 
        });
    })

}

//Toggle function to view/Hide and reset add-form and rest and view the edit form.
function addNewWrkDispToggle(value) {

    //If addEdit container is showing, hide it and toggle some buttons and change test to header and change text to add new button.
    if(wrkAddEdit.style.display === "block") {
        wrkAddEdit.style.display ="none"
        wrkSubmitBtn.style.display = 'block';
        wrkEditBtn.style.display = 'none';
        addNewWrkDispBtn.innerText = "Lägg till ny erfarenhet";
        wrkFormheader.innerHTML = "Lägg till erfarenhet:";
        wrkForm.reset();
    } 
    //if addEdit is hiding, show it and change add new button's text to hide, and reset form.
    else {
        wrkAddEdit.style.display = "block";
        addNewWrkDispBtn.innerText = "Dölj";
        wrkEditBtn.style.display = 'none';
        wrkForm.reset();
    }
    //If function is called with value edit it does almost the same as the first if-state but
    //it also hides submit new button, view  submit edit and change header of the form.
    if(value === "edit") {
        wrkAddEdit.style.display = "block";
        addNewWrkDispBtn.innerText = "Dölj";
        wrkSubmitBtn.style.display = 'none';
        wrkEditBtn.style.display = 'block';
        wrkFormheader.innerHTML = "Ändra erfarenhet";
        wrkForm.reset();
    }
}

//function to create a work experience
function createWrk() {

    //Fetch data from form
    let var_wrkEmployer = wrkEmployer.value;
    let var_wrkTitle = wrkTitle.value
    let var_wrkStartDate = wrkStartDate.value;
    let var_wrkEndDate = wrkEndDate.value;

    //validate the input if anyone returns false it jump out of this function
    if(!verifyEmployer(var_wrkEmployer) || !verifyWrkTitle(var_wrkTitle) || !verifyStartDate(var_wrkStartDate) || !verifyEndDate(var_wrkEndDate)){
        return;
    }

    //concatenate fetched data to a single json variable
    let concatWrk = {'employer': var_wrkEmployer, 'title': var_wrkTitle, 'startDate': var_wrkStartDate, 'endDate': var_wrkEndDate};
    
    //call rest-api to post the data to database
    fetch(restlink + '?type=wrk', {
        method: 'POST',
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        },
        body: JSON.stringify(concatWrk),
    })
    .then(response => response.text())
    .then(data => {
        //If everything worked fine the list is reloaded and the form toggled to hide.
        getWrkexperience();
        addNewWrkDispToggle();
    })
    .catch(error => {
        console.log('Error: ', error);        
    })

}

//function to delete a specific work experience
function deleteWrk(id) {

    //alert message to check that you want to delete the selected row.
    if (confirm('Är du säker på att du vill ta bort detta?')) {
        
        //call the rest api to delete the selected row
        fetch(restlink + '?type=wrk&id=' + id, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(data => {
            //if everything is ok the list is reloaded.
            getWrkexperience();
        })
        .catch(error => {
            console.log('Error: ', error);
        })
    }
}

//function to populate the form when "Ändra" is pushed
function setFormWrk(id){

    //call toggle function to show the edit form
    addNewWrkDispToggle("edit");
    
    //hold the selected work experience id.
    idHolder = id;
    
    //fetch data for the slected row.  
    fetch(restlink + '?type=wrk&id=' + id)
    .then(response => response.json())
    .then(data => {
        data.forEach(wrk => {
            //fetched data is pushed to the form
            wrkEmployer.value = wrk.employer;
            wrkTitle.value = wrk.title;
            wrkStartDate.value = wrk.startDate;
            wrkEndDate.value = wrk.endDate;
        });
    })
}

//fucntion to update a wrk experience with new data
function updateWrk(){

    //Collect data from the form
    let var_wrkEmployer = wrkEmployer.value;
    let var_wrkTitle = wrkTitle.value
    let var_wrkStartDate = wrkStartDate.value;
    let var_wrkEndDate = wrkEndDate.value;

    //validate the input if anyone returns false it jump out of this function
    if(!verifyEmployer(var_wrkEmployer) || !verifyWrkTitle(var_wrkTitle) || !verifyStartDate(var_wrkStartDate) || ! verifyEndDate(var_wrkEndDate)){
        return;
    }

    //concatenate fetched data to a single json variable
    let concatWrk = {'employer': var_wrkEmployer, 'title': var_wrkTitle, 'startDate': var_wrkStartDate, 'endDate': var_wrkEndDate};
    
    //Call rest api to send the edited data
    fetch(restlink + '?type=wrk&id=' + idHolder, {
        method: 'PUT',
        body: JSON.stringify(concatWrk),
    })
    .then(response => response.text())
    .then(data => {
        //if everything is ok the list is reloaded and the form is toggled to hide
        getWrkexperience();
        addNewWrkDispToggle();
    })
    .catch(error => {
        console.log('Error: ', error);
    })
}

//validators

function verifyUniversity(value) {
    if(value.length === 0 || value.length > 120) {
        alert("Lärosäte kan inte vara tom eller över 120 tecken.");
        return false;
    } else {
        return true;
    }
}

function verifyCourse(value) {
    if(value.length === 0 || value.length > 50) {
        alert("Utbildning kan inte vara tom eller över 50 tecken.");
        return false;
    } else {
        return true;
    }
}

function verifyStartDate(value) {
    if(!(value.length === 10)) {
        console.log(value.length);
        alert("Start datum måste innehålla 10 tecken yyyy-mm-dd.");
        return false;
    } else {
        return true;
    }  
}

function verifyEndDate(value) {
    if(!(value.length === 10)) {
        alert("Slut datum måste innehålla 10 tecken yyyy-mm-dd.");
        return false;
    } else {
        return true;
    }  
}

function verifyTitle(value) {
    if(value.length === 0 || value.length > 50) {
        alert("Titel kan inte vara tom eller över 50 tecken.");
        return false;
    } else {
        return true;
    }
}

function verifyUrl(value) {
    if(value.length === 0 || value.length > 150) {
        alert("URL kan inte vara tom eller över 150 tecken.");
        return false;
    } else {
        return true;
    }
}

function verifyDescription(value) {
    if(value.length === 0 || value.length > 1000) {
        alert("Beskrivnignen kan inte vara tom eller över 1000 tecken.");
        return false;
    } else {
        return true;
    }  
}

function verifyEmployer(value) {
    if(value.length === 0 || value.length > 100) {
        alert("Arbetsgivare kan inte vara tom eller över 100 tecken.");
        return false;
    } else {
        return true;
    }    
}

function verifyWrkTitle(value) {
    if(value.length === 0 || value.length > 100) {
        alert("Anställningsform kan inte vara tom eller över 100 tecken.");
        return false;
    } else {
        return true;
    }    
}