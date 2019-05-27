<?php

$username = $_SESSION["username"];

if (isset($_REQUEST["chirp"]) && $_REQUEST["chirp"] !== "" && isset($_SESSION["username"]) && $_SESSION["username"] != "") {
    $message = secureData($_REQUEST["chirp"]);
    insertChirp($username, $message);
}

$response = getAllChirpsBy($username);

?>
<main>
    <form method="post">
        <input type="text" name="chirp" autocomplete="off" placeholder="new Chirp">
        <input type="submit">
    </form>
    <?php
    if ($response) {
        for ($i = 0; $i < mysqli_num_rows($response); $i++) {
            $result = mysqli_fetch_array($response);
            $message = $result["message"];
            $time = $result["timestamp"];
            echo "<article><header><p>$message</p></header><details><p>$time</p></details></article>";
        };
    } else {
        echo "<p>Please use the box above to make your first Chirp!</p>";
    }
    ?>
</main>
