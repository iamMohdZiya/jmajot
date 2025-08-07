const User = require('../model/user');
const Education = require('../model/education');

exports.handleSignIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    res.cookie('token', token).redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    // res.render('user/login', { error: 'Incorrect Email or Password' });
  }
};

exports.handleLogout = (req, res) => {
  res.clearCookie('token').redirect('/');
};

exports.handleSignUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    res.send('Account created successfully! Please log in.');
  } catch (error) {
    console.error('Signup error:', error);
    // res.render('user/signup', { error: 'Error creating account' });
  }
};

exports.addEducation = async (req, res) => {
  const {
    degree,
    dob,
    department,
    batchYear,
    endDate,
    currentCollege,
    description,
    percentage_10th,
    percentage_12th,
    graduationPercentage
  } = req.body;
 const userId = req.user?._id;
  try {
    const education = new Education({
      userId: userId,
      degree,
      dob,
      department,
      batchYear,
      endDate,
      currentCollege,
      description,
      percentage_10th,
      percentage_12th,
      graduationPercentage
    });

    await education.save();
    res.status(201).json({ message: 'Education added successfully' });

  } catch (error) {
    console.error('Add education error:', error);
    res.status(500).json({ message: 'Error adding education' });
  }
};



exports.updateEducation = async (req, res) => {
  const {
    educationId,
    degree,
    dob,
    department,
    batchYear,
    endDate,
    currentCollege,
    description,
    percentage_10th,
    percentage_12th,
    graduationPercentage
  } = req.body;

  try {
    const education = await Education.findById(educationId);
    if (!education) {
      return res.status(404).json({ message: 'Education entry not found' });
    }

    education.degree = degree;
    education.dob = dob;
    education.department = department;
    education.batchYear = batchYear;
    education.endDate = endDate;
    education.currentCollege = currentCollege;
    education.description = description;
    education.percentage_10th = percentage_10th;
    education.percentage_12th = percentage_12th;
    education.graduationPercentage = graduationPercentage;

    await education.save();
    res.status(200).json({ message: 'Education updated successfully' });

  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
};

exports.handleEducationUpdate = async (req, res) => {
  const { userId, educationId, degree, dob, department, batchYear, endDate, currentCollege, description, percentage_10th, percentage_12th, graduationPercentage } = req.body;

  // Get userId from either request body or authenticated user
  const userIdToUse = userId || (req.user && req.user.id);

  if (!userIdToUse) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // First check if user exists
    const user = await User.findById(userIdToUse);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the education record to update
    let education;
    if (educationId) {
      // If educationId is provided, update that specific record
      education = await Education.findById(educationId);
      if (!education) {
        return res.status(404).json({ message: 'Education record not found' });
      }
      // Verify the education record belongs to this user
      if (education.userId.toString() !== userIdToUse.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this education record' });
      }
    } else {
      // If no educationId, find the first education record for this user
      education = await Education.findOne({ userId: userIdToUse });
      if (!education) {
        return res.status(404).json({ message: 'No education record found for this user' });
      }
    }

    // Update education record
    education.degree = degree || education.degree;
    education.dob = dob || education.dob;
    education.department = department || education.department;
    education.batchYear = batchYear || education.batchYear;
    education.endDate = endDate || education.endDate;
    education.currentCollege = currentCollege || education.currentCollege;
    education.description = description || education.description;
    education.percentage_10th = percentage_10th || education.percentage_10th;
    education.percentage_12th = percentage_12th || education.percentage_12th;
    education.graduationPercentage = graduationPercentage || education.graduationPercentage;

    await education.save();
    res.status(200).json({ message: 'Education updated successfully' });
  } catch (error) {
    console.error('Education update error:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
};

exports.changeEducation = async (req, res) => {
  const {
    userId,
    educationId,
    degree,
    dob,
    department,
    batchYear,
    endDate,
    currentCollege,
    description,
    percentage_10th,
    percentage_12th,
    graduationPercentage
  } = req.body;

  // Get userId from either request body or authenticated user
  const userIdToUse = userId || (req.user && req.user.id);

  if (!userIdToUse) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // First check if user exists
    const user = await User.findById(userIdToUse);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the education record to update
    let education;
    if (educationId) {
      // If educationId is provided, update that specific record
      education = await Education.findById(educationId);
      if (!education) {
        return res.status(404).json({ message: 'Education record not found' });
      }
      // Verify the education record belongs to this user
      if (education.userId.toString() !== userIdToUse.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this education record' });
      }
    } else {
      // If no educationId, find the first education record for this user
      education = await Education.findOne({ userId: userIdToUse });
      if (!education) {
        return res.status(404).json({ message: 'No education record found for this user' });
      }
    }

    // Create an updates object with only the fields that are provided
    const updates = {
      degree,
      dob,
      department,
      batchYear,
      endDate,
      currentCollege,
      description,
      percentage_10th,
      percentage_12th,
      graduationPercentage
    };

    // Apply only the updates that are defined
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        education[key] = updates[key];
      }
    });

    await education.save();
    res.status(200).json({ message: 'Education updated successfully' });

  } catch (error) {
    console.error('Update education error:', error);
    res.status(500).json({ message: 'Error updating education' });
  }
};

// Get education data for a user
exports.getEducation = async (req, res) => {
  // Get userId from either request params, query, or authenticated user
  const userIdToUse = req.params.userId || req.query.userId || (req.user && req.user.id);
  const educationId = req.params.educationId || req.query.educationId;

  if (!userIdToUse) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // First check if user exists
    const user = await User.findById(userIdToUse);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If educationId is provided, get that specific education record
    if (educationId) {
      const education = await Education.findById(educationId);
      if (!education) {
        return res.status(404).json({ message: 'Education record not found' });
      }
      // Verify the education record belongs to this user
      if (education.userId.toString() !== userIdToUse.toString()) {
        return res.status(403).json({ message: 'Not authorized to view this education record' });
      }
      return res.status(200).json(education);
    }

    // Otherwise, get all education records for this user
    const educations = await Education.find({ userId: userIdToUse });
    res.status(200).json(educations);

  } catch (error) {
    console.error('Get education error:', error);
    res.status(500).json({ message: 'Error retrieving education data' });
  }
};

// Delete an education record
exports.deleteEducation = async (req, res) => {
  // Get userId from authenticated user
  const userIdToUse = req.user && req.user.id;
  const educationId = req.params.educationId || req.body.educationId;

  if (!userIdToUse) {
    return res.status(400).json({ message: 'Authentication required' });
  }

  if (!educationId) {
    return res.status(400).json({ message: 'Education ID is required' });
  }

  try {
    // Find the education record
    const education = await Education.findById(educationId);
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }

    // Verify the education record belongs to this user
    if (education.userId.toString() !== userIdToUse.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this education record' });
    }

    // Delete the education record
    await Education.findByIdAndDelete(educationId);
    res.status(200).json({ message: 'Education record deleted successfully' });

  } catch (error) {
    console.error('Delete education error:', error);
    res.status(500).json({ message: 'Error deleting education record' });
  }
};
