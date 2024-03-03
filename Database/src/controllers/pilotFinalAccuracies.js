const PilotFinalAccuracy = require('../models/pilotFinalAccuracy');

exports.createRecord = async (req, res) => {
    const { userId, finalAccuracy } = req.body;

    try {
        const record = await PilotFinalAccuracy.create({
            userId,
            finalAccuracy
        });

        return res.status(201).json({ message: "PilotFinalAccuracy saved successfully", record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
