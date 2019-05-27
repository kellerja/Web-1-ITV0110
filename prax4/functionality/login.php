<?php
require 'userModel.php';

if (isset($_REQUEST["username"]) && isset($_REQUEST["password"]) && $_REQUEST["username"] !== "" && $_REQUEST["password"] !== "") {
    $username = secureData($_REQUEST["username"]);
    $password = secureData($_REQUEST["password"]);

    $result = getUserData($username, $password, "*");

    if ($result && mysqli_num_rows($result) == 1) {
        $resultUser = mysqli_fetch_array($result);
        $_SESSION["username"] = $resultUser["username"];
        $_SESSION["password"] = $resultUser["password"];
        $_SESSION["image"] = $resultUser["image"];
        echo '<script type="text/javascript">window.location = "../index.php"</script>';
    } else {
        echo '<script type="text/javascript">window.location = "../login.php"</script>';
    }
}
?>
