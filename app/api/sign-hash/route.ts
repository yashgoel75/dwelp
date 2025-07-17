import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { hash } = body;

  if (!hash) {
    return NextResponse.json({ error: 'Missing hash' }, { status: 400 });
  }

  try {
    const privateKey = process.env.PRIVATE_KEY?.replace(/\\n/g, '\n');
    if (!privateKey) {
      return NextResponse.json({ error: 'Private key not configured' }, { status: 500 });
    }

    const signer = crypto.createSign('SHA256');
    const hex = hash.startsWith("0x") ? hash.slice(2) : hash;
    signer.update(Buffer.from(hex, 'hex'));
    signer.end();

    const signature = signer.sign({
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
    });

    const signatureBase64 = signature.toString('base64');

    return NextResponse.json({ signature: signatureBase64 });
  } catch (error) {
    console.error('Signing failed:', error);
    return NextResponse.json({ error: 'Signing failed' }, { status: 500 });
  }
}
