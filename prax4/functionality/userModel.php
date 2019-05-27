<?php
require 'database.php';

function isAuthenticatedUser() {
}

function getUserData($user, $password, $data) {
    $con = connectToDatabase();
    $query = "SELECT $data FROM jakell_users WHERE username = '$user' AND password='$password'";
    $result = mysqli_query($con, $query);
    closeConnection($con);
    return $result;
}

function insertUserData($user, $columns, $data) {
    $con = connectToDatabase();
    $query = "INSERT INTO ";
    mysqli_query($con, $query);
}

?>