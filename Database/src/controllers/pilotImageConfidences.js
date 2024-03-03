const PilotImageConfidence = require('../models/pilotImageConfidence');

exports.createRecord = async (req, res) => {
    const { userId, imageConfidences } = req.body;

    try {
        const record = await PilotImageConfidence.create({
            userId,
            imageConfidences
        });

        return res.status(201).json({ message: "PilotImageConfidence saved successfully", record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
