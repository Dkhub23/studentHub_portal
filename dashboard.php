<?php
declare(strict_types=1);
require_once __DIR__ . '/includes/dashboard_bootstrap.php';

require_admin();
$admin = $_SESSION['user'];
audit_log($pdo, $admin, 'dashboard.view', ['page' => 'dashboard']);

$counts = [
    'users' => (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
    'students' => (int)$pdo->query('SELECT COUNT(*) FROM students')->fetchColumn(),
    'events' => (int)$pdo->query('SELECT COUNT(*) FROM events')->fetchColumn(),
];
$registrations = $pdo->query('SELECT enrollment_no, full_name, email, course, registered_at FROM students ORDER BY registered_at DESC, id DESC LIMIT 8')->fetchAll();
$auditLogs = $pdo->query('SELECT actor_name, actor_role, action, ip_address, created_at FROM audit_logs ORDER BY created_at DESC, id DESC LIMIT 6')->fetchAll();

function e(string $value): string { return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
?>
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin Dashboard · Student Hub</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body{background:#f4f7fb;color:#17243b}.sidebar{min-height:100vh;background:#14264a}.sidebar a{color:#dbe6ff;text-decoration:none;display:block;padding:.75rem 1rem;border-radius:.6rem}.sidebar a.active,.sidebar a:hover{background:#263e6d;color:white}.brand{font-weight:800;color:white;font-size:1.15rem}.metric{border:0;border-radius:1rem;box-shadow:0 8px 28px #14264a0d}.metric .value{font-size:2rem;font-weight:800}.table-wrap{border:0;border-radius:1rem;box-shadow:0 8px 28px #14264a0d}.muted{color:#73809a}.role{font-size:.72rem;letter-spacing:.08em}
  </style>
</head>
<body>
<div class="container-fluid"><div class="row">
  <aside class="col-md-2 col-lg-2 sidebar p-3">
    <div class="brand px-2 py-3">Student Hub</div>
    <div class="text-uppercase text-white-50 small px-3 mb-2">Administration</div>
    <?php foreach (role_menu((string)$admin['role']) as $item): ?><a class="<?= $item['active'] ? 'active' : '' ?>" href="<?= e($item['href']) ?>"><?= e($item['label']) ?></a><?php endforeach; ?>
    <hr class="border-light opacity-25"><a href="logout.php">Sign out</a>
  </aside>
  <main class="col-md-10 col-lg-10 px-4 py-4">
    <div class="d-flex justify-content-between align-items-center mb-4"><div><div class="text-uppercase small role text-primary fw-bold">Administrator</div><h1 class="h3 mb-1">Dashboard</h1><div class="muted">Welcome, <?= e((string)$admin['name']) ?>. Live database overview.</div></div><span class="badge text-bg-success rounded-pill px-3 py-2">● Secure session</span></div>
    <div class="row g-3 mb-4">
      <?php foreach (['users'=>'Total users','students'=>'Students','events'=>'Events'] as $key=>$label): ?><div class="col-sm-6 col-xl-4"><div class="card metric"><div class="card-body"><div class="muted small"><?= e($label) ?></div><div class="value"><?= number_format($counts[$key]) ?></div><div class="small text-success">Live count</div></div></div></div><?php endforeach; ?>
    </div>
    <div class="card table-wrap mb-4"><div class="card-body p-0"><div class="p-3 border-bottom"><h2 class="h5 mb-0">Latest registrations</h2><span class="muted small">Most recent student accounts</span></div><div class="table-responsive"><table class="table align-middle mb-0"><thead class="table-light"><tr><th>Student</th><th>Enrollment</th><th>Email</th><th>Course</th><th>Registered</th></tr></thead><tbody>
      <?php if (!$registrations): ?><tr><td colspan="5" class="text-center py-4 muted">No registrations found.</td></tr><?php endif; ?>
      <?php foreach ($registrations as $row): ?><tr><td class="fw-semibold"><?= e($row['full_name']) ?></td><td><?= e($row['enrollment_no']) ?></td><td><?= e($row['email']) ?></td><td><?= e($row['course']) ?></td><td><?= e(date('d M Y, H:i', strtotime($row['registered_at']))) ?></td></tr><?php endforeach; ?>
    </tbody></table></div></div></div>
    <div class="card table-wrap"><div class="card-body p-0"><div class="p-3 border-bottom"><h2 class="h5 mb-0">Recent admin audit activity</h2><span class="muted small">Security events recorded in audit_logs</span></div><div class="table-responsive"><table class="table align-middle mb-0"><thead class="table-light"><tr><th>Administrator</th><th>Role</th><th>Action</th><th>IP address</th><th>Time</th></tr></thead><tbody><?php if (!$auditLogs): ?><tr><td colspan="5" class="text-center py-4 muted">No audit events yet.</td></tr><?php endif; ?><?php foreach ($auditLogs as $log): ?><tr><td><?= e($log['actor_name']) ?></td><td><span class="badge text-bg-primary"><?= e($log['actor_role']) ?></span></td><td><code><?= e($log['action']) ?></code></td><td><?= e($log['ip_address'] ?? '—') ?></td><td><?= e(date('d M Y, H:i:s', strtotime($log['created_at']))) ?></td></tr><?php endforeach; ?></tbody></table></div></div></div>
  </main>
</div></div>
</body></html>
