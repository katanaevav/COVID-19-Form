<?php 

require_once('phpmailer/PHPMailerAutoload.php');
$mail = new PHPMailer;
$mail->CharSet = 'utf-8';

$email = $_POST['email'];
$testResult = $_POST['test-result'];

if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
  $mail->isSMTP();
  $mail->Host = 'smtp.mail.ru';
  $mail->SMTPAuth = true;
  $mail->Username = 'testuser2075@mail.ru';
  $mail->Password = 'oS&aTgITy4i2';
  $mail->SMTPSecure = 'ssl';
  $mail->Port = 465;

  $mail->setFrom('testuser2075@mail.ru', 'Онлайн-тест на коронавирус онлайн');
  $mail->addAddress($email);
  $mail->isHTML(true);

  $mail->Subject = 'Результат тестирования на короновирус';
  $mail->Body    = 'Добрй день! <br><br>' .
                      'Вы проходили онлайн тест на возможное наличие короновирусной инфекции в вашем организме ' .
                      'на странице <a href="https://nosgid.ru/beremennost/koronavirusnaya-bolezn-covid-19-i-beremennost">https://nosgid.ru/beremennost/koronavirusnaya-bolezn-covid-19-i-beremennost</a></br><br>' .
                      'Результат вашего тестирования: <strong>' .$testResult . '%</strong><br><br><br>' .
                      'Если вы набрали по результатам теста 80% и более, рекомендуем следить за своим состоянием в ближайшие часы и при усугублении симптомов позвонить в медучреждение.<br><br>' .
                      'Берегите себя и своих близких. Будьте здоровы!<br><br>' .
                      'Внимание! Результат теста не является диагнозом. За точными данными обращайтесь к врачу.<br><br><br>' .
                      'Данное письмо сформировано автоматически и отвечать на него не нужно.<br><br><br>' .
                      'С уважением, <a href="https://nosgid.ru/">Доктор НОС</a>';
  $mail->AltBody = '';

  if(!$mail->send()) {
    echo 'Error sending message';
  } else {
    echo 'Message sent';
  }
}
?>