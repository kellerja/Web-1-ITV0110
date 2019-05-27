<?php
session_start();

require 'model/users.php';
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html'?>
    <body>
        <?php require 'fragment/menu.php' ?>
        <?php require 'fragment/user_general_info.php' ?>
        <main>
            <h1>People that stalk me:</h1>
            <?php
            $stalkers = isset($_SESSION["username"]) ? getUsersWhoStalk($_SESSION["username"]) : null;
            if (empty($stalkers) || mysqli_num_rows($stalkers) == 0) {
                echo "<p>No users available</p>";
            } else {
                while ($row = mysqli_fetch_array($stalkers)) {
                    echo "<article><a class='clickableImage' href='profile.php?user=".$row["stalker"]."'><img class='profilePictureSmall' src='images/uploads/".$row["image"]."'></a><div class='space'></div><label><a href='profile.php?user=".$row["stalker"]."'>".$row["stalker"]."</a></label><div class='space'></div><details>".$row["timestamp"]."</details></article>";
                }
            }
            ?>
        </main>
    </body>
</html>
