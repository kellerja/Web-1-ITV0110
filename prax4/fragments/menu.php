<nav>
    <form method="post" action="../functionality/menu.php">
        <button value="home">Home</button>
        <?php
        if (isset($_SESSION["username"]) && $_SESSION["username"] !== "") {
            echo "<button name='logout'>Logout</button>";
        } else {
            echo "<button name='login'>Login</button><button name='register'>Register</button>";
        }
        ?>
    </form>
</nav>
