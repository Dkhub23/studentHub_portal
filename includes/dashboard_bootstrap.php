<?php
declare(strict_types=1);
if (session_status() !== PHP_SESSION_ACTIVE) {
    session_set_cookie_params(['httponly' => true, 'secure' => !empty($_SERVER['HTTPS']), 'samesite' => 'Lax']);
    session_start();
}
$host = getenv('STUDENTHUB_DB_HOST') ?: '127.0.0.1';
$dbname = getenv('STUDENTHUB_DB_NAME') ?: 'studenthub';
$dbUser = getenv('STUDENTHUB_DB_USER') ?: 'root';
$dbPass = getenv('STUDENTHUB_DB_PASS') ?: '';
$pdo = new PDO("mysql:host={$host};dbname={$dbname};charset=utf8mb4", $dbUser, $dbPass, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

function require_admin(): void {
    if (empty($_SESSION['user']) || !is_array($_SESSION['user'])) {
        http_response_code(401);
        header('Location: login.html?required=1');
        exit;
    }
    if (($_SESSION['user']['role'] ?? '') !== 'admin') {
        require __DIR__ . '/../403.php';
        exit;
    }
}

function role_menu(string $role): array {
    $menus = [
        'admin' => [['label'=>'Overview','href'=>'dashboard.php','active'=>true],['label'=>'Students','href'=>'students.php','active'=>false],['label'=>'Events','href'=>'#events','active'=>false],['label'=>'Audit log','href'=>'#audit','active'=>false]],
        'faculty' => [['label'=>'Faculty home','href'=>'faculty.html','active'=>false],['label'=>'Courses','href'=>'courses.html','active'=>false]],
        'student' => [['label'=>'Student home','href'=>'student.html','active'=>false],['label'=>'Courses','href'=>'courses.html','active'=>false],['label'=>'Attendance','href'=>'attendance.html','active'=>false]],
    ];
    return $menus[$role] ?? [['label'=>'Home','href'=>'index.html','active'=>false]];
}

function audit_log(PDO $pdo, array $actor, string $action, array $details = []): void {
    $stmt = $pdo->prepare('INSERT INTO audit_logs (user_id, actor_name, actor_role, action, details, ip_address) VALUES (:user_id, :actor_name, :actor_role, :action, :details, :ip)');
    $stmt->execute([
        ':user_id' => $actor['id'] ?? null,
        ':actor_name' => $actor['name'] ?? 'Unknown',
        ':actor_role' => $actor['role'] ?? 'unknown',
        ':action' => $action,
        ':details' => json_encode($details, JSON_THROW_ON_ERROR),
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? null,
    ]);
}
