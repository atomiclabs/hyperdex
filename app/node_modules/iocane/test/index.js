const sinon = require("sinon");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

const { expect } = chai;

chai.use(chaiAsPromised);

Object.assign(global, {
    expect,
    sinon
});
