const Message = require('../models/Message');

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createMessage = async (req, res) => {
  if (req.body.website) {
    return res.status(400).json({ message: 'Invalid message submission' });
  }

  try {
    const { name, email, subject, message } = req.body;
    const newMessage = await Message.create({ name, email, subject, message });
    return res.status(201).json(newMessage);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const markAsUnread = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: false },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    await message.deleteOne();
    return res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  getMessageById,
  createMessage,
  markAsRead,
  markAsUnread,
  deleteMessage,
};
