<?php
function connectToDatabase() {
    $con = mysqli_connect("localhost","st2014","progress","st2014");
    if (!$con) {
        die('Could not connect: ' . mysqli_connect_error());
    }
    return $con;
}

function closeConnection($con) {
    mysqli_close($con);
}

function secureData($data) {
    $con = connectToDatabase();
    $cleanData = htmlentities(mysqli_real_escape_string($con, $data));
    closeConnection($con);
    return $cleanData;
}
?>

