const Question=require('../models/questions')
const Option=require('../models/options')

module.exports.create = async function (req, res) {
    console.log(req.url);
    console.log(req.body);

    try {
        const ques = await Question.create(req.body);
        console.log(ques);
        res.send(ques);
    } catch (err) {
        console.error("Error in creating the question schema", err);
        res.status(500).send("Internal Server Error");
    }
};


module.exports.showDetails = async function (req, res) {
    try {
        console.log(req.params.id);

        const ques = await Question.findById(req.params.id).populate('options');

        if (ques) {
            res.send(ques);
        } else {
            res.status(404).send("Question not found");
        }
    } catch (err) {
        console.error("Error fetching question details:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports.deleteQues = async function (req, res) {
    try {
        const ques = await Question.findById(req.params.id);

        if (ques) {
            // Delete all options related to the question
            await Option.deleteMany({ question: req.params.id });

            // Delete the question itself
            await Question.findByIdAndDelete(req.params.id);

            res.send("Question deleted");
        } else {
            res.status(404).send('Question not found');
        }
    } catch (err) {
        console.error("Error deleting question:", err);
        res.status(500).send("Internal Server Error");
    }
};
