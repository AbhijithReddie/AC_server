const mongoose=require('mongoose');

const InterestSchema = mongoose.Schema({
    name: String,
    description: String
});

const interestModel=mongoose.model("interest",InterestSchema);
module.exports={interestModel,InterestSchema};