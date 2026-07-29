import QRCode from 'qrcode';

/**
 * Gera o "Pix Copia e Cola" estático (BR Code / padrão EMV do Banco Central)
 * e o QR Code correspondente. É uma transferência Pix direta para a chave do
 * recebedor — não passa por adquirente, portanto sem taxa.
 */

export interface PixConfig {
  /** Chave Pix (CPF/CNPJ, e-mail, telefone ou chave aleatória). */
  key: string;
  /** Nome do recebedor (máx. 25 caracteres, sem acentos). */
  merchantName: string;
  /** Cidade do recebedor (máx. 15 caracteres, sem acentos). */
  merchantCity: string;
}

export interface BuildPixInput extends PixConfig {
  /** Valor em centavos. Use 0/undefined para deixar o pagador digitar o valor. */
  amountCents?: number;
  /** Identificador da transação (txid). Máx. 25 caracteres alfanuméricos. */
  txid?: string;
}

/** Monta um campo TLV: id (2) + tamanho (2, zero-padded) + valor. */
function tlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

/** Remove acentos e caracteres não-ASCII, deixando o texto compatível com EMV. */
function sanitizeText(value: string, maxLength: number): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove diacríticos combinantes
    .replace(/[^\x20-\x7E]/g, '')
    .trim()
    .toUpperCase()
    .slice(0, maxLength);
}

/** Mantém apenas alfanuméricos no txid (regra do BR Code). */
function sanitizeTxid(value: string): string {
  const cleaned = value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 25);
  return cleaned.length > 0 ? cleaned : '***';
}

/** CRC16-CCITT (polinômio 0x1021, valor inicial 0xFFFF). */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

/** Retorna a string "Pix Copia e Cola" (BR Code). */
export function buildPixPayload(input: BuildPixInput): string {
  const merchantName = sanitizeText(input.merchantName, 25);
  const merchantCity = sanitizeText(input.merchantCity, 15);
  const txid = sanitizeTxid(input.txid ?? '***');

  // Campo 26: Merchant Account Information (Pix)
  const merchantAccount =
    tlv('00', 'br.gov.bcb.pix') + tlv('01', input.key.trim());

  // Campo 62: Additional Data Field (referência/txid)
  const additionalData = tlv('05', txid);

  let payload =
    tlv('00', '01') + // Payload Format Indicator
    tlv('26', merchantAccount) +
    tlv('52', '0000') + // Merchant Category Code
    tlv('53', '986') + // Moeda: BRL
    (input.amountCents && input.amountCents > 0
      ? tlv('54', (input.amountCents / 100).toFixed(2))
      : '') +
    tlv('58', 'BR') + // País
    tlv('59', merchantName) +
    tlv('60', merchantCity) +
    tlv('62', additionalData);

  // Campo 63: CRC16 (calculado sobre o payload + "6304")
  payload += '6304';
  return payload + crc16(payload);
}

/** Retorna o BR Code e o QR Code (SVG data URL) para um presente. */
export async function buildPix(input: BuildPixInput): Promise<{
  copyPaste: string;
  qrSvg: string;
}> {
  const copyPaste = buildPixPayload(input);
  const qrSvg = await QRCode.toString(copyPaste, {
    type: 'svg',
    margin: 1,
    errorCorrectionLevel: 'M',
  });
  return { copyPaste, qrSvg };
}
