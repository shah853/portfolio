const Project = require('../models/Project');

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json(projects);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { title, description, stack, github, live, status, featured, image, video } = req.body;
    const project = await Project.create({
      title,
      description,
      stack,
      links: { github, live },
      image: req.files?.image?.[0]?.path || image,
      video: req.files?.video?.[0]?.path || video,
      status,
      featured,
    });
    return res.status(201).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const { title, description, stack, github, live, status, featured, image, video } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (stack !== undefined) project.stack = stack;
    if (github !== undefined || live !== undefined) {
      project.links = {
        github: github !== undefined ? github : project.links?.github,
        live: live !== undefined ? live : project.links?.live,
      };
    }

    const imagePath = req.files?.image?.[0]?.path;
    const videoPath = req.files?.video?.[0]?.path;
    if (imagePath || image !== undefined) project.image = imagePath || image;
    if (videoPath || video !== undefined) project.video = videoPath || video;
    if (status !== undefined) project.status = status;
    if (featured !== undefined) project.featured = featured;

    await project.save();
    return res.status(200).json(project);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    await project.deleteOne();
    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
