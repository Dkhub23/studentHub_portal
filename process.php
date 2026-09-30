<?php

// ==========================================
// 1. CHECK REQUEST METHOD
// ==========================================

if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    http_response_code(405);

    die("Invalid request method.");

}


// ==========================================
// 2. GET FORM DATA
// ==========================================

$name = trim($_POST["name"] ?? "");

$email = trim($_POST["email"] ?? "");

$mobile = trim($_POST["mobile"] ?? "");

$subject = trim($_POST["subject"] ?? "");

$message = trim($_POST["message"] ?? "");


// ==========================================
// 3. SANITIZATION
// ==========================================

$name = htmlspecialchars(
    $name,
    ENT_QUOTES,
    "UTF-8"
);

$email = htmlspecialchars(
    $email,
    ENT_QUOTES,
    "UTF-8"
);

$mobile = htmlspecialchars(
    $mobile,
    ENT_QUOTES,
    "UTF-8"
);

$subject = htmlspecialchars(
    $subject,
    ENT_QUOTES,
    "UTF-8"
);

$message = htmlspecialchars(
    $message,
    ENT_QUOTES,
    "UTF-8"
);


// ==========================================
// 4. VALIDATION
// ==========================================

$errors = [];


// Name validation

if ($name === "") {

    $errors[] =
        "Name is required.";

}
elseif (strlen($name) < 2) {

    $errors[] =
        "Name must contain at least 2 characters.";

}


// Email validation

if ($email === "") {

    $errors[] =
        "Email is required.";

}
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {

    $errors[] =
        "Please enter a valid email address.";

}


// Mobile validation

if (
    $mobile !== "" &&
    !preg_match(
        '/^[0-9+()\-\s]{8,15}$/',
        $mobile
    )
) {

    $errors[] =
        "Please enter a valid mobile number.";

}


// Subject validation

if ($subject === "") {

    $errors[] =
        "Subject is required.";

}


// Message validation

if ($message === "") {

    $errors[] =
        "Message is required.";

}
elseif (strlen($message) < 10) {

    $errors[] =
        "Message must contain at least 10 characters.";

}


// ==========================================
// 5. DISPLAY VALIDATION ERRORS
// ==========================================

if (!empty($errors)) {

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Form Error</title>

    <link
        rel="stylesheet"
        href="css/style.css">

</head>

<body>

<div class="container">

    <main class="main">

        <section class="card">

            <h2 style="color:#c0392b;">
                ❌ Submission Failed
            </h2>

            <p>
                Please correct the following errors:
            </p>

            <ul>

                <?php foreach ($errors as $error): ?>

                    <li>
                        <?php
                        echo htmlspecialchars(
                            $error,
                            ENT_QUOTES,
                            "UTF-8"
                        );
                        ?>
                    </li>

                <?php endforeach; ?>

            </ul>

            <br>

            <a href="contact.html">
                ← Go back to Contact Form
            </a>

        </section>

    </main>

</div>

</body>

</html>

<?php

    exit;
}


// ==========================================
// 6. CREATE DATA ARRAY
// ==========================================

$data = [

    "name" => $name,

    "email" => $email,

    "mobile" => $mobile,

    "subject" => $subject,

    "message" => $message,

    "submitted_at" =>
        date("Y-m-d H:i:s")

];


// ==========================================
// 7. JSON FILE
// ==========================================

$filePath =
    __DIR__ .
    "/contact_messages.json";


// ==========================================
// 8. READ EXISTING JSON
// ==========================================

$existingData = [];

if (file_exists($filePath)) {

    $jsonContent =
        file_get_contents($filePath);

    if ($jsonContent !== false &&
        trim($jsonContent) !== "") {

        $decoded =
            json_decode(
                $jsonContent,
                true
            );

        if (is_array($decoded)) {

            $existingData =
                $decoded;

        }

    }

}


// ==========================================
// 9. ADD NEW RECORD
// ==========================================

$existingData[] = $data;


// ==========================================
// 10. SAVE JSON
// ==========================================

$result = file_put_contents(

    $filePath,

    json_encode(
        $existingData,
        JSON_PRETTY_PRINT |
        JSON_UNESCAPED_UNICODE
    )

);


// ==========================================
// 11. CHECK FILE STORAGE
// ==========================================

if ($result === false) {

    die(
        "Unable to save your message. Please try again."
    );

}

?>

<!DOCTYPE html>

<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>Submission Successful</title>

    <link
        rel="stylesheet"
        href="css/style.css">

</head>


<body>

<div class="container">

    <main class="main">

        <section class="card">

            <h2 style="color:#087a32;">
                ✅ Submission Successful
            </h2>

            <p>
                Thank you,
                <strong>
                    <?php
                    echo htmlspecialchars(
                        $name,
                        ENT_QUOTES,
                        "UTF-8"
                    );
                    ?>
                </strong>!
            </p>

            <p>
                Your message has been
                successfully submitted.
            </p>

            <p>
                We will contact you at
                <strong>
                    <?php
                    echo htmlspecialchars(
                        $email,
                        ENT_QUOTES,
                        "UTF-8"
                    );
                    ?>
                </strong>.
            </p>

            <br>

            <a href="contact.html">
                ← Send another message
            </a>

        </section>

    </main>

</div>

</body>

</html>