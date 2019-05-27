<?php require 'model/chirps.php'; ?>
<main>
    <form method="post" action="model/chirps.php" id="newChirpForm">
        <label>
            New Chirp:
            <input type="text" name="message" autocomplete="off">
        </label>
        <button type="submit" name="newChirp">Submit</button>
    </form>
    <?php
    $chirps = getAllChirpsFor();
    while ($row = mysqli_fetch_array($chirps)) {
        echo "<article><div class='label'>
        <a class='clickableImage' href='profile.php?user=".$row["username_fk"]."'><img class='profilePictureSmall' src='images/uploads/".$row["image"]."'></a><div class='space'></div>
        <a class='clickableUser' href='profile.php?user=".$row["username_fk"]."'>".$row["username_fk"]."</a>
        </div><div class='separator'></div><p>".$row["message"]."</p><details>".$row["timestamp"]."</details></article>";
    }
    ?>
</main>
