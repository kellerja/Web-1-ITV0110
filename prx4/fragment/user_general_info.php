<aside>
    <img class="profilePicture" src="images/<?php echo isset($_SESSION['profile']) ? "/uploads/".$_SESSION['profile'] : "default.jpg";?>" alt="profile picture">
    <h3><?php echo isset($_SESSION["username"]) ? $_SESSION["username"] : ""; ?></h3>
    <a href="profile.php">Profile</a>
    <a href="stalkers.php">Stalkers</a>
    <a href="stalked.php">Stalked</a>
</aside>
