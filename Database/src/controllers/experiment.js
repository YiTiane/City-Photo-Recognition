const Experiment = require('../models/experiment');

exports.createRecord = async (req, res) => {
    const { userId, firstAccuracy,
        finalAccuracy, choiceWithoutAI,
        choiceWithAI, confidencesWithoutAI,
        confidencesWithAI } = req.body;

    try {
        const record = await Experiment.create({
            userId,
            firstAccuracy,
            finalAccuracy,
            choiceWithoutAI,
            choiceWithAI,
            confidencesWithoutAI,
            confidencesWithAI
        });

        return res.status(201).json({ message: "Experiment saved successfully", record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.updateRecord = async (req, res) => {
    const { userId, firstAccuracy,
        finalAccuracy, choiceWithoutAI,
        choiceWithAI, confidencesWithoutAI,
        confidencesWithAI } = req.body;

    try {
        const [record, created] = await Experiment.findOrCreate({
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

            await record.save();
        }

        return res.status(200).json({ message: "Experiment updated successfully", record });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
