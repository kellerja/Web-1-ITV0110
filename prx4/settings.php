<?php
session_start();

require 'model/users.php';

$errorCode = array();
if (isset($_REQUEST["error"])) {
    $errorCode = $_REQUEST["error"];
}

$result = mysqli_fetch_array(getUserInfo());
$firstName = $result["firstname"];
$lastName = $result["lastname"];
$email = $result["email"];
$image = $result["image"];
$description = $result["description"];
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html'?>
    <body>
        <?php require 'fragment/menu.php' ?>
        <?php require 'fragment/user_general_info.php' ?>
        <main>
            <form method="post" action="./model/users.php" enctype="multipart/form-data">
                <label for="firstName">First name:</label>
                <?php if (in_array(201, $errorCode)) {echo "<span class='error'>First name required!</span>";} ?>
                <br>
                <input id="firstName" type="text" autocomplete="off" name="firstName" value="<?php echo $firstName;?>">
                <br>
                <label for="lastName">Last name:</label>
                <?php if (in_array(202, $errorCode)) {echo "<span class='error'>Last name required!</span>";} ?>
                <br>
                <input id="lastName" type="text" autocomplete="off" name="lastName" value="<?php echo $lastName;?>">
                <br>
                <label for="email">Email:</label>
                <?php if (in_array(203, $errorCode)) {echo "<span class='error'>Email required!</span>";} ?>
                <br>
                <input id="email" type="text" autocomplete="off" name="email" value="<?php echo $email;?>">
                <br>
                <label for="image">Image:</label>
                <?php if (in_array(231, $errorCode)) {echo "<span class='error'>Image is too large!</span>";} ?>
                <?php if (in_array(232, $errorCode)) {echo "<span class='error'>Image caused an error!</span>";} ?>
                <?php if (in_array(233, $errorCode)) {echo "<span class='error'>Image is not in supported format!</span>";} ?>
                <?php if (in_array(234, $errorCode)) {echo "<span class='error'>Failed to save image!</span>";} ?>
                <br>
                <input id="image" type="file" name="image">
                <br>
                <label for="description">Description:</label><br>
                <textarea if="description" autocomplete="off" name="description"><?php echo $description;?></textarea>
                <br>
                <label for="newPassword">New Password:</label><br>
                <input id="newPassword" type="password" autocomplete="off" name="newPassword">
                <br>
                <label for="newPasswordCheck">New Password again:</label>
                <?php if (in_array(211, $errorCode)) {echo "<span class='error'>Does not match new password field!</span>";} ?>
                <br>
                <input id="newPasswordCheck" type="password" autocomplete="off" name="newPasswordCheck">
                <br>
                <label for="password">Old Password:</label>
                <?php if (in_array(204, $errorCode)) {echo "<span class='error'>Password required!</span>";} ?>
                <?php if (in_array(221, $errorCode)) {echo "<span class='error'>Password incorrect!</span>";} ?>
                <br>
                <input id="password" type="password" autocomplete="off" name="password">
                <br>
                <button type="submit" name="settings">Update</button>
            </form>
        </main>
    </body>
</html>
