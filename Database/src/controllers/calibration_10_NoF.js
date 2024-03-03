const Calibration10NoF = require('../models/calibration_10_NoF');

exports.createRecord = async (req, res) => {
    const { userId, firstAccuracy,
        finalAccuracy, choiceWithoutAI,
        choiceWithAI, confidencesWithoutAI,
        confidencesWithAI, elapsedTime, bonusReceived } = req.body;

    try {
        const record = await Calibration10NoF.create({
            userId,
            firstAccuracy,
            finalAccuracy,
            choiceWithoutAI,
            choiceWithAI,
            confidencesWithoutAI,
            confidencesWithAI,
            elapsedTime,
            bonusReceived
        });

        return res.status(201).json({ message: "Calibration10NoF saved successfully", record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateRecord = async (req, res) => {
    const { userId, firstAccuracy,
        finalAccuracy, choiceWithoutAI,
        choiceWithAI, confidencesWithoutAI,
        confidencesWithAI, elapsedTime, bonusReceived } = req.body;

    try {
        const [record, created] = await Calibration10NoF.findOrCreate({
            where: { userId: userId },
            defaults: { firstAccuracy,
                finalAccuracy,
                choiceWithoutAI,
                choiceWithAI,
                confidencesWithoutAI,
                confidencesWithAI }
        });

        if(!created) {
            record.firstAccuracy = firstAccuracy;
            record.finalAccuracy = finalAccuracy;
            record.choiceWithoutAI = choiceWithoutAI;
            record.choiceWithAI = choiceWithAI;
            record.confidencesWithoutAI = confidencesWithoutAI;
            record.confidencesWithAI = confidencesWithAI;
            record.elapsedTime = elapsedTime;
            record.bonusReceived = bonusReceived;

            await record.save();
        }

        return res.status(200).json({ message: "Calibration10NoF updated successfully", record });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
