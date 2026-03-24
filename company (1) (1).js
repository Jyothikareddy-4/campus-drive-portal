const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Student = require('../models/Student');

// Add company
router.post('/add', async (req, res) => {
  try {
    const company = new Company(req.body);
    await company.save();
    res.status(201).json({ message: "Company added successfully", company });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all companies
router.get('/all', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get eligible students for a company
router.get('/:id/eligible-students', async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const eligibleStudents = await Student.find({
      cgpa: { $gte: company.minCGPA },
      branch: { $in: company.branches }
    });

    res.json({
      company: company.name,
      eligibleStudents: eligibleStudents
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

// Get eligible students for a company
router.get('/eligible/:id', async (req, res) => {
  try {

    const company = await Company.findById(req.params.id);

    const students = await Student.find({
      cgpa: { $gte: company.minCGPA }
    });

    res.json({
      company: company.company,
      eligibleStudents: students
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});