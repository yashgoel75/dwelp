import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hash, signature } = body;

  if (!hash || !signature) {
    return NextResponse.json({ error: 'Missing hash or signature' }, { status: 400 });
  }

  try {
   const publicKey = process.env.PUBLIC_KEY?.replace(/\\n/g, '\n');

    if (!publicKey) {
      return NextResponse.json({ error: 'Public key not configured' }, { status: 500 });
    }

    const verifier = crypto.createVerify('SHA256');
    const hex = hash.startsWith("0x") ? hash.slice(2) : hash;
    verifier.update(Buffer.from(hex, 'hex'));
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
