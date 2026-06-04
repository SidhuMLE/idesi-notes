// Generates Android launcher icons from assets/icon.png using sharp.
// Avoids @capacitor/assets which overwrites the Gradle wrapper with an old version.
import sharp from 'sharp'
import { mkdirSync } from 'fs'
import { join } from 'path'

const SIZES = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
}

const src = 'assets/icon.png'
const base = 'android/app/src/main/res'

for (const [dir, size] of Object.entries(SIZES)) {
  const outDir = join(base, dir)
  mkdirSync(outDir, { recursive: true })
  await sharp(src).resize(size, size).toFile(join(outDir, 'ic_launcher.png'))
  await sharp(src).resize(size, size).toFile(join(outDir, 'ic_launcher_round.png'))
  console.log(`✓ ${dir} (${size}x${size})`)
}

console.log('Icons generated.')
