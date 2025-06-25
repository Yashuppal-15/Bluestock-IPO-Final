import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: true, uploadDir: "./public/docs", keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload failed' });

    const result = {
      rhp: files.rhp?.[0]?.newFilename || '',
      drhp: files.drhp?.[0]?.newFilename || '',
    };

    return res.status(200).json(result);
  });
}
