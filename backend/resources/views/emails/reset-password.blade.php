<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Passwort zurücksetzen</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 50px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            font-size: 24px;
        }
        p {
            color: #555;
            line-height: 1.6;
        }
        .token-box {
            background-color: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 16px;
            word-break: break-all;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #999;
        }
        .warning {
            background-color: #fff3cd;
            padding: 10px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Passwort zurücksetzen</h1>
        
        <p>Hallo <strong>{{ $userName }}</strong>,</p>
        
        <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
        
        <p>Verwende den folgenden Token, um dein Passwort zurückzusetzen:</p>
        
        <div class="token-box">
            {{ $token }}
        </div>
        
        <div class="warning">
            <strong>⚠️ Wichtig:</strong> Dieser Token ist nur <strong>60 Minuten</strong> gültig.
        </div>
        
        <p>Falls du diese Anfrage nicht gestellt hast, ignoriere diese E-Mail einfach.</p>
        
        <div class="footer">
            <p>Mit freundlichen Grüßen,<br>Dein Stechen Helper Team</p>
            <p style="font-size: 11px; color: #bbb;">Diese E-Mail wurde automatisch generiert. Bitte antworte nicht darauf.</p>
        </div>
    </div>
</body>
</html>
