const PilotImageAccuracy = require('../models/pilotImageAccuracy');

exports.createRecord = async (req, res) => {
    const { userId, imageAccuracies } = req.body;

    try {
        const record = await PilotImageAccuracy.create({
            userId,
            imageAccuracies
        });

        return res.status(201).json({ message: "PilotImageAccuracy saved successfully", record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateRecord = async (req, res) => {
    const { userId, imageAccuracies } = req.body;

    try {
        const [record, created] = await PilotImageAccuracy.findOrCreate({
            where: { userId: userId },
            defaults: { imageAccuracies: imageAccuracies }
        });

        if(!created) {
            record.imageAccuracies = imageAccuracies;
            await record.save();
        }

        return res.status(200).json({ message: "PilotImageAccuracy updated successfully", record });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};