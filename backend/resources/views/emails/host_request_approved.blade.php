<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Host-Anfrage genehmigt</title>
</head>
<body>
    <h1>Herzlichen Glückwunsch! Du bist jetzt Host</h1>
    <p>Hallo {{ $hostRequest->user->name }},</p>
    <p>Deine Anfrage wurde genehmigt. Du kannst jetzt eigene Spiele erstellen und hosten.</p>
    <p><strong>Deine ursprüngliche Begründung:</strong></p>
    <p>{{ $hostRequest->text }}</p>
    <p>Mit freundlichen Grüßen,<br>Das Stechen-Helper Team</p>
</body>
</html>