<?php
session_start();
require 'model/chirps.php';
require 'model/users.php';
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html'?>
    <body>
        <?php require 'fragment/menu.php' ?>
        <?php require 'fragment/user_general_info.php' ?>
        <?php
        $button = "";
        if (!empty($_SESSION["username"]) && isset($_REQUEST["user"]) && $_SESSION["username"] != $_REQUEST["user"]) {
            $profile_name = $_REQUEST["user"];
            $search = "../profile.php?user=" . $profile_name;
            if (isStalking($_SESSION["username"], $profile_name)) {
                $button = "<form method='post' action='model/users.php'><button type='submit' name='unstalk' value=".$profile_name.">UnStalk</button><input type='hidden' name='url' value='$search'></form>";
            } else {
                $button = "<form method='post' action='model/users.php'><button type='submit' name='stalk' value=".$profile_name.">Stalk</button><input type='hidden' name='url' value='$search'></form>";
            }
        }
        if (isset($_REQUEST["user"])) {
            $userData = getUserInfo($_REQUEST["user"]);
            $message = $_REQUEST["user"] != $_SESSION["username"] ? $_REQUEST["user"] . '\'s chirps' : "My chirps";
        } else {
            $userData = getUserInfo();
            $message = "My chirps";
        }
        $userData = mysqli_fetch_array($userData);
        echo '<main><article><img class="profilePicture" src="images/uploads/'.$userData["image"].'"><label><p>'.$userData["username"].'</p></label><p>'.$userData["description"].'</p>'.$button.'<details>'.$userData["reg_date"].'</details></article></main>';
        ?>
        <main>
            <?php
            echo '<h1>' . $message . '</h1>';
            if (isset($_REQUEST["user"])) {
                $myChirps = getAllChirpsBy($_REQUEST["user"]);
            } else if (isset($_SESSION["username"])) {
                $myChirps = getAllChirpsBy($_SESSION["username"]);
            } else {
                $myChirps = "";
            }
            while ($row = mysqli_fetch_array($myChirps)) {
                echo "<article><label>"
                    .$row["username_fk"]."</label><div class='separator'></div><p>"
                    .$row["message"]."</p><details>"
                    .$row["timestamp"]."</details></article>";
            }
            ?>
        </main>
    </body>
</html>
