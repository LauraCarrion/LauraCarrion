/**
 * Cloudflare Pages — puerta del origen.
 *
 * Este proyecto solo debe responder a peticiones que vengan del Worker que pide
 * la contraseña. Cualquier otra —la URL *.pages.dev directa, una preview, un
 * buscador— recibe 404, de forma que no exista un atajo para saltarse la puerta.
 *
 * Requiere la variable ORIGIN_SECRET, con el mismo valor que en el Worker.
 */
export function onRequest(context) {
  const expected = context.env.ORIGIN_SECRET;
  const sent = context.request.headers.get("X-Portfolio-Origin");

  // Sin secreto configurado no se sirve nada: falla cerrado, nunca abierto.
  if (!expected || !sent || !timingSafeEqual(sent, expected)) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }

  return context.next();
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;

  let difference = 0;
  for (let i = 0; i < a.length; i++) {
    difference |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return difference === 0;
}
