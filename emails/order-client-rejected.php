<?php

$header = sprintf("Hola %s tu orden %s ha sido rechazada", $order['customer_name'], $order['order_number']);
$reason = sprintf("El motivo: %s", $reason);


?>
<table style="font-family: sans-serif;" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
  <tr>
    <td align="center">
      <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; width: 500px;">

        <tr>
          <td bgcolor="#000000" style="padding: 20px; text-align: left;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <img src="https://rifasbodegomunifam.com/wp-content/uploads/2026/01/logo-original.webp" style="width: 300px; margin: auto; display: block; border: 0;" alt="Logo">
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td colspan="1" bgcolor="#010101" align="center" style="padding: 5px 0px 15px; color: #ffffff; font-size: 28px;">
            <?php echo $header; ?>
          </td>
        </tr>

        <tr>
            <td colspan="1" bgcolor="#010101" align="center" style="padding: 5px 0px 15px; color: #ffffff; font-size: 18px;">
            <?php echo $reason; ?>
          </td>
        </tr>

        <tr>
          <td style="padding: 0px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; font-size: 12px; text-transform: uppercase; font-weight: 600;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Cant</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Order Total</td>
              </tr>
              <tr>
                <td style="padding: 10px 0px; font-size: 25px; background: #000; color: #fff;"><?php echo $order["ticket_quantity"]; ?></td>
                <td style="padding: 10px 0px; font-size: 25px; background: #000; color: #fff;"><?php echo $order["total_amount"]; ?></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
 