<?php
$lines = file(__DIR__ . '/../.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

foreach ($lines as $line) {
    if (strpos(trim($line), '#') === 0) continue;
    list($key, $value) = explode('=', $line, 2);
    $_ENV[$key] = $value;
}

$_ENV['RAZORPAY_KEY_ID'] = 'rzp_live_xxxxxxxxxxxxx';
$_ENV['RAZORPAY_KEY_SECRET'] = 'your_secret_key_here';
$_ENV['SITE_URL'] = 'https://yourdomain.com';
?>