<?php
//import config file to load database and classes
include_once("config.php");

//import the file that holds the login credentials
$credfile = "credentials.txt";
$contents = file_get_contents($credfile);
$contents = explode("\n", $contents);

?>

<!DOCTYPE html>
<html lang="sv">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/sass.css">
    <title>Portfolio - Admin sida</title>
</head>
<body>

<header><h1>Portfolio admin</h1></header>
    <div class="container">
        <!--form for login-->
        <section class="loginwrapper">
        <h2>Logga in här:</h2>
        <!-- Containter to view if login failed, if not it forwards you to admin.php -->
        <div class="errormessage">
        <?php
        //function for checking if the userid insert int he post and check password and then login
        if(isset($_POST['userid'])) {
            foreach($contents as $values){
                $loginInfo = explode(":", $values);
                $user = $loginInfo[0];
                $password = $loginInfo[1];
                //$password == $_POST['password']
                if($user == $_POST['userid'] && $password == $_POST['password']){
                    
                        header("Location: admin.php");
                        $_SESSION['userid'] = $user;
                }
                else{
                        echo "Fel användarnamn eller lösenord";
                }
            }
        }

        ?>
        </div>  
        <!-- loginform -->
        <form method="post" action="login.php">
                <p>Användarnamn:</p>
                <input type="text" name="userid" id="userid"><br>
                <p>Lösenord:</p>
                <input type="password" name="password" id="password"><br><br>

                <input type="submit" class="loginBtn" value="Logga in">
            </form>
        </section>
    </div>
</body>
</html>