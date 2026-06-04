// Generates Android launcher icons from assets/icon.png using sharp.
// Covers both legacy PNGs (all Android) and adaptive icon foreground layers (Android 8+).
import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const src = 'assets/icon.png'
const base = 'android/app/src/main/res'

// Standard launcher icon sizes
const ICON_SIZES = {
  'mipmap-mdpi':    48,
  'mipmap-hdpi':    72,
  'mipmap-xhdpi':   96,
  'mipmap-xxhdpi':  144,
  'mipmap-xxxhdpi': 192,
}

// Adaptive icon foreground sizes (108dp at each density — full canvas incl. bleed zone)
const FOREGROUND_SIZES = {
  'mipmap-mdpi':    108,
  'mipmap-hdpi':    162,
  'mipmap-xhdpi':   216,
  'mipmap-xxhdpi':  324,
  'mipmap-xxxhdpi': 432,
}

// 1. Legacy launcher icons
for (const [dir, size] of Object.entries(ICON_SIZES)) {
  const outDir = join(base, dir)
  mkdirSync(outDir, { recursive: true })
  await sharp(src).resize(size, size).toFile(join(outDir, 'ic_launcher.png'))
  await sharp(src).resize(size, size).toFile(join(outDir, 'ic_launcher_round.png'))
  console.log(`✓ ${dir} legacy (${size}x${size})`)
}

// 2. Adaptive icon foreground layers — icon centered on transparent canvas
for (const [dir, canvas] of Object.entries(FOREGROUND_SIZES)) {
  const outDir = join(base, dir)
  mkdirSync(outDir, { recursive: true })
  // Safe zone is 66% of canvas — scale icon to fit inside it
  const iconSize = Math.round(canvas * 0.66)
  const offset = Math.round((canvas - iconSize) / 2)
  await sharp(src)
    .resize(iconSize, iconSize)
    .extend({ top: offset, bottom: canvas - iconSize - offset, left: offset, right: canvas - iconSize - offset, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toFile(join(outDir, 'ic_launcher_foreground.png'))
  console.log(`✓ ${dir} foreground (${canvas}x${canvas}, icon ${iconSize}x${iconSize})`)
}

// 3. Use temple ivory (#FAF5EC) as adaptive icon background colour
const valuesDir = join(base, 'values')
mkdirSync(valuesDir, { recursive: true })
writeFileSync(
  join(valuesDir, 'ic_launcher_background.xml'),
  `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FAF5EC</color>\n</resources>\n`
)
console.log('✓ adaptive icon background → temple ivory #FAF5EC')

// 4. Monochrome notification status-bar icon (white-on-transparent silhouette)
//    Android requires notification smallIcon to be white on transparent — colored icons
//    render as a white blob in the status bar.
const notifSizes = {
  'drawable-mdpi':    24,
  'drawable-hdpi':    36,
  'drawable-xhdpi':   48,
  'drawable-xxhdpi':  72,
  'drawable-xxxhdpi': 96,
}
for (const [dir, size] of Object.entries(notifSizes)) {
  const outDir = join(base, dir)
  mkdirSync(outDir, { recursive: true })
  // Resize icon, extract alpha as mask, composite onto white background → then
  // flatten to white-on-transparent by keeping only the luma channel as alpha.
  const { data, info } = await sharp(src)
    .resize(size, size)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  // Set all RGB to white (255,255,255) while keeping the alpha channel as-is
  for (let i = 0; i < info.width * info.height; i++) {
    data[i * 4 + 0] = 255
    data[i * 4 + 1] = 255
    data[i * 4 + 2] = 255
  }
  await sharp(Buffer.from(data), {
    raw: { width: info.width, height: info.height, channels: 4 },
  }).png().toFile(join(outDir, 'ic_stat_notify.png'))
  console.log(`✓ ${dir} notification icon (${size}x${size})`)
}

console.log('Icons generated.')
