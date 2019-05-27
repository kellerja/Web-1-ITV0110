<?php
session_start();

require 'model/users.php';
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html' ?>
    <body>
        <?php require 'fragment/menu.php' ?>
        <?php require 'fragment/user_general_info.php' ?>
        <main>
            <h1>People you stalk: </h1>
            <?php
            $stalked = isset($_SESSION["username"]) ? getUsersStalkedBy($_SESSION["username"]) : null;
            if (empty($stalked) || mysqli_num_rows($stalked) == 0) {
                echo "<p>No users available.</p>";
            } else {
                while ($row = mysqli_fetch_array($stalked)) {
                    $button = "";
                    $search = "../stalked.php";
                    if (!empty($_SESSION["username"])) {
                        if (isStalking($_SESSION["username"], $row["username"])) {
                            $button = "<form method='post' action='model/users.php'><button type='submit' name='unstalk' value=".$row["username"].">UnStalk</button><input type='hidden' name='url' value='$search'></form>";
                        } else {
                            $button = "<form method='post' action='model/users.php'><button type='submit' name='stalk' value=".$row["username"].">Stalk</button><input type='hidden' name='url' value='$search'></form>";
                        }
                    }
                    echo "<article><a class='clickableImage' href='profile.php?user=".$row["stalked"]."'><img class='profilePictureSmall' src='images/uploads/".$row["image"]."'></a><div class='space'></div><label><a href='profile.php?user=".$row["stalker"]."'>".$row["stalked"]."</a></label><div class='space'></div>".$button."<details>".$row["timestamp"]."</details></article>";
                }
            }
            ?>
        </main>
    </body>
</html>
