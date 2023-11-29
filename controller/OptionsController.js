const Option = require('../models/options');
const Question = require('../models/questions');

module.exports.create = async function (req, res) {
    try {
        console.log(req.body, req.params.id);

        const opt = await Option.create({
            option: req.body.content,
            question: req.params.id,
        });

        const updateOpt = await Option.findByIdAndUpdate(opt._id, { $set: { add_vote: `http://localhost:3000/api/v1/options/${opt._id}/add_vote` } }, { new: true });

        const ques = await Question.findById(req.params.id);

        if (ques) {
            ques.options.push(updateOpt);
            await ques.save();

            console.log(ques);
            res.send(ques);
        } else {
            res.status(404).send('Question not found');
        }
    } catch (err) {
        console.error('Error creating option:', err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.add_vote = async function (req, res) {
    try {
        console.log(req.params.id);

        const opt = await Option.findByIdAndUpdate(req.params.id, { $inc: { vote: 1 } }, { new: true });

        if (opt) {
            await opt.save();
            console.log(opt);
            res.send(opt);
        } else {
            res.status(404).send('Option not found');
        }
    } catch (err) {
        console.error('Error adding vote to option:', err);
        res.status(500).send('Internal Server Error');
    }
};


module.exports.delete = async function (req, res) {
    try {
        console.log('id', req.params.id);

        const opt = await Option.findById(req.params.id);

        if (opt) {
            const quesId = opt.question;
            const ques = await Question.findByIdAndUpdate(quesId, { $pull: { options: req.params.id } }, { new: true });
            await Option.findByIdAndDelete(req.params.id);

            console.log(ques);
            res.send('Option deleted');
        } else {
            res.status(404).send('Option not found');
        }
    } catch (err) {
        console.error('Error deleting option:', err);
        res.status(500).send('Internal Server Error');
    }
};
