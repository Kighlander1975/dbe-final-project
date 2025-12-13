<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Host-Anfrage abgelehnt</title>
</head>
<body>
    <h1>Deine Host-Anfrage wurde abgelehnt</h1>
    <p>Hallo {{ $hostRequest->user->name }},</p>
    <p>Leider konnten wir deine Anfrage nicht genehmigen.</p>
    <p><strong>Grund:</strong></p>
    <p>{{ $reason }}</p>
    <p><strong>Deine ursprüngliche Begründung:</strong></p>
    <p>{{ $hostRequest->text }}</p>
    <p>Mit freundlichen Grüßen,<br>Das Stechen-Helper Team</p>
</body>
</html>