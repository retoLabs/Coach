
<?php 
    ini_set( 'display_errors', 1 );
    error_reporting( E_ALL );
    $from = "info@marigold.es";
    $to = "pepe@reto-labs.es";
    $subject = "Prueba de envio de email con PHP";
    $message = "Esto es un email de prueba enviado con PHP";
    $headers = "From:" . $from;
    mail($to,$subject,$message, $headers);
    echo "Email enviado!!";
?>
