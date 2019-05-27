<nav>
    <form method="post" action="model/users.php" id="menuForm">
        <button type="button" onclick="redirectTo('./')">Home</button>
        <?php
        if (!isset($_SESSION["username"]) || empty($_SESSION["username"])) {
            echo "<button type='button' onclick=\"redirectTo('login.php')\">Login</button>";
            echo "<button type='button' onclick=\"redirectTo('register.php')\">Register</button>";
        } else {
            echo "<button type='submit' name='logOut'>Logout</button>";
            echo "<button type='button' onclick=\"redirectTo('settings.php')\">Settings</button>";
        }
        ?>
    </form>
    <form method="get" action="search.php" id="searchForm">
        <input type="text" name="search" autocomplete="off">
        <button type="submit">Search</button>
    </form>
</nav>
