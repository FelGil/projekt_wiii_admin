<?php
//logout function
session_start();
session_destroy();

header("Location: https://studenter.miun.se/~fegi2000/writeable/projekt_wiii/index.html");
?>