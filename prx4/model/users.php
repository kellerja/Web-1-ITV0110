<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once 'database.php';

function logIn($username, $password) {
    $con = connectToServer();
    $username = sanitizeData($con, $username);
    $password = sanitizeData($con, $password);
    $query = "SELECT * FROM jakell_users WHERE username='$username' AND password='$password';";
    $result = mysqli_query($con, $query);
    if (mysqli_num_rows($result) === 0) {
        disconnectFromServer($con);
        header("Location: ../login.php?error=101");
        die();
    }
    $_SESSION['username'] = $username;
    $_SESSION['profile'] = mysqli_fetch_array($result)["image"];
    disconnectFromServer($con);
    header("Location: ../index.php");
}

function logOut() {
    session_unset();
    session_destroy();
    header("Location: ../index.php");
}

function getUsersWhoStalk($user) {
    $con = connectToServer();
    $user = sanitizeData($con, $user);
    $query = "SELECT * FROM jakell_stalkings INNER JOIN jakell_users ON jakell_stalkings.stalker=jakell_users.username WHERE jakell_stalkings.stalked='$user' AND jakell_stalkings.stalker!='$user' ORDER BY jakell_stalkings.timestamp DESC;";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    return $result;
}

function getUsersStalkedBy($user) {
    $con = connectToServer();
    $user = sanitizeData($con, $user);
    $query = "SELECT * FROM jakell_stalkings INNER JOIN jakell_users ON jakell_stalkings.stalked=jakell_users.username WHERE jakell_stalkings.stalker='$user' AND jakell_stalkings.stalked!='$user' ORDER BY timestamp DESC;";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    return $result;
}

function registerUser() {
    if (!(isset($_REQUEST["username"]) && isset($_REQUEST["password"])
    && isset($_REQUEST["passwordCheck"]) && isset($_REQUEST["email"])
    && isset($_REQUEST["firstName"]) && isset($_REQUEST["lastName"]))) {
        header("Location: ../register.php?error[]=301");
        die();
    }
    $con = connectToServer();
    $username = sanitizeData($con, $_REQUEST["username"]);
    $password = sanitizeData($con, $_REQUEST["password"]);
    $email = sanitizeData($con, $_REQUEST["email"]);
    $firstName = sanitizeData($con, $_REQUEST["firstName"]);
    $lastName = sanitizeData($con, $_REQUEST["lastName"]);
    if (empty($username) || empty($password) || empty($email)
        || empty($firstName) || empty($lastName) || empty($_REQUEST["passwordCheck"])
        || $_REQUEST["password"] != $_REQUEST["passwordCheck"]) {
        $error = "?";
        if (empty($username)) {
            $error .= "error[]=302";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($password)) {
            $error .= "error[]=303";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($email)) {
            $error .= "error[]=304";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($firstName)) {
            $error .= "error[]=305";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($lastName)) {
            $error .= "error[]=306";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if ($password != $_REQUEST["passwordCheck"]) {
            $error .= "error[]=311";
        }
        header("Location: ../register.php" . $error);
        die();
    }
    $query = "SELECT * FROM jakell_users WHERE username='$username';";
    $result = mysqli_query($con, $query);
    if (mysqli_num_rows($result) != 0) {
        disconnectFromServer($con);
        header("Location: ../register.php?error[]=321");
        die();
    }
    $query = "INSERT INTO jakell_users (username, firstname, lastname, password, email) VALUES ('$username', '$firstName', '$lastName', '$password', '$email')";
    mysqli_query($con, $query);
    $query = "INSERT INTO jakell_stalkings (stalker, stalked) VALUES ('$username', '$username');";
    mysqli_query($con, $query);
    disconnectFromServer($con);
    logIn($username, $password);
}

function getUserInfo($user="") {
    if (!isset($_SESSION["username"])) {
        header("Location: login.php");
        die();
    }
    $con = connectToServer();
    if ($user == "") {
        $user = $_SESSION["username"];
    } else {
        $user = sanitizeData($con, $user);
    }
    $query = "SELECT * FROM jakell_users WHERE username='$user';";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    return $result;
}

function updateSettings() {
    if (!isset($_SESSION["username"])) {
        header("Location: ../login.php");
        die();
    }
    $con = connectToServer();
    $firstName = sanitizeData($con, $_REQUEST["firstName"]);
    $lastName = sanitizeData($con, $_REQUEST["lastName"]);
    $email = sanitizeData($con, $_REQUEST["email"]);
    $image = $_FILES["image"];
    $description = sanitizeData($con, $_REQUEST["description"]);
    $newPassword = sanitizeData($con, $_REQUEST["newPassword"]);
    $newPasswordCheck = sanitizeData($con, $_REQUEST["newPasswordCheck"]);
    $password = sanitizeData($con, $_REQUEST["password"]);

    $user = $_SESSION["username"];

    if (empty($firstName) || empty($lastName) || empty($email) || empty($password)) {
        disconnectFromServer($con);
        $error = "?";
        if (empty($firstName)) {
            $error .= "error[]=201";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($lastName)) {
            $error .= "error[]=202";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($email)) {
            $error .= "error[]=203";
        }
        if (strlen($error) != 1) {
            $error .= "&";
        }
        if (empty($password)) {
            $error .= "error[]=204";
        }
        header("Location: ../settings.php" . $error);
        die();
    }
    $query = "UPDATE jakell_users SET firstname='$firstName', lastname='$lastName', email='$email'";
    if (!empty($image) && !empty($image["name"]) && $image["size"] > 0) {
        $target_dir = "../images/uploads/";
        $target_file = $target_dir . basename($image["name"]);
        $imageFileType = pathinfo($target_file,PATHINFO_EXTENSION);
        $saved_file = $target_dir . $user . "." . $imageFileType;
        if (empty(getimagesize($image["tmp_name"]))) {
            disconnectFromServer($con);
            header("Location: ../settings.php?error[]=232");
            die();
        }
        if ($image["size"] > 5000000) {
            header("Location: ../settings.php?error[]=231");
            die();
        }
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
            && $imageFileType != "gif" ) {
            header("Location: ../settings.php?error[]=233");
            die();
        }
        $query .= ", image='". $user . "." . $imageFileType ."'";
    }
    if (!empty($description)) {
        $query .= ", description='$description'";
    }
    if (!empty($newPassword) && !empty($newPasswordCheck) && $newPassword == $newPasswordCheck) {
        $query .= ", password='$newPassword'";
    } else if (!empty($newPassword) && !empty($newPasswordCheck) && $newPassword != $newPasswordCheck) {
        disconnectFromServer($con);
        header("Location: ../settings.php?error[]=211");
        die();
    }
    $query .= " WHERE username='$user' AND password='$password';";
    if(!empty($image) && !empty($image["name"]) && $image["size"] > 0 && !move_uploaded_file($image["tmp_name"], $saved_file)) {
        header("Location: ../settings.php?error[]=234");
        die();
    } else if (!empty($image) && !empty($image["name"]) && $image["size"] > 0) {
        $_SESSION["profile"] = $user . "." . $imageFileType;
    }
    mysqli_query($con, $query);
    disconnectFromServer($con);
    header("Location: ../settings.php");
}

