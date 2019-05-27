<!DOCTYPE html>
<html lang="en">
<?php require 'fragments/head.html';?>
<link rel="stylesheet" type="text/css" href="styles/main.css">
<body>
    <?php require 'fragments/menu.php';?>
    <form method="post" action="functionality/login.php">
        <label>
            Username:
            <input type="text" name="username" autocomplete="off" placeholder="username">
        </label>
        <label>
            Password:
            <input type="password" name="password" autocomplete="off" placeholder="password">
        </label>
        <input type="submit">
    </form>
</body>
</html>
