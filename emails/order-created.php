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
            <?php echo $order_number; ?>
          </td>
        </tr>

        <tr>
          <td style="padding: 0px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; font-size: 12px; text-transform: uppercase; font-weight: 600;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Nombre</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Correo</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Telefono</td>
              </tr>
              <tr>
                <td style="padding: 10px 0px; font-size: 12px; background: #000; color: #fff;">
                  <?php echo $order_customer["name"]; ?>
                </td>
                <td style="padding: 10px 5px; font-size: 12px; background: #000; color: #fff;">
                  <?php echo $order_customer["email"]; ?>
                </td>
                <td style="padding: 10px 0px; font-size: 12px; background: #000; color: #fff;">
                  <?php echo $order_customer["phone"]; ?>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding: 0px;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="text-align: center; font-size: 12px; text-transform: uppercase; font-weight: 600;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Cantidad</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Precio Unitario</td>
                <td style="padding: 10px; border-bottom: 1px solid #000000; background: red; color: #fff;">Precio Total</td>
              </tr>
              <tr>
                <td style="padding: 10px 0px; font-size: 25px; background: #000; color: #fff;">
                  <?php echo $order_quantity; ?>
                </td>
                <td style="padding: 10px 5px; font-size: 25px; background: #000; color: #fff;">
                  <?php echo $raffle["price"]; ?>
                </td>
                <td style="padding: 10px 0px; font-size: 25px; background: #000; color: #fff;">
                  <?php echo $order_total; ?>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <tr>
          <td align="center" style="padding: 0px; background: #000;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="50%" valign="top" style="padding: 10px; text-align: left;">
                  <h3 style="margin: 0 0 10px 0; font-size: 12px; color: red; font-weight: 400;">COMPROBANTE DE PAGO</h3>
                  <!--<p style="margin: 5px 0; font-size: 12px; color: #fff;font-weight: 600;">METODO</p>
                  <p style="margin: 0 0 15px 0; font-weight: bold; font-size: 18px; color: #FFF; font-weight: 400;">BANCOLOMBIA</p>-->

                  <table border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                    <tr>
                      <td align="center" style="">
                        <a href="https://rifasbodegomunifam.com/wp-admin/admin.php?page=juzt-raffle#/order/view/<?php echo $order_id; ?>" target="_blank" style="padding: 15px 10px; color: #ffffff; text-decoration: none; font-weight: 400; display: block; width: 100%; border-radius: 4px; border: solid 1px #FFF;">Ver en admin</a>
                        <a style="display: none;" href="http://rifas-boodegom-unifam-v6.localhost:8080/wp-admin/admin.php?page=juzt-raffle#/order/view/<?php echo $order_id; ?>" target="_blank" style="padding: 15px 10px; color: #ffffff; text-decoration: none; font-weight: 400; display: block; width: 100%; border-radius: 4px; border: solid 1px #FFF;">Ver en admin</a>
                      </td>
                    </tr>
                  </table>
                </td>
                <td width="50%" valign="top" style="padding: 10px;">
                  <img src="<?php echo $payment_proof; ?>" width="250" style="display: block; width: 100%; max-width: 250px; height: auto; border: 1px solid #ddd;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
</table>