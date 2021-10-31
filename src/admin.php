<?php
include_once("config.php");

//checks that the user is propperly logged on
if(!isset($_SESSION['userid'])) {
    header("location: login.php?message=Du måste vara inloggad!");
}
?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/sass.css">
    <title>Portfolio - Adminpage</title>
</head>
<body>
<header><h1>Portfolio - Adminpage</h1></header>
<!-- links to each category to manage -->
<nav>
    <ul>
        <li><a href="#" id="edu_link">Utbildningar</a></li>
        <li><a href="#" id="pof_link">Webbplatser</a></li>
        <li><a href="#" id="wrk_link">Erfarenhet</a></li>
    </ul>
</nav>

    <div class="admin_container">
        <!-- Add new buttons to toggle the input/edit form-->
        <div id="addBtn_container">
            <button id="addNewEduDispBtn" class="addNewBtn">Lägg till ny utbildning</button>
            <button id="addNewPofDispBtn" class="addNewBtn">Lägg till ny webbplats</button>
            <button id="addNewWrkDispBtn" class="addNewBtn">Lägg till ny erfarenhet</button>
        </div>
        <!-- containter for errors return by REST API -->
        <div id="error_container">
        </div>
        <div id="addedit_containter">
            <!-- Container with form for add/edit of Education -->
            <div id="eduAddEdit">
                <h2 id="eduFormheader">Lägg till utbildning:</h2>
                <form id="eduForm">
                    <label for="university">Lärosäte:</label>
                    <br>
                    <input type="text" name="university" id="eduUniversity">
                    <br>
                    <label for="course">Utbildnign:</label>
                    <br>
                    <input type="text" name="course" id="eduCourse">
                    <br>
                    <label for="startdate">Start datum:</label>
                    <br>
                    <input type="text" name="startDate" id="eduStartDate" placeholder="yyyy-mm-dd">
                    <br>
                    <label for="endDate">Slut datum:</label>
                    <br>
                    <input type="text" name="endDate" id="eduEndDate" placeholder="yyyy-mm-dd">
                </form>
                <button class="btn_add_submit" id="eduSubmitBtn">Lägg till utbildning</button>
                <button class="btn_update_submit" id="eduEditBtn">Ändra utbildning</button>
            </div>
            <!-- Container with form for add/edit of Portfolio -->
            <div id="pofAddEdit">
                <h2 id="pofFormheader">Lägg till webbplats:</h2>
                <form id="pofForm">
                    <label for="title">Hemsida:</label>
                    <br>
                    <input type="text" name="title" id="pofTitle">
                    <br>
                    <label for="url">URL:</label>
                    <br>
                    <input type="text" name="url" id="pofURL">
                    <br>
                    <label for="description">Beskrivning:</label>
                    <br>
                    <input type="text" name="description" id="pofDescription">
                </form>
                <button class="btn_add_submit" id="pofSubmitBtn">Lägg till webbplats</button>
                <button class="btn_update_submit" id="pofEditBtn">Ändra webbplats</button>
            </div>
            <!-- Container with form for add/edit of Work Experience -->
            <div id="wrkAddEdit">
                <h2 id="wrkFormheader">Lägg till erfarenhet:</h2>
                <form id="wrkForm">
                    <label for="employer">Arebetsgivare:</label>
                    <br>
                    <input type="text" name="employer" id="wrkEmployer">
                    <br>
                    <label for="title">Title:</label>
                    <br>
                    <input type="text" name="title" id="wrkTitle">
                    <br>
                    <label for="startdate">Start datum:</label>
                    <br>
                    <input type="text" name="startDate" id="wrkStartDate" placeholder="yyyy-mm-dd">
                    <br>
                    <label for="endDate">Slut datum:</label>
                    <br>
                    <input type="text" name="endDate" id="wrkEndDate" placeholder="yyyy-mm-dd">
                </form>
                <button class="btn_add_submit" id="wrkSubmitBtn">Lägg till erfarenhet</button>
                <button class="btn_update_submit" id="wrkEditBtn">Ändra erfarenhet</button>
            </div>
        </div>
        <div id="admin_list_container">
            <!-- Container to hold the selected list -->
        </div>

    </div>

<br><br>
<a href="logout.php" class="logoutBtn">Logga ut</a>
</body>
<script src="js/admin_main.js"></script>
</html>