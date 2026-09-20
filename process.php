<?php
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    die("Invalid request method.");
}

$name = trim($_POST["name"] ?? "");
$email = trim($_POST["email"] ?? "");
$mobile = trim($_POST["mobile"] ?? "");
$subject = trim($_POST["subject"] ?? "");
$message = trim($_POST["message"] ?? "");

$errors = [];

if ($name === "") {
    $errors[] = "Name is required.";
} elseif (strlen($name) < 2) {
    $errors[] = "Name must contain at least 2 characters.";
}

if ($email === "" || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = "Please enter a valid email address.";
}

if ($mobile !== "" && !preg_match('/^[0-9+()\-\s]{8,15}$/', $mobile)) {
    $errors[] = "Please enter a valid mobile number.";
}

if ($subject === "") {
    $errors[] = "Subject is required.";
}

if ($message === "") {
    $errors[] = "Message is required.";
} elseif (strlen($message) < 10) {
    $errors[] = "Message must contain at least 10 characters.";
}

if (!empty($errors)) {
    echo "<!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Form Error</title>
        <link rel='stylesheet' href='css/style.css'>
        <style>
            body { font-family: Arial, sans-serif; background: #f2f7ff; padding: 30px; }
            .error-box { max-width: 600px; margin: 50px auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .error-box h2 { color: #c0392b; }
            ul { color: #333; }
            a { color: #1d4ed8; }
        </style>
    </head>
    <body>
        <div class='error-box'>
            <h2>Something went wrong</h2>
            <ul>
                " . implode("<li>" . "</li>", array_map(fn($error) => "<li>$error</li>", $errors)) . "
            </ul>
            <p><a href='contact.html'>Go back to contact form</a></p>
        </div>
    </body>
    </html>";
    exit;
}

$data = [
    'name' => $name,
    'email' => $email,
    'mobile' => $mobile,
    'subject' => $subject,
    'message' => $message,
    'created_at' => date('Y-m-d H:i:s')
];

$filePath = __DIR__ . '/contact_messages.txt';
$file = fopen($filePath, 'a');
if ($file === false) {
    die("Unable to save the message right now. Please try again later.");
}

fwrite($file, json_encode($data, JSON_PRETTY_PRINT) . PHP_EOL);
fflush($file);
fclose($file);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Sent</title>
    <link rel="stylesheet" href="css/style.css">
    <style>
        body { font-family: Arial, sans-serif; background: #f2f7ff; padding: 30px; }
        .success-box { max-width: 600px; margin: 50px auto; background: white; padding: 25px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .success-box h2 { color: #0b7a39; }
        a { color: #1d4ed8; }
    </style>
</head>
<body>
    <div class="success-box">
        <h2>Thank you, <?php echo htmlspecialchars($name); ?>!</h2>
        <p>Your message has been submitted successfully.</p>
        <p>We will contact you at <b><?php echo htmlspecialchars($email); ?></b> soon.</p>
        <p><a href="contact.html">Send another message</a></p>
    </div>
</body>
</html>