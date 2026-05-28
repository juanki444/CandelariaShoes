#!/bin/bash
cd assets || exit

# Renombrar las que están en el seed
mv "sandalias1.jpg" "sandalia-brisa-1.jpg" 2>/dev/null
mv "sandalias2.jpg" "sandalia-brisa-2.jpg" 2>/dev/null
mv "img1.jpg" "sandalia-cacao-1.jpg" 2>/dev/null
mv "img2.jpg" "sandalia-cacao-2.jpg" 2>/dev/null
mv "sandalias 3.jpg" "sandalia-atardecer.jpg" 2>/dev/null
mv "sandalias4.jpg" "sandalia-flora-1.jpg" 2>/dev/null
mv "sandalias 5.jpg" "sandalia-flora-2.jpg" 2>/dev/null
mv "img3.jpg" "sandalia-palma.jpg" 2>/dev/null
mv "sandalias 7.jpg" "sandalia-solsticio-1.jpg" 2>/dev/null
mv "sandalias 8.jpg" "sandalia-solsticio-2.jpg" 2>/dev/null
mv "sandalias 9.jpg" "sandalia-mompox.jpg" 2>/dev/null
mv "sandalias 10.jpg" "sandalia-caribe.jpg" 2>/dev/null

# Limpiar espacios y estandarizar el resto
for file in *; do
  if [ -f "$file" ]; then
    new_name=$(echo "$file" | tr ' ' '-' | tr 'A-Z' 'a-z' | sed 's/sandalias/sandalia/g' | sed 's/-\([0-9]\)/-\1/g' | sed 's/-\+/-/g')
    if [ "$file" != "$new_name" ]; then
      mv "$file" "$new_name" 2>/dev/null
    fi
  fi
done

echo "¡Imágenes renombradas a kebab-case exitosamente!"
