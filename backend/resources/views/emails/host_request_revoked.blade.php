<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Host-Rolle zurückgenommen</title>
</head>
<body>
    <h1>Deine Host-Rolle wurde zurückgenommen</h1>
    <p>Hallo {{ $hostRequest->user->name }},</p>
    <p>Deine Host-Rolle wurde zurückgenommen. Du bist wieder ein normaler Spieler.</p>
    <p><strong>Grund:</strong></p>
    <p>{{ $reason }}</p>
    <p>Mit freundlichen Grüßen,<br>Das Stechen-Helper Team</p>
</body>
</html>