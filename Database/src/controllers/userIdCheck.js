const Calibration = require('../models/calibration');

exports.checkUserId = async (req, res) => {
    const { userId } = req.body;
    try {
        const existingUser = await Calibration.findOne({ where: { userId } });
        if(existingUser) {
            return res.status(200).json({ userExists: true });
        }
        return res.status(200).json({ userExists: false });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
