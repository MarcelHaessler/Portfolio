<?php
// Prüfen, ob das Formular überhaupt abgeschickt wurde
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // 1. Daten bereinigen (WICHTIG gegen Hacker und Spam!)
    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    // 2. Wohin soll die E-Mail gehen?
    $empfaenger = "kontakt@marcelhaessler.de.de"; // <-- HIER DEINE ECHTE E-MAIL EINTRAGEN
    $betreff = "Neue Kontaktanfrage von $name";

    // 3. E-Mail-Header aufbauen (Hier ist Hetzner streng!)
    // Der Absender (From) SOLLTE eine E-Mail-Adresse deiner Domain sein!
    $absender = "noreply@marcelhaessler.de"; // <-- HIER EINE ADRESSE DEINER DOMAIN EINTRAGEN
    
    $headers = "From: $absender\r\n";
    $headers .= "Reply-To: $email\r\n"; // Damit du direkt auf "Antworten" klicken kannst
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // 4. Der Text der E-Mail
    $email_text = "Du hast eine neue Nachricht erhalten:\n\n";
    $email_text .= "Name: $name\n";
    $email_text .= "E-Mail: $email\n\n";
    $email_text .= "Nachricht:\n$message\n";

    // 5. E-Mail absenden
    if (mail($empfaenger, $betreff, $email_text, $headers)) {
        // Erfolg: Leite den Nutzer auf eine Danke-Seite um (oder zeige eine Nachricht)
        echo "Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.";
    } else {
        // Fehler
        echo "Tut uns leid, es gab einen Fehler beim Senden deiner Nachricht.";
    }
} else {
    // Wenn jemand die PHP-Datei direkt im Browser aufruft
    echo "Bitte nutze das Kontaktformular.";
}
?>