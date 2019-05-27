<?php
if (isset($_REQUEST["logout"])) {
    session_unset();
    session_destroy();
} else if (isset($_REQUEST["login"])) {
    echo '<script type="text/javascript">window.location = "../login.php"</script>';
}
?>

