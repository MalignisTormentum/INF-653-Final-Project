const { json } = require("express/lib/response");
const schem = require("../model/states");
const stateFile = require("../model/state.json");

const getStates = async (req, res) => {
  let States = await schem.find();
  if(!States)
    return res.json(stateFile);

  if (req.query.contig == undefined){
    ret = stateFile;
    for (let i = 0; i < ret.length; i++){
      for (let j = 0; j < States.length; j++){
        if (ret[i].code.toLowerCase() == States[j].stateCode.toLowerCase())
          ret[i].funfacts = States[j].funfacts;
      }
    }
    res.json(ret);
  }
  else {
    if (req.query.contig == "true"){
      let ret = stateFile.filter(state => state.code.toLowerCase() != "ak" && state.code.toLowerCase() != "hi");
      let contig = States.filter(state => state.stateCode != "ak" && state.stateCode != "hi");
      for (let i = 0; i < ret.length; i++){
        for (let j = 0; j < contig.length; j++){
          if (ret[i].code.toLowerCase() == States[j].stateCode.toLowerCase())
            ret[i].funfacts = States[j].funfacts;
        }
      }
      res.json(ret);
    } 
    
    if (req.query.contig == "false"){
      let ret = stateFile.filter(state => state.code.toLowerCase() == "ak" || state.code.toLowerCase() == "hi");
      let uncontig = States.filter(state => state.stateCode == "ak"  || state.stateCode == "hi");
      for (let i = 0; i < ret.length; i++){
        for (let j = 0; j < uncontig.length; j++){
          if (ret[i].code.toLowerCase() == States[j].stateCode.toLowerCase())
            ret[i].funfacts = States[j].funfacts;
        }
      }
      res.json(ret);
    }

    if (req.query.contig != "true" && req.query.contig != "false"){
      res.status(400).send({"Message": "The query must be either true or false."})
    }
  }
};


const getFunFact = async(req, res) => {
  if(!req?.params?.state)
    return res.status(400).send({"Message": "A state code is required."});

  let State = await schem.findOne({"stateCode" : req.params.state.toLowerCase()}).exec();

  if (!State)
    return res.status(400).send({"Message": "No data was found for that state."})
  if(!State.funfacts)
    return res.status(400).send({"Message": "No funfacts were found for that state."})

  res.json({'funfact': State.funfacts[Math.floor(Math.random() * State.funfacts.length)]});
}


const getState = async (req, res) => {
  if(!req?.params?.state)
    return res.status(400).send({"Message": "A state code is required."});

  let State = await schem.findOne({"stateCode" : req.params.state.toLowerCase()}).exec();

  if (!State){
    let ret = stateFile.filter(state => state.code.toLowerCase() == req.params.state.toLowerCase());
    return res.json(ret)
  } else {
    let ret = [];
    let s = stateFile.filter(state => state.code.toLowerCase() == req.params.state.toLowerCase());
    s.funfacts = State.funfacts;
    for (let i = 0; i < s.length; i++){
      ret[i] = s[i];
      if (ret[i].code.toLowerCase() == State.stateCode){
        ret[i].funfacts = State.funfacts;
      }
    }
    return res.send(ret); 
  }
}


const getStateCapital = async(req, res) => {
  let state = stateFile.find(s => s.code.toLowerCase() == req.params.state);

  if(!state)
    return res.status(400).send({"Message": "No data was found for that state."});

  res.json({'state' : state.state, 'capital' : state.capital_city});
}


const getStateNickName = async(req, res) => {
  let state = stateFile.find(s => s.code.toLowerCase() == req.params.state);

  if(!state)
    return res.status(400).send({"Message": "No data was found for that state."});

  res.json({'state' : state.state, 'nickname' : state.nickname});
}


const getStatePopulation = async(req, res) => {
  let state = stateFile.find(s => s.code.toLowerCase() == req.params.state);

  if(!state)
    return res.status(400).send({"Message": "No data was found for that state."});

  res.json({'state' : state.state, 'population' : state.population});
}


const getStateAdmission = async(req, res) => {
  let state = stateFile.find(s => s.code.toLowerCase() == req.params.state);

  if(!state)
    return res.status(400).send({"Message": "No data was found for that state."});

  res.json({'state' : state.state, 'admitted' : state.admission_date});
}


const setStateFunFact = async(req, res) => {
  if(!req?.params?.state)
    return res.status(400).send({"Message": "A state code is required."});
  if (!req?.body?.funfacts)
    return res.status(400).send({"Message": "A funfact must be provided."});
  if (!Array.isArray(req.body.funfacts))
    return res.status(400).send({"Message": "The funfact(s) must be provided in an array."});

  const stateData = await schem.findOne({"stateCode": req.params.state}).exec();

  if (!stateData) {
    const result = await schem.create({"stateCode": req.params.state, "funfacts": req.body.funfacts})
    return res.json(result);
  } else {
    for (let i = 0; i < req.body.funfacts.length; i++){
      stateData.funfacts.push(req.body.funfacts[i]);
    }
    const result = await stateData.save();
    return res.json(result);
  }
}

const updateFunFact = async(req, res) => {
  if(!req?.params?.state)
    return res.status(400).send({"Message": "A state code is required."});
  if(!req?.body?.index)
    return res.status(400).send({"Message": "An index is required."});
  if(!req?.body?.funfact)
    return res.status(400).send({"Message": "A funfact is required."});
  
  const stateData = await schem.findOne({"stateCode": req.params.state}).exec();

  if (!stateData) {
    const result = await schem.create({"stateCode": req.params.state, "funfacts": [req.body.funfact]})
    return res.json(result);
  } else {
    stateData.funfacts[req.body.index - 1] = req.body.funfact;
    const result = await stateData.save();
    return res.json(result);
  }
}

const removeFunFact = async(req, res) => {
  if(!req?.params?.state)
    return res.status(400).send({"Message": "A state code is required."});
  if(!req?.body?.index)
    return res.status(400).send({"Message": "An index is required."});

  const stateData = await schem.findOne({"stateCode": req.params.state}).exec();
  if(!stateData)
    res.send({'Message' : "No data exists for that state."})
  else{
    if(!stateData.funfacts)
      res.send({'Message' : "No funfacts exists for that state."});
    if(stateData.funfacts.length < req.body.index - 1){
      res.status(400).send({'Message' : "Invalid index."});
    }
    stateData.funfacts.splice(req.body.index - 1, 1);
    const result = await stateData.save();
    return res.json(result);
  }
}

module.exports = {
    getStates,
    getState,
    getFunFact,
    getStateCapital,
    getStateNickName,
    getStatePopulation,
    getStateAdmission,
    setStateFunFact,
    updateFunFact,
    removeFunFact
};