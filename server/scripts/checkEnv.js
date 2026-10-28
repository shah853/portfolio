require('dotenv').config();

const requiredKeys = [
  'MONGO_URI',
  'JWT_SECRET',
  'PORT',
  'ADMIN_NAME',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
];
const optionalKeys = [
  'CLIENT_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

let hasMissingRequired = false;

requiredKeys.forEach((key) => {
  const isSet = Boolean(process.env[key]?.trim());
  console.log(`${key}: ${isSet ? 'SET' : 'MISSING'}`);
  if (!isSet) hasMissingRequired = true;
});

optionalKeys.forEach((key) => {
  const isSet = Boolean(process.env[key]?.trim());
  console.log(`${key}: ${isSet ? 'SET' : 'MISSING'}`);
  if (!isSet) console.warn(`Warning: optional environment variable ${key} is missing.`);
});

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  console.warn('Warning: JWT_SECRET should be at least 32 characters long.');
}

if (process.env.MONGO_URI && /[<>]/.test(process.env.MONGO_URI)) {
  console.warn('Warning: MONGO_URI contains angle brackets; replace placeholder characters.');
}

if (hasMissingRequired) {
  process.exitCode = 1;
}
