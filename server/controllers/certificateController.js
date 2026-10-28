const Certificate = require('../models/Certificate');

const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find().sort({ createdAt: -1 });
    return res.status(200).json(certificates);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createCertificate = async (req, res) => {
  try {
    const { title, issuer, date, recipientName } = req.body;
    const file = req.file?.path || req.body.file;

    const certificateData = { title, issuer, recipientName, file };
    if (date) certificateData.date = date;
    const certificate = await Certificate.create(certificateData);
    return res.status(201).json(certificate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });

    const { title, issuer, date, recipientName, file } = req.body;
    if (title !== undefined) certificate.title = title;
    if (issuer !== undefined) certificate.issuer = issuer;
    if (date !== undefined) certificate.date = date || undefined;
    if (recipientName !== undefined) certificate.recipientName = recipientName;
    if (req.file?.path) certificate.file = req.file.path;
    else if (file !== undefined) certificate.file = file || undefined;

    await certificate.save();
    return res.status(200).json(certificate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    if (!certificate) return res.status(404).json({ message: 'Certificate not found' });
    await certificate.deleteOne();
    return res.status(200).json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCertificates,
  getCertificateById,
  createCertificate,
  updateCertificate,
  deleteCertificate,
};
