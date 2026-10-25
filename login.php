<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/dashboard_bootstrap.php';
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_var(trim((string)($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
    $password = (string)($_POST['password'] ?? '');
    $stmt = $pdo->prepare('SELECT id, full_name, email, password_hash, role FROM users WHERE email = :email LIMIT 1');
    $stmt->execute([':email' => $email ?: '']);
    $user = $stmt->fetch();
    if ($user && password_verify($password, $user['password_hash'])) {
        session_regenerate_id(true);
        $_SESSION['user'] = ['id' => (int)$user['id'], 'name' => $user['full_name'], 'email' => $user['email'], 'role' => $user['role']];
        audit_log($pdo, $_SESSION['user'], 'auth.login', ['result' => 'success']);
        header('Location: ' . ($user['role'] === 'admin' ? 'dashboard.php' : '403.php'));
        exit;
    }
    $error = 'Invalid email or password.';
}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Sign in · Student Hub</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"></head><body class="bg-light"><main class="container min-vh-100 d-flex align-items-center justify-content-center"><div class="card shadow-sm border-0 rounded-4" style="max-width:430px;width:100%"><div class="card-body p-4 p-md-5"><h1 class="h3">Student Hub sign in</h1><p class="text-secondary">Use your registered account.</p><?php if ($error): ?><div class="alert alert-danger"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?><form method="post"><div class="mb-3"><label class="form-label" for="email">Email</label><input class="form-control" id="email" name="email" type="email" required autocomplete="username"></div><div class="mb-4"><label class="form-label" for="password">Password</label><input class="form-control" id="password" name="password" type="password" required autocomplete="current-password"></div><button class="btn btn-primary w-100">Sign in</button></form><div class="small text-secondary mt-3">Sample admin: admin@charusat.edu.in · admin123</div></div></div></main></body></html>
