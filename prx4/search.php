<?php
session_start();
require 'model/users.php';

if (isset($_REQUEST["search"])) {
    $search = $_REQUEST["search"];
} else {
    $search = "";
}
$result = search($search);

$search = "../search.php?search=" . $search;
?>
<!DOCTYPE html>
<html>
    <?php require 'fragment/head.html';?>
    <body>
        <?php require 'fragment/menu.php';?>
        <?php require 'fragment/user_general_info.php';?>
        <main>
            <?php
                if (mysqli_num_rows($result) == 0) {
                    echo '<h3>No users found</h3>';
                }
                while ($row = mysqli_fetch_array($result)) {
                    $button = "";
                    if (!empty($_SESSION["username"])) {
                        if (isStalking($_SESSION["username"], $row["username"])) {
                            $button = "<form method='post' action='model/users.php'><button type='submit' name='unstalk' value=".$row["username"].">UnStalk</button><input type='hidden' name='url' value='$search'></form>";
                        } else {
                            $button = "<form method='post' action='model/users.php'><button type='submit' name='stalk' value=".$row["username"].">Stalk</button><input type='hidden' name='url' value='$search'></form>";
                        }
                    }
                    $separatorForDescription = empty($row["description"]) ? "" : "<div class='separator'></div>";
                    echo '<article><a class="clickableImage" href="profile.php?user='.$row["username"].'"><img class="profilePictureSmall" src="images/uploads/'.$row["image"]. '"></a>'.
                        '<div class="space"></div><label><a href="profile.php?user='.$row["username"].'">'.$row["username"]. '</a></label><div class="separator"></div>
                        <p>'.$row["description"]. '</p>'.$separatorForDescription.'<details>'.$row["reg_date"]. '</details>'.$button.'</article>';
                }
            ?>
        </main>
    </body>
</html>
