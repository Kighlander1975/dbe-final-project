<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Host-Anfrage eingereicht</title>
</head>
<body>
    <h1>Deine Host-Anfrage wurde eingereicht</h1>
    <p>Hallo {{ $hostRequest->user->name }},</p>
    <p>Wir haben deine Anfrage erhalten, Host zu werden. Ein Administrator wird sich schnellstmöglich darum kümmern.</p>
    <p><strong>Deine Begründung:</strong></p>
    <p>{{ $hostRequest->text }}</p>
    <p>Mit freundlichen Grüßen,<br>Das Stechen-Helper Team</p>
</body>
</html>