<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'database.php';

function getAllChirpsBy($user) {
    $con = connectToServer();
    $user = sanitizeData($con, $user);
    $query = "SELECT * FROM jakell_chirps WHERE username_fk='$user' ORDER BY timestamp DESC LIMIT 3;";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    return $result;
}

function createNewChirp($message) {
    if (!isset($_SESSION["username"])) {
        header("Location: login.php");
        die();
    }
    $con = connectToServer();
    $message = sanitizeData($con, $message);
    $user = $_SESSION["username"];
    $query = "INSERT INTO jakell_chirps (username_fk, message) VALUES ('$user', '$message');";
    mysqli_query($con, $query);
    disconnectFromServer($con);
    header("Location: ../");
}

function getAllChirpsFor() {
    if (!isset($_SESSION["username"])) {
        header("Location: login.php");
        die();
    }
    $con = connectToServer();
    $user = $_SESSION["username"];
    $query = "SELECT jakell_chirps.username_fk, jakell_chirps.message, jakell_chirps.timestamp, jakell_users.image FROM jakell_chirps INNER JOIN jakell_users ON jakell_users.username=jakell_chirps.username_fk WHERE jakell_chirps.username_fk 
    IN (SELECT jakell_stalkings.stalked FROM jakell_stalkings WHERE jakell_stalkings.stalker='$user') ORDER BY timestamp DESC LIMIT 25;";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    return $result;
}

if (isset($_REQUEST["newChirp"]) && isset($_REQUEST["message"]) && !empty($_REQUEST["message"])) {
    createNewChirp($_REQUEST["message"]);
}
?>
