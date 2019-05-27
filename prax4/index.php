<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
?>
<!DOCTYPE html>
<html lang="en">
<?php require 'fragments/head.html';?>
<link rel="stylesheet" type="text/css" href="styles/main.css">
<body>
    <?php require 'fragments/menu.php';?>
    <?php require 'fragments/user.php';?>
    <?php require 'fragments/chirps.php';?>
</body>
</html>
