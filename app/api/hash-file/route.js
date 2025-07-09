import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export default async function handler(req, res) {
  try {
    const filePath = path.join(process.cwd(), 'public', 'sample.pdf');
    const fileBuffer = fs.readFileSync(filePath);

    const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    console.log("PDF Hash (SHA-256):", hash);

    res.status(200).json({ hash });
  } catch (err) {
    console.error("Error computing hash:", err);
    res.status(500).json({ error: 'Failed to compute hash' });
  }
}
