<?php
require 'database.php';

function insertChirp($user, $message) {
    $con = connectToDatabase();
    $query = "INSERT INTO jakell_chirps (username_fk, message) VALUES ('$user', '$message');";
    closeConnection($con);
    mysqli_query($con, $query);
}

function getAllChirpsBy($user) {
    $con = connectToDatabase();
    $query = "SELECT message, timestamp FROM jakell_chirps WHERE username_fk='$user' ORDER BY timestamp DESC";
    $response = mysqli_query($con,$query);
    closeConnection($con);
    return $response;
}
?>