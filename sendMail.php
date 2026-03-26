<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $name = htmlspecialchars(strip_tags(trim($_POST["name"])));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = htmlspecialchars(strip_tags(trim($_POST["message"])));

    $empfaenger = "kontakt@marcelhaessler.de"; 
    $betreff = "Neue Kontaktanfrage von $name";

    
    $absender = "noreply@marcelhaessler.de"; 
    
    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n"; 
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    $email_text = "Du hast eine neue Nachricht erhalten:\n\n";
    $email_text .= "Name: $name\n";
    $email_text .= "E-Mail: $email\n\n";
    $email_text .= "Nachricht:\n$message\n";

    if (mail($empfaenger, $betreff, $email_text, $headers)) {
        
        echo "Vielen Dank! Deine Nachricht wurde erfolgreich gesendet.";
    } else {
        
        echo "Tut uns leid, es gab einen Fehler beim Senden deiner Nachricht.";
    }
} else {
    
    echo "Bitte nutze das Kontaktformular.";
}
?>