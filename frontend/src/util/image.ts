export async function fileToDataURL(file: File, maxWidth = 512): Promise<string> {
  // recusa arquivos muito grandes (2MB)
  if (file.size > 2 * 1024 * 1024) {
    throw new Error('Imagem muito grande (máx. 2MB).')
  }

  // cria bitmap e calcula escala
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxWidth / bitmap.width)
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)

  // desenha no canvas e exporta como JPEG (menor tamanho)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0, w, h)

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
  return dataUrl
}
