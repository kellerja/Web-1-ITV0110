<?php
function connectToServer() {
    $con = mysqli_connect("localhost", "st2014", "progress", "st2014");
    if (!$con) {
        die('could not connect: ' . mysqli_error($con));
    }
    return $con;
}
function disconnectFromServer($con) {
    mysqli_close($con);
}

function sanitizeData($con, $data) {
    return htmlentities(mysqli_escape_string($con, $data));
}
?>
