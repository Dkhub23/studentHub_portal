<?php
http_response_code(403);
$role = htmlspecialchars((string)($_SESSION['user']['role'] ?? 'guest'), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>403 · Access denied</title><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"></head><body class="bg-light"><main class="container min-vh-100 d-flex align-items-center justify-content-center"><div class="text-center bg-white shadow-sm rounded-4 p-5"><div class="display-1 fw-bold text-danger">403</div><h1 class="h3">Access denied</h1><p class="text-secondary">This administrator page is restricted to admin accounts. Current role: <strong><?= $role ?></strong>.</p><a href="index.html" class="btn btn-primary">Return to Student Hub</a></div></main></body></html>
