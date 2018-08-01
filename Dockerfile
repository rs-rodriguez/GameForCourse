#
# Mi sitio web
# as

# Se construye sobre la base de la imagen nginx
FROM nginx:1.15-alpine

# Se agregan metadatos a la imagen
LABEL Descripción="Mi Game" Autor="Samuel Guardado" Versión="v1.0.0"

# Se copian los ficheros hacia la carpeta de nginx
COPY static-html /usr/share/nginx/html
