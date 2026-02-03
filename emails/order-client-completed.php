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
          <td bgcolor="#010101" align="center" style="padding: 5px 0px 15px; color: #ffffff; font-size: 28px;">
            <?php echo $order["order_number"]; ?>
          </td>
        </tr>

        <tr>
          <td style="padding: 0px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; font-size: 12px; text-transform: uppercase; font-weight: 600;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Cant</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Price</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Total</td>
              </tr>
              <tr>
                <td style="padding: 10px 0px; font-size: 25px; background: #000; color: #fff;"><?php echo $order["ticket_quantity"]; ?></td>
                <td style="padding: 10px 5px; font-size: 25px; background: #000; color: #fff;"><?php echo $raffle["price"]; ?></td>
                <td style="padding: 10px 0px; font-size: 25px; background: #000; color: #fff;"><?php echo $order["total_amount"]; ?></td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td bgcolor="#010101" align="center" style="padding: 10px 0px 15px; color: #ffffff; font-size: 28px;border-top: solid 1px #fff;">
            Numeros generados
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 0px; background: #000;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="50%" valign="top" style="padding: 10px; text-align: left;">
                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left" style="">
                        <p style="color: #FFF; font-size: 16px;">Hemos generado los numeros para tu orden la compra para la rifa <a style="color: #fff;" href="<?php echo $raffle["permalink"]; ?>" target="_blank"><?php echo $raffle["title"]; ?></a> Agradecemos tu participacion en nuestra Rifa.</p>
                        <p style="color: #FFF; font-size: 14px;">En caso de alguna duda o requerimiento, por favor hazlono saber a traves de nuestro Whatsapp, dando <a style="color: #fff;" href="#" target="_blank">Click Aqui.</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
                <td width="50%" valign="top" style="padding: 10px;">
                  <ul style="list-style:none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
                    <?php foreach($numeros as $numero): ?>
                    <li style="color: #fff; display: inline-block; background: red; padding: 5px 10px; border-radius: 5px;"><?php echo $numero; ?></li>
                    <?php endforeach; ?>
                  </ul>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
 