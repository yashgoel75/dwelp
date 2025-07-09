import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hash, signature } = body;

  if (!hash || !signature) {
    return NextResponse.json({ error: 'Missing hash or signature' }, { status: 400 });
  }

  try {
    const publicKeyPath = path.join(process.cwd(), 'keys', 'public.pem');
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');

    const verifier = crypto.createVerify('SHA256');
    verifier.update(Buffer.from(hash, 'hex'));
    verifier.end();

    const isValid = verifier.verify(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
      },
      Buffer.from(signature, 'base64')
    );

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Verification failed:', error);
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
