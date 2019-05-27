<?php
session_start();

$errorCode = 0;
if (isset($_REQUEST["error"])) {
    $errorCode = $_REQUEST["error"];
}
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html'?>
    <body>
        <?php require 'fragment/menu.php' ?>
        <main id="login">
            <form method="post" action="model/users.php">
                <?php if ($errorCode == 101) {echo "<p class='error'>Entered username and password combination does not exist!</p>";} ?>
                <label for="username">Username:</label>
                <?php if ($errorCode == 102 || $errorCode == 104) {echo "<span class='error'>Username required!</span>";} ?>
                <br>
                <input id="username" type="text" name="username" autocomplete="off">
                <br>
                <label for="password">Password:</label>
                <?php if ($errorCode == 103 || $errorCode == 104) {echo "<span class='error'>Password is required!</span>";} ?>
                <br>
                <input id="password" type="password" name="password" autocomplete="off">
                <br>
                <button type="submit" name="logIn">Submit</button>
                <br>
            </form>
        </main>
    </body>
</html>
