<?php
session_start();

$errorCode = array();
if (isset($_REQUEST["error"])) {
    $errorCode = $_REQUEST["error"];
}
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html' ?>
    <body>
        <?php require 'fragment/menu.php' ?>
        <main id="login">
            <?php if (in_array(301, $errorCode)) {echo "<p1 class='error'>Something went wrong!</p1>";} ?>
            <form method="post" action="model/users.php">
                <label for="username">Username:</label>
                <?php if (in_array(302, $errorCode)) {echo "<span class='error'>Username required!</span>";} ?>
                <?php if (in_array(321, $errorCode)) {echo "<span class='error'>Username in use!</span>";} ?>
                <br>
                <input id="username" type="text" autocomplete="off" name="username">
                <br>
                <label for="password">Password:</label>
                <?php if (in_array(303, $errorCode)) {echo "<span class='error'>Password required!</span>";} ?>
                <br>
                <input id="password" type="password" autocomplete="off" name="password">
                <br>
                <label for="passwordCheck">Password again:</label>
                <?php if (in_array(311, $errorCode)) {echo "<span class='error'>Did not match password field!</span>";} ?>
                <br>
                <input id="passwordCheck" type="password" autocomplete="off" name="passwordCheck">
                <br>
                <label for="email">Email:</label>
                <?php if (in_array(304, $errorCode)) {echo "<span class='error'>Email required!</span>";} ?>
                <br>
                <input id="email" type="text" autocomplete="off" name="email">
                <br>
                <label for="firstName">First name:</label>
                <?php if (in_array(305, $errorCode)) {echo "<span class='error'>First name required!</span>";} ?>
                <br>
                <input id="firstName" type="text" autocomplete="off" name="firstName">
                <br>
                <label for="lastName">Last name:</label>
                <?php if (in_array(306, $errorCode)) {echo "<span class='error'>Last name required!</span>";} ?>
                <br>
                <input id="lastName" type="text" autocomplete="off" name="lastName">
                <br>
                <button type="submit" name="register">Submit</button>
            </form>
        </main>
    </body>
</html>
