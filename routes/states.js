const express = require("express");
const router = express();
const controller = require("../controllers/controller");

router
    .route('/')
    .get(controller.getStates)

router
    .route('/:state')
    .get(controller.getState)

router
    .route('/:state/capital')
    .get(controller.getStateCapital)

router
    .route('/:state/nickname')
    .get(controller.getStateNickName)

router
    .route('/:state/population')
    .get(controller.getStatePopulation)

router
    .route('/:state/admission')
    .get(controller.getStateAdmission)

router
    .route('/:state/funfact')
    .get(controller.getFunFact)
    .post(controller.setStateFunFact)
    .patch(controller.updateFunFact)
    .delete(controller.removeFunFact)

module.exports = router;