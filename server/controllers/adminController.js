const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Certificate = require('../models/Certificate');
const Message = require('../models/Message');

const getDashboardStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ read: false });
    const readMessages = await Message.countDocuments({ read: true });

    const recentMessages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const recentProjects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalProjects,
      totalSkills,
      totalCertificates,
      totalMessages,
      unreadMessages,
      readMessages,
      recentMessages,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
};