function search($search) {
    $con = connectToServer();
    $search = sanitizeData($con, $search);
    $query = "SELECT * FROM jakell_users WHERE username='$search';";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    return $result;
}

function isStalking($user, $target) {
    $con = connectToServer();
    $user = sanitizeData($con, $user);
    $target = sanitizeData($con, $target);
    $query = "SELECT * FROM jakell_stalkings WHERE stalker='$user' AND stalked='$target'";
    $result = mysqli_query($con, $query);
    disconnectFromServer($con);
    if (mysqli_num_rows($result) == 0) {
        return false;
    } else {
        return true;
    }
}

function stalk() {
    if (!isset($_SESSION["username"])) {
        header("Location: ../login.php");
        die();
    }
    $con = connectToServer();
    $user = $_SESSION["username"];
    $target = sanitizeData($con, $_REQUEST["stalk"]);
    $query = "INSERT INTO jakell_stalkings (stalker, stalked) VALUES ('$user', '$target');";
    mysqli_query($con, $query);
    disconnectFromServer($con);
    $url = $_REQUEST["url"];
    header("Location: $url");
}

function unStalk() {
    if (!isset($_SESSION["username"])) {
        header("Location: ../login.php");
        die();
    }
    $con = connectToServer();
    $user = $_SESSION["username"];
    $target = sanitizeData($con, $_REQUEST["unstalk"]);
    $query = "DELETE FROM jakell_stalkings WHERE stalker='$user' AND stalked='$target';";
    mysqli_query($con, $query);
    disconnectFromServer($con);
    $url = $_REQUEST["url"];
    header("Location: $url");
}

if(isset($_REQUEST["logIn"])) {
    if (isset($_REQUEST["username"]) && isset($_REQUEST["password"])
    && !empty($_REQUEST["username"]) && !empty($_REQUEST["password"])) {
        logIn($_REQUEST["username"], $_REQUEST["password"]);
    } else {
        if ((!isset($_REQUEST["username"]) || empty($_REQUEST["username"]))
            && (!isset($_REQUEST["password"]) ||  empty($_REQUEST["password"]))) {
            header("Location: ../login.php?error=104");
        } else if (!isset($_REQUEST["username"]) || empty($_REQUEST["username"])) {
            header("Location: ../login.php?error=102");
        } else {
            header("Location: ../login.php?error=103");
        }
    }
} else if (isset($_REQUEST["logOut"])) {
    logOut();
} else if (isset($_REQUEST["register"])) {
    registerUser();
} else if (isset($_REQUEST["settings"])) {
    updateSettings();
} else if (isset($_REQUEST["stalk"])) {
    stalk();
} else if (isset($_REQUEST["unstalk"])) {
    unStalk();
}
?>
