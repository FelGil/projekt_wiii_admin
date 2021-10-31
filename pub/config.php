<?php

//Check if there is a current session, if not create one.
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

?>