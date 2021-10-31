<?php
//logout function
session_start();
session_destroy();

header("Location: login.php");
?>