<table style="font-family: sans-serif;" border="0" cellpadding="0" cellspacing="0" width="100%" bgcolor="#ffffff">
  <tr>
    <td align="center">
      <table border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse; width: 500px;">

        <tr>
          <td bgcolor="#000000" style="padding: 20px; text-align: left;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td>
                  <img
                    src="https://rifasbodegomunifam.com/wp-content/uploads/2026/01/logo-original.webp"
                    style="width: 300px; margin: auto; display: block; border: 0;" alt="Logo">
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
          <td align="center" style="padding: 0px; background: #000;">
            <table border="0" cellpadding="0" cellspacing="0" width="100%">
              <tr>
                <td width="50%" valign="top" style="padding: 10px; text-align: left;">
                  <h3 style="margin: 0 0 10px 0; font-size: 12px; color: red; font-weight: 400;">Informacion de tu orden
                  </h3>                 

                  <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                      <td align="left" style="">
                        <p style="color: #FFF; font-size: 16px;">Hemos recibido el pago de tu orden para la rifa <a
                            style="color: #fff;" href="<?php echo $raffle["permalink"]; ?>" target="_blank"><?php echo $raffle["title"]; ?></a> cuando recibamos el proximo pago para completar tu orden, seran generados la orden y los numeros a participar.</p>
                        <p style="color: #FFF; font-size: 16px;">Tu deuda es de <?php echo $missing_amount; ?>USD</p>
                        <p style="color: #FFF; font-size: 14px;">En caso de alguna duda o requerimiento, por favor
                          hazlono saber a traves de nuestro Whatsapp, dando <a style="color: #fff;" href="#"
                            target="_blank">Click Aqui.</a></p>
                      </td>
                    </tr>
                  </table>
                </td>
                <td width="50%" valign="top" style="padding: 10px;">
                  <img
                    src="<?php echo $payment_proof; ?>"
                    width="250"
                    style="display: block; width: 100%; max-width: 250px; height: auto; border: 1px solid #ddd;">
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